import { api } from './client';

export interface Rule {
  id: string;
  flag_id: string;
  rule_type: string;
  rule_value: string;
  enabled: boolean;
  priority: number;
  created_at: string;
}

export const rulesApi = {
  list: (projectId: string, envId: string, flagId: string) =>
    api.get<Rule[]>(`/projects/${projectId}/environments/${envId}/flags/${flagId}/rules`),
  create: (projectId: string, envId: string, flagId: string, data: { rule_type: string; rule_value: string; enabled?: boolean; priority?: number }) =>
    api.post<Rule>(`/projects/${projectId}/environments/${envId}/flags/${flagId}/rules`, data),
  update: (projectId: string, envId: string, flagId: string, ruleId: string, data: { rule_value?: string; enabled?: boolean; priority?: number }) =>
    api.put<Rule>(`/projects/${projectId}/environments/${envId}/flags/${flagId}/rules/${ruleId}`, data),
  delete: (projectId: string, envId: string, flagId: string, ruleId: string) =>
    api.delete<void>(`/projects/${projectId}/environments/${envId}/flags/${flagId}/rules/${ruleId}`),
};
