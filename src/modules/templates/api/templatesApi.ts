import { httpClient } from '@core/api/httpClient';
import type { Paginated } from '@core/api/pagination';
import type { Template, TemplateStatus, TemplateTokens } from '../types/template.types';

export interface TemplateListParams {
  status?: TemplateStatus | 'ALL';
  q?: string;
  page?: number;
  page_size?: number;
}

export interface TemplatePayload {
  name: string;
  description: string;
  tokens: TemplateTokens;
}

export const templateKeys = {
  all: ['templates'] as const,
  list: (params: TemplateListParams) => [...templateKeys.all, 'list', params] as const,
  detail: (id: string) => [...templateKeys.all, 'detail', id] as const,
};

export const templatesApi = {
  async list(params: TemplateListParams = {}) {
    const { data } = await httpClient.get<Paginated<Template>>('/templates', { params });
    return data;
  },

  async getById(id: string) {
    const { data } = await httpClient.get<Template>(`/templates/${id}`);
    return data;
  },

  async create(payload: TemplatePayload) {
    const { data } = await httpClient.post<Template>('/templates', payload);
    return data;
  },

  async update(id: string, payload: Partial<TemplatePayload>) {
    const { data } = await httpClient.put<Template>(`/templates/${id}`, payload);
    return data;
  },

  async duplicate(id: string) {
    const { data } = await httpClient.post<Template>(`/templates/${id}/duplicate`);
    return data;
  },

  async archive(id: string) {
    const { data } = await httpClient.post<Template>(`/templates/${id}/archive`);
    return data;
  },

  async restore(id: string) {
    const { data } = await httpClient.post<Template>(`/templates/${id}/restore`);
    return data;
  },

  async setDefault(id: string) {
    const { data } = await httpClient.post<Template>(`/templates/${id}/set-default`);
    return data;
  },

  async remove(id: string) {
    await httpClient.delete(`/templates/${id}`);
  },
};
