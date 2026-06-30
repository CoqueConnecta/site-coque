import { lazy } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom';

import PublicLayout from './pages/PublicLayout';
import Site from './pages/Site';

const LoginPage = lazy(() => import('./pages/LoginPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const TransparencyPage = lazy(() => import('./pages/TransparencyPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const WaysToHelpPage = lazy(() => import('./pages/WaysToHelpPage'));

// Admin sub-routes (lazy)
const HomeRoute = lazy(() => import('./features/admin/routes/home/HomeRoute').then(m => ({ default: m.HomeRoute })));
const ProjectsRoute = lazy(() => import('./features/admin/routes/projects/ProjectsRoute').then(m => ({ default: m.ProjectsRoute })));
const PrivacyRoute = lazy(() => import('./features/admin/routes/privacy/PrivacyRoute').then(m => ({ default: m.PrivacyRoute })));
const TransparencyRoute = lazy(() => import('./features/admin/routes/transparency/TransparencyRoute').then(m => ({ default: m.TransparencyRoute })));
const SettingsRoute = lazy(() => import('./features/admin/routes/settings/SettingsRoute').then(m => ({ default: m.SettingsRoute })));
const MediaLibraryRoute = lazy(() => import('./features/admin/routes/media/MediaLibraryRoute').then(m => ({ default: m.MediaLibraryRoute })));

const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <Site />,
      },
      {
        path: "privacidade",
        element: <PrivacyPage />,
      },
      {
        path: "transparencia",
        element: <TransparencyPage />,
      },
      {
        path: "nossos-projetos",
        element: <ProjectsPage />,
      },
      {
        path: "quem-somos",
        element: <AboutPage />,
      },
      {
        path: "como-ajudar",
        element: <WaysToHelpPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminPage />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="home" replace /> },
      { path: 'home',             element: <HomeRoute /> },
      { path: 'nossos-projetos',  element: <ProjectsRoute /> },
      { path: 'privacidade',      element: <PrivacyRoute /> },
      { path: 'transparencia',    element: <TransparencyRoute /> },
      { path: 'configuracoes',    element: <SettingsRoute /> },
      { path: 'biblioteca',       element: <MediaLibraryRoute /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
