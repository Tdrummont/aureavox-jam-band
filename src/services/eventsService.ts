// API + local fallback for events (shows, rehearsals, recordings)
import { config } from "@/config/env";

export type EventType = "rehearsal" | "show" | "recording";

export interface EventParticipant {
  name: string;
  confirmed: boolean;
}

export interface EventInput {
  title: string;
  type: EventType;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  duration?: string | null;
  location?: string | null;
  setlist?: string | null;
  notes?: string | null;
  participants?: EventParticipant[];
}

export interface BandEvent extends EventInput {
  id: number;
  createdAt: string; // ISO
}

const STORAGE_KEY = "aureavox_events";

function readStorage(): BandEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as BandEvent[];
    return [];
  } catch {
    return [];
  }
}

function writeStorage(events: BandEvent[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token de autenticação não encontrado");
  const response = await fetch(`${config.apiUrl}${path}`, {
    ...init,
    headers: {
      ...(init?.headers || {}),
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || `Erro API ${response.status}`);
  }
  return response.json();
}

function mapApiEvent(e: any): BandEvent {
  return {
    id: e.id,
    title: e.title,
    type: e.type,
    date: e.date,
    time: e.time,
    duration: e.duration ?? null,
    location: e.location ?? null,
    setlist: e.setlist ?? null,
    notes: e.notes ?? null,
    participants: [],
    createdAt: e.created_at ?? new Date().toISOString(),
  };
}

export interface GetEventsParams {
  type?: EventType | "all";
  from?: string; // YYYY-MM-DD
  to?: string;   // YYYY-MM-DD
  page?: number;
  per_page?: number;
}

export async function getEvents(params?: GetEventsParams): Promise<BandEvent[]> {
  try {
    const q = new URLSearchParams();
    if (params?.type && params.type !== "all") q.set("type", params.type);
    if (params?.from) q.set("from", params.from);
    if (params?.to) q.set("to", params.to);
    if (params?.page) q.set("page", String(params.page));
    if (params?.per_page) q.set("per_page", String(params.per_page));
    const qs = q.toString();
    const data = await apiFetch<any>(`/events${qs ? `?${qs}` : ""}`);
    const items: any[] = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : []);
    return items.map(mapApiEvent);
  } catch {
    return readStorage().sort((a, b) => {
      const aDate = new Date(`${a.date}T${a.time}:00`);
      const bDate = new Date(`${b.date}T${b.time}:00`);
      return aDate.getTime() - bDate.getTime();
    });
  }
}

export async function addEvent(input: EventInput): Promise<BandEvent> {
  try {
    const payload = { ...input };
    const data = await apiFetch<any>(`/events`, { method: "POST", body: JSON.stringify(payload) });
    return mapApiEvent(data);
  } catch {
    const events = readStorage();
    const nextId = events.length > 0 ? Math.max(...events.map(e => e.id)) + 1 : 1;
    const newEvent: BandEvent = {
      id: nextId,
      createdAt: new Date().toISOString(),
      participants: [],
      duration: input.duration ?? null,
      location: input.location ?? null,
      setlist: input.setlist ?? null,
      notes: input.notes ?? null,
      ...input,
    };
    events.push(newEvent);
    writeStorage(events);
    return newEvent;
  }
}

export async function updateEvent(id: number, patch: Partial<EventInput>): Promise<BandEvent | null> {
  try {
    const data = await apiFetch<any>(`/events/${id}`, { method: "PATCH", body: JSON.stringify(patch) });
    return mapApiEvent(data);
  } catch {
    const events = readStorage();
    const idx = events.findIndex(e => e.id === id);
    if (idx === -1) return null;
    const updated: BandEvent = { ...events[idx], ...patch };
    events[idx] = updated;
    writeStorage(events);
    return updated;
  }
}

export async function deleteEvent(id: number): Promise<void> {
  try {
    await apiFetch<void>(`/events/${id}`, { method: "DELETE" });
  } catch {
    const events = readStorage().filter(e => e.id !== id);
    writeStorage(events);
  }
}


