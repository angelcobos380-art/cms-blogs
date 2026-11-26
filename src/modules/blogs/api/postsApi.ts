import { httpClient } from '@core/api/httpClient';
import type { Paginated } from '@core/api/pagination';
import type {
  CreatePostPayload,
  PatchPostPayload,
  Post,
  PostListItem,
  PostsFilters,
} from '../types/post.types';

export const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  list: (filters: PostsFilters) => [...postKeys.lists(), filters] as const,
  details: () => [...postKeys.all, 'detail'] as const,
  detail: (postId: string) => [...postKeys.details(), postId] as const,
};

export const postsApi = {
  async list(filters: PostsFilters = {}): Promise<Paginated<PostListItem>> {
    const params: Record<string, string | number> = {
      page: filters.page ?? 1,
      page_size: filters.page_size ?? 20,
      sort: filters.sort ?? '-updated_at',
    };
    if (filters.status && filters.status !== 'ALL') params.status = filters.status;
    if (filters.tag?.trim()) params.tag = filters.tag.trim();
    if (filters.q?.trim()) params.q = filters.q.trim();

    const { data } = await httpClient.get<Paginated<PostListItem>>('/posts', { params });
    return data;
  },

  async getById(postId: string): Promise<Post> {
    const { data } = await httpClient.get<Post>(`/posts/${postId}`);
    return data;
  },

  async create(payload: CreatePostPayload): Promise<Post> {
    const { data } = await httpClient.post<Post>('/posts', payload);
    return data;
  },

  async patch(postId: string, payload: PatchPostPayload): Promise<Post> {
    const { data } = await httpClient.patch<Post>(`/posts/${postId}`, payload);
    return data;
  },

  async publish(postId: string): Promise<Post> {
    const { data } = await httpClient.post<Post>(`/posts/${postId}/publish`);
    return data;
  },

  async unpublish(postId: string): Promise<Post> {
    const { data } = await httpClient.post<Post>(`/posts/${postId}/unpublish`);
    return data;
  },

  async archive(postId: string): Promise<Post> {
    const { data } = await httpClient.post<Post>(`/posts/${postId}/archive`);
    return data;
  },

  async restore(postId: string): Promise<Post> {
    const { data } = await httpClient.post<Post>(`/posts/${postId}/restore`);
    return data;
  },

  async remove(postId: string): Promise<void> {
    await httpClient.delete(`/posts/${postId}`);
  },
};
