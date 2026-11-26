import { useQuery } from '@tanstack/react-query';
import { templateKeys, templatesApi } from '../api/templatesApi';

export function useTemplate(templateId: string | undefined) {
  return useQuery({
    queryKey: templateKeys.detail(templateId ?? ''),
    queryFn: () => templatesApi.getById(templateId!),
    enabled: Boolean(templateId && templateId !== 'new'),
  });
}
