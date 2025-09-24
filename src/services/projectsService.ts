import { config } from "@/config/env";

export interface ProjectInput {
  title: string;
  description?: string | null;
  genre?: string | null;
  bpm?: number | null;
  status?: string | null;
  isOpenToCollab?: boolean;
}

export interface Project extends ProjectInput {
  id: number;
  collaborators: number;
  tracks: number;
  lastUpdate: string; // ISO
  createdAt: string; // ISO
}

const STORAGE_KEY = "aureavox_projects";

function readStorage(): Project[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as Project[];
    return [];
  } catch {
    return [];
  }
}

function writeStorage(projects: Project[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token de autenticação não encontrado");
  const response = await fetch(`${config.apiUrl}${path}`, {
    ...init,
    headers: {
      ...(init?.headers || {}),
      Authorization: `Bearer ${token}`,
      "Content-Type": init?.body instanceof FormData ? undefined as unknown as string : "application/json",
    },
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || `Erro API ${response.status}`);
  }
  return response.json();
}

function mapApiProject(p: any): Project {
  return {
    id: p.id,
    title: p.title,
    description: p.description ?? null,
    genre: p.genre ?? null,
    bpm: p.bpm ?? null,
    status: p.status ?? "Ideação",
    isOpenToCollab: Boolean(p.is_open_to_collab ?? p.isOpenToCollab ?? true),
    collaborators: p.collaborators_count ?? p.collaborators ?? 1,
    tracks: (Array.isArray(p.tracks) ? p.tracks.length : (p.tracks_count ?? p.tracks ?? 0)),
    lastUpdate: p.updated_at ?? p.lastUpdate ?? new Date().toISOString(),
    createdAt: p.created_at ?? p.createdAt ?? new Date().toISOString(),
  };
}

export async function getProjects(): Promise<Project[]> {
  try {
    const data = await apiFetch<any>(`/projects`);
    const items: any[] = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : []);
    return items.map(mapApiProject);
  } catch {
    return readStorage();
  }
}

export async function getProjectById(id: number): Promise<Project | null> {
  try {
    const data = await apiFetch<any>(`/projects/${id}`);
    return mapApiProject(data);
  } catch {
    return readStorage().find(p => p.id === id) ?? null;
  }
}

export async function addProject(input: ProjectInput): Promise<Project> {
  try {
    const payload = {
      title: input.title.trim(),
      description: input.description ?? null,
      genre: input.genre ?? null,
      bpm: input.bpm ?? null,
      status: input.status ?? "Ideação",
      is_open_to_collab: input.isOpenToCollab ?? true,
    };
    const data = await apiFetch<any>(`/projects`, { method: "POST", body: JSON.stringify(payload) });
    return mapApiProject(data);
  } catch {
    const projects = readStorage();
    const nextId = projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1;
    const nowIso = new Date().toISOString();
    const newProject: Project = {
      id: nextId,
      title: input.title.trim(),
      description: input.description ?? null,
      genre: input.genre ?? null,
      bpm: input.bpm ?? null,
      status: input.status ?? "Ideação",
      isOpenToCollab: input.isOpenToCollab ?? true,
      collaborators: 1,
      tracks: 0,
      lastUpdate: nowIso,
      createdAt: nowIso,
    };
    projects.push(newProject);
    writeStorage(projects);
    return newProject;
  }
}

export async function updateProject(id: number, patch: Partial<ProjectInput> & Partial<Pick<Project, "tracks" | "collaborators">>): Promise<Project | null> {
  try {
    const payload: any = { ...patch };
    if (payload.isOpenToCollab !== undefined) payload.is_open_to_collab = payload.isOpenToCollab;
    const data = await apiFetch<any>(`/projects/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
    return mapApiProject(data);
  } catch {
    const projects = readStorage();
    const idx = projects.findIndex(p => p.id === id);
    if (idx === -1) return null;
    const updated: Project = {
      ...projects[idx],
      ...patch,
      lastUpdate: new Date().toISOString(),
    };
    projects[idx] = updated;
    writeStorage(projects);
    return updated;
  }
}

export async function deleteProject(id: number): Promise<void> {
  try {
    await apiFetch<void>(`/projects/${id}`, { method: "DELETE" });
  } catch {
    const projects = readStorage().filter(p => p.id !== id);
    writeStorage(projects);
  }
}


