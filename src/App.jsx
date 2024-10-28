import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import HomePage from "./pages/home-page";
import LoginPage from "./pages/login-page";
import RegisterPage from "./pages/register-page";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Layout from "./components/layout";
import HealthCheckForm from "./components/check";
import About from "./components/about";
import Contact from "./components/contact";
import Support from "./components/support";
import ServiceDetail from "./components/detail-service";
import ServiceList from "./components/list-service/service-delivery";
import Dashboard from "./components/dashboard/dashboard-admin";
import ManageHealthService from "./pages/dashboard/admin/manage-health-service";
import FormLayout from "./components/layout/layout-form";
import OrderForm from "./pages/form-page/order";
import CustomsDeclarationForm from "./pages/form-page/declaration";
import FishProfileForm from "./pages/form-page/fishProfile";
import HealthService from "./pages/form-page/healthService";
import CertificateForm from "./pages/form-page/certificate";

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
      path: "login",
      element: <LoginPage />,
    },
    {
      path: "register",
      element: <RegisterPage />,
    },
    {
      path: "/dashboard-admin",
      element: (
        <ProtectRouterAuth>
          <Dashboard />
        </ProtectRouterAuth>
      ),
      children: [
        {
          path: "health-service-category",
          element: <ManageHealthService />,
        },
        {
          path: "manage-user",
          element: <ManageHealthService />,
        },
      ],
    },
    {
      path: "/",
      element: <FormLayout />,
      children: [
        {
          path: "form-order",
          element: <OrderForm />,
        },
        {
          path: "fish-profile/:orderId",
          element: <FishProfileForm />,
        },
        {
          path: "certificate",
          element: <CertificateForm />,
        },
        {
          path: "health-service",
          element: <HealthService />,
        },
        {
          path: "form-declaration",
          element: <CustomsDeclarationForm />,
        },
      ],
    },

    {
      path: "check",
      element: <HealthCheckForm />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
