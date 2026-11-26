import { useQuery } from '@tanstack/react-query';
import { postKeys, postsApi } from '../api/postsApi';

export function usePost(postId: string | undefined) {
  return useQuery({
    queryKey: postKeys.detail(postId ?? ''),
    queryFn: () => postsApi.getById(postId!),
    enabled: Boolean(postId),
  });
}
