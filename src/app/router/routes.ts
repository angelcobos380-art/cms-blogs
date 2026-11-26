export const ROUTES = {
  LOGIN: '/login',
  HOME: '/',
  DASHBOARD: '/dashboard',
  BLOGS: '/blogs',
  BLOG_EDITOR: '/blogs/:postId',
  blogEditor: (postId: string) => `/blogs/${postId}`,
  TEMPLATES: '/templates',
  TEMPLATE_NEW: '/templates/new',
  TEMPLATE_EDITOR: '/templates/:templateId',
  templateEditor: (templateId: string) => `/templates/${templateId}`,
} as const;
