import { useQuery } from '@tanstack/react-query';
import { templateKeys, templatesApi } from '../api/templatesApi';
import type { TemplateStatus } from '../types/template.types';

export function useTemplates(status: TemplateStatus | 'ALL' = 'ACTIVA') {
  return useQuery({
    queryKey: templateKeys.list({ status, page: 1, page_size: 100 }),
    queryFn: () => templatesApi.list({ status, page: 1, page_size: 100 }),
  });
}
