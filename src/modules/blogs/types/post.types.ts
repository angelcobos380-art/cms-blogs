export type PostStatus = 'BORRADOR' | 'PUBLICADO' | 'ARCHIVADO';

export interface SeoMeta {
  title?: string | null;
  description?: string | null;
  og_image?: string | null;
}

export interface PostListItem {
  post_id: string;
  slug: string;
  title: string;
  status: PostStatus;
  tags: string[];
  excerpt: string | null;
  cover_image_url: string | null;
  template_id: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface Post extends PostListItem {
  seo: SeoMeta | null;
  content_json: Record<string, unknown> | null;
  content_html: string | null;
  content: string | null;
  content_schema_version: number | null;
}

export interface PostsFilters {
  status?: PostStatus | 'ALL';
  tag?: string;
  q?: string;
  sort?: string;
  page?: number;
  page_size?: number;
}

export interface CreatePostPayload {
  title: string;
  slug?: string;
  tags?: string[];
  template_id?: string | null;
  excerpt?: string | null;
}

export interface PatchPostPayload {
  title?: string;
  slug?: string;
  tags?: string[];
  template_id?: string | null;
  excerpt?: string | null;
  cover_image_url?: string | null;
  seo?: SeoMeta | null;
  content_json?: Record<string, unknown> | null;
  content_html?: string | null;
  content?: string | null;
  content_schema_version?: number | null;
}

export interface MediaUploadResponse {
  media_id: string;
  url: string;
  mime: string;
  size: number;
  width: number | null;
  height: number | null;
  alt: string | null;
  created_at: string;
}
