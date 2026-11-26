import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LoginPage } from '@core/auth/LoginPage';
import { DashboardPage } from '@dashboard';
import { PostEditorPage, PostsListPage } from '@blogs';
import { TemplateEditorPage, TemplatesPage } from '@templates';
import { AppShell } from '../layout/AppShell';
import { NotFoundPage } from './NotFoundPage';
import { ProtectedRoute } from './ProtectedRoute';
import { ROUTES } from './routes';

export const router = createBrowserRouter([
  { path: ROUTES.LOGIN, element: <LoginPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          { path: ROUTES.HOME, element: <Navigate to={ROUTES.DASHBOARD} replace /> },
          { path: ROUTES.DASHBOARD, element: <DashboardPage /> },
          { path: ROUTES.BLOGS, element: <PostsListPage /> },
          { path: ROUTES.BLOG_EDITOR, element: <PostEditorPage /> },
          { path: ROUTES.TEMPLATES, element: <TemplatesPage /> },
          { path: ROUTES.TEMPLATE_NEW, element: <TemplateEditorPage /> },
          { path: ROUTES.TEMPLATE_EDITOR, element: <TemplateEditorPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);
