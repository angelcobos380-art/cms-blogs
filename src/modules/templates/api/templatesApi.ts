import { httpClient } from '@core/api/httpClient';
import type { Paginated } from '@core/api/pagination';
import type { Template, TemplateStatus } from '../types/template.types';

export const templateKeys = {
  all: ['templates'] as const,
  list: (params: { status?: TemplateStatus | 'ALL'; page?: number; page_size?: number }) =>
    [...templateKeys.all, 'list', params] as const,
  detail: (id: string) => [...templateKeys.all, 'detail', id] as const,
};

export const templatesApi = {
  async list(params: { status?: TemplateStatus | 'ALL'; page?: number; page_size?: number } = {}) {
    const { data } = await httpClient.get<Paginated<Template>>('/templates', { params });
    return data;
  },
};
