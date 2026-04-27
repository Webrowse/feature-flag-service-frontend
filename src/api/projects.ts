import { api } from './client';

export interface Project {
  id: string;
  name: string;
  description: string | null;
  sdk_key: string;
  created_at: string;
  updated_at: string;
}

export const projectsApi = {
  list: () => api.get<Project[]>('/projects'),
  get: (id: string) => api.get<Project>(`/projects/${id}`),
  create: (name: string, description?: string) =>
    api.post<Project>('/projects', { name, description }),
  update: (id: string, data: { name?: string; description?: string }) =>
    api.put<Project>(`/projects/${id}`, data),
  delete: (id: string) => api.delete<void>(`/projects/${id}`),
  regenerateKey: (id: string) =>
    api.post<Project>(`/projects/${id}/regenerate-key`, {}),
};
