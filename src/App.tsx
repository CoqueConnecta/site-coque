import { lazy } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
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
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
