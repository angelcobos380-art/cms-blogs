import { useQuery } from '@tanstack/react-query';
import { postKeys, postsApi } from '../api/postsApi';
import type { PostsFilters } from '../types/post.types';

export function usePosts(filters: PostsFilters) {
  return useQuery({
    queryKey: postKeys.list(filters),
    queryFn: () => postsApi.list(filters),
  });
}
