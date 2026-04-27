import { api } from './client';

export interface Environment {
  id: string;
  project_id: string;
  name: string;
  key: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export const environmentsApi = {
  list: (projectId: string) =>
    api.get<Environment[]>(`/projects/${projectId}/environments`),
  get: (projectId: string, envId: string) =>
    api.get<Environment>(`/projects/${projectId}/environments/${envId}`),
  create: (projectId: string, data: { name: string; key: string; description?: string }) =>
    api.post<Environment>(`/projects/${projectId}/environments`, data),
  update: (projectId: string, envId: string, data: { name?: string; description?: string }) =>
    api.put<Environment>(`/projects/${projectId}/environments/${envId}`, data),
  delete: (projectId: string, envId: string) =>
    api.delete<void>(`/projects/${projectId}/environments/${envId}`),
};
