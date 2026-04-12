import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import PublicLayout from "./pages/PublicLayout";
import Site from "./pages/Site";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import ProtectedRoute from "./components/ProtectedRoute";
import PrivacyPage from "./pages/PrivacyPage";
import TransparencyPage from "./pages/TransparencyPage";
import NotFoundPage from "./pages/NotFoundPage";

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
