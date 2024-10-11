import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import HomePage from "./pages/home-page";
import LoginPage from "./pages/login-page";
import RegisterPage from "./pages/register-page";
import ManageCategory from "./pages/dashboard/admin/manage-category";
import Dashboard from "./components/dashboard";
import ManageServiceGroup from "./pages/dashboard/admin/manage-store-group";
import ManageStore from "./pages/dashboard/admin/manage-store";
import Test from "./pages/test/test";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Layout from "./components/layout";
import OrderTransportation from "./components/order-form";
import HealthCheckForm from "./components/check";
import About from "./components/about";
import Contact from "./components/contact";
import Support from "./components/support";
import ServiceList from "./components/list-service";
import ServiceDetail from "./components/detail-service";

function App() {
  const ProtectRouterAuth = ({ children }) => {
    const user = useSelector((store) => store.user);
    if (user && user?.role === "ADMIN") {
      return children;
    }
    toast.error("You are not allowed to access this!");

    return <Navigate to={"/login"} />;
  };

  const router = createBrowserRouter([
    {
      path: "",
      element: <Layout />,
      children: [
        {
          path: "",
          element: <HomePage />,
        },
        {
          path: "about",
          element: <About />,
        },
        {
          path: "support",
          element: <Support />,
        },
        {
          path: "contact",
          element: <Contact />,
        },
        {
          path: "services",
          element: <ServiceList />,
        },
        {
          path: "services/:id",
          element: <ServiceDetail />,
        },
      ],
    },
    {
      path: "test",
      element: <Test />,
    },

    {
      path: "login",
      element: <LoginPage />,
    },
    {
      path: "register",
      element: <RegisterPage />,
    },
    {
      path: "/dashboard",
      element: (
        <ProtectRouterAuth>
          <Dashboard />
        </ProtectRouterAuth>
      ),
      children: [
        {
          path: "category",
          element: <ManageCategory />,
        },
        {
          path: "store",
          element: <ManageStore />,
        },
        {
          path: "service-group",
          element: <ManageServiceGroup />,
        },
      ],
    },
    {
      path: "form",
      element: <OrderTransportation />,
    },
    {
      path: "check",
      element: <HealthCheckForm />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
