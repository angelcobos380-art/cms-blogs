import { useMutation, useQueryClient } from '@tanstack/react-query';
import { templateKeys, templatesApi, type TemplatePayload } from '../api/templatesApi';

export function useTemplateMutations() {
  const queryClient = useQueryClient();

  const invalidate = (id?: string) => {
    queryClient.invalidateQueries({ queryKey: templateKeys.all });
    if (id) queryClient.invalidateQueries({ queryKey: templateKeys.detail(id) });
  };

  const create = useMutation({
    mutationFn: (payload: TemplatePayload) => templatesApi.create(payload),
    onSuccess: (created) => invalidate(created.template_id),
  });

  const update = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<TemplatePayload> }) =>
      templatesApi.update(id, payload),
    onSuccess: (updated) => invalidate(updated.template_id),
  });

  const duplicate = useMutation({
    mutationFn: (id: string) => templatesApi.duplicate(id),
    onSuccess: () => invalidate(),
  });

  const archive = useMutation({
    mutationFn: (id: string) => templatesApi.archive(id),
    onSuccess: (updated) => invalidate(updated.template_id),
  });

  const restore = useMutation({
    mutationFn: (id: string) => templatesApi.restore(id),
    onSuccess: (updated) => invalidate(updated.template_id),
  });

  const setDefault = useMutation({
    mutationFn: (id: string) => templatesApi.setDefault(id),
    onSuccess: () => invalidate(),
  });

  const remove = useMutation({
    mutationFn: (id: string) => templatesApi.remove(id),
    onSuccess: () => invalidate(),
  });

  return { create, update, duplicate, archive, restore, setDefault, remove };
}
