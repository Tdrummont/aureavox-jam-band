export interface TrackUploadData {
  projectId: number;
  file: Blob;
  kind?: string;
  offsetMs?: number;
}

export interface TrackResponse {
  id: number;
  project_id: number;
  user_id: number;
  kind: string;
  path_original: string;
  path_wav: string | null;
  duration_ms: number;
  offset_ms: number;
  sample_rate: number;
  gain_db: number;
  mute: boolean;
  solo: boolean;
  created_at: string;
  updated_at: string;
}

import { config } from '@/config/env';

export async function uploadTrack(data: TrackUploadData): Promise<TrackResponse> {
  const formData = new FormData();
  formData.append('file', data.file, 'take.webm');
  formData.append('kind', data.kind || 'voice');
  formData.append('offset_ms', String(data.offsetMs || 0));

  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Token de autenticação não encontrado');
  }

  const response = await fetch(`${config.apiUrl}/projects/${data.projectId}/tracks`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Upload falhou: ${response.status}`);
  }

  return response.json();
}

export async function getProjectTracks(projectId: number): Promise<TrackResponse[]> {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Token de autenticação não encontrado');
  }

  const response = await fetch(`${config.apiUrl}/projects/${projectId}/tracks`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Falha ao carregar trilhas: ${response.status}`);
  }

  return response.json();
}

export async function updateTrackOffset(projectId: number, trackId: number, offsetMs: number): Promise<TrackResponse> {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Token de autenticação não encontrado');
  }

  const response = await fetch(`${config.apiUrl}/projects/${projectId}/tracks/${trackId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ offset_ms: offsetMs }),
  });

  if (!response.ok) {
    throw new Error(`Falha ao atualizar offset: ${response.status}`);
  }

  return response.json();
}

export async function updateTrackSettings(
  projectId: number, 
  trackId: number, 
  settings: { gain_db?: number; mute?: boolean; solo?: boolean }
): Promise<TrackResponse> {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Token de autenticação não encontrado');
  }

  const response = await fetch(`${config.apiUrl}/projects/${projectId}/tracks/${trackId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(settings),
  });

  if (!response.ok) {
    throw new Error(`Falha ao atualizar configurações: ${response.status}`);
  }

  return response.json();
}

export async function deleteTrack(projectId: number, trackId: number): Promise<void> {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Token de autenticação não encontrado');
  }

  const response = await fetch(`${config.apiUrl}/projects/${projectId}/tracks/${trackId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Falha ao deletar trilha: ${response.status}`);
  }
}
