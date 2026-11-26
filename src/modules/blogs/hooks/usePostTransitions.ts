import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postKeys, postsApi } from '../api/postsApi';

export function usePostTransitions() {
  const queryClient = useQueryClient();

  const invalidateAll = (postId?: string) => {
    queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    queryClient.invalidateQueries({ queryKey: ['metrics'] });
    if (postId) {
      queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) });
    }
  };

  const publish = useMutation({
    mutationFn: (postId: string) => postsApi.publish(postId),
    onSuccess: (updated) => invalidateAll(updated.post_id),
  });

  const unpublish = useMutation({
    mutationFn: (postId: string) => postsApi.unpublish(postId),
    onSuccess: (updated) => invalidateAll(updated.post_id),
  });

  const archive = useMutation({
    mutationFn: (postId: string) => postsApi.archive(postId),
    onSuccess: (updated) => invalidateAll(updated.post_id),
  });

  const restore = useMutation({
    mutationFn: (postId: string) => postsApi.restore(postId),
    onSuccess: (updated) => invalidateAll(updated.post_id),
  });

  const remove = useMutation({
    mutationFn: (postId: string) => postsApi.remove(postId),
    onSuccess: () => invalidateAll(),
  });

  return { publish, unpublish, archive, restore, remove };
}
