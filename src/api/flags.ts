import { api } from './client';

export interface Flag {
  id: string;
  environment_id: string;
  name: string;
  key: string;
  enabled: boolean;
  rollout_percentage: number;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export const flagsApi = {
  list: (projectId: string, envId: string) =>
    api.get<Flag[]>(`/projects/${projectId}/environments/${envId}/flags`),
  get: (projectId: string, envId: string, flagId: string) =>
    api.get<Flag>(`/projects/${projectId}/environments/${envId}/flags/${flagId}`),
  create: (projectId: string, envId: string, data: { name: string; key: string; description?: string; rollout_percentage?: number }) =>
    api.post<Flag>(`/projects/${projectId}/environments/${envId}/flags`, data),
  update: (projectId: string, envId: string, flagId: string, data: { name?: string; enabled?: boolean; rollout_percentage?: number; description?: string }) =>
    api.put<Flag>(`/projects/${projectId}/environments/${envId}/flags/${flagId}`, data),
  delete: (projectId: string, envId: string, flagId: string) =>
    api.delete<void>(`/projects/${projectId}/environments/${envId}/flags/${flagId}`),
};
