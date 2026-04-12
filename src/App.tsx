import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Site from "./pages/Site";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import ProtectedRoute from "./components/ProtectedRoute";
import PrivacyPage from "./pages/PrivacyPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Site />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/privacidade",
    element: <PrivacyPage />,
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
