import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postKeys, postsApi } from '../api/postsApi';
import type { CreatePostPayload, PatchPostPayload } from '../types/post.types';

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePostPayload) => postsApi.create(payload),
    onSuccess: (created) => {
      queryClient.setQueryData(postKeys.detail(created.post_id), created);
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
}

export function useSavePost(postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: PatchPostPayload) => postsApi.patch(postId, payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(postKeys.detail(postId), updated);
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
}
