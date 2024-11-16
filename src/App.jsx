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
import Dashboard from "./components/dashboard/dashboard-admin";
import ManageHealthService from "./pages/dashboard/admin/manage-health-service";
import OrderForm from "./pages/form-page/order";
import FishProfileForm from "./pages/form-page/fishProfile";
import ManageFishCategory from "./pages/dashboard/admin/manage-fish-categories";
import DeliveryServiceList from "./components/list-service/service-delivery";
import HealthServiceList from "./components/list-service/service-health";
import ManageDelivery from "./pages/dashboard/admin/manage-delivery-method";
import CustomsDeclarationForm from "./pages/form-page/declaration";
import DashboardStaff from "./components/dashboard/dashboard-staff";
import DashboardManager from "./components/dashboard/dashboard-manager";
import ManageOrder from "./pages/dashboard/manager/manage-order";
import CheckHealth from "./pages/dashboard/staff/manage-checkHealth";
import ManagePackage from "./pages/dashboard/staff/manage-package";
import TotalOrder from "./pages/form-page/totalDetailOrder";
import HealthcareHistoryManager from "./pages/dashboard/staff/manage-health-history";
import HandoverForm from "./pages/dashboard/staff/handOver";
import OverViewTotal from "./pages/dashboard/admin/over-view";
import OrderSuccess from "./pages/order-success";

import ManageUser from "./pages/dashboard/admin/manage-users";
import CustomerTemplate from "./components/customer-template";
import CustomerProfile from "./pages/customer-page/customer-profile";
import CustomerOrder from "./pages/customer-page/customer-order";

function App() {
  const ProtectRouterAuth = ({ children }) => {
    const user = useSelector((store) => store.user);
    if (
      user &&
      (user.role === "MANAGER" ||
        user.role === "SALE_STAFF" ||
        user.role === "DELIVERY_STAFF" ||
        user.role === "CUSTOMER")
    ) {
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
          element: <DeliveryServiceList />,
        },
        {
          path: "health-services",
          element: <HealthServiceList />,
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
          path: "manage-user",
          element: <ManageUser />,
        },
        {
          path: "health-service-category",
          element: <ManageHealthService />,
        },
        {
          path: "fish-category",
          element: <ManageFishCategory />,
        },
        {
          path: "manage-delivery",
          element: <ManageDelivery />,
        },
        {
          path: "over-view",
          element: <OverViewTotal />,
        },
      ],
    },
    {
      path: "/dashboard-manager",
      element: (
        <ProtectRouterAuth>
          <DashboardManager />
        </ProtectRouterAuth>
      ),
      children: [
        {
          path: "manage-order",
          element: <ManageOrder />,
        },
        {
          path: "health-service-category",
          element: <ManageHealthService />,
        },
        {
          path: "fish-category",
          element: <ManageFishCategory />,
        },
        {
          path: "manage-delivery",
          element: <ManageDelivery />,
        },
      ],
    },
    {
      path: "/dashboard-staff",
      element: (
        <ProtectRouterAuth>
          <DashboardStaff />
        </ProtectRouterAuth>
      ),
      children: [
        {
          path: "check-health-fish",
          element: <CheckHealth />,
        },
        {
          path: "create-package",
          element: <ManagePackage />,
        },
        {
          path: "hand-over",
          element: <HandoverForm />,
        },
        {
          path: "manage-health-care-history",
          element: <HealthcareHistoryManager />,
        },
      ],
    },

    {
      path: "form-order",
      element: <OrderForm />,
    },
    {
      path: "fish-profile/:orderId",
      element: <FishProfileForm />,
    },
    {
      path: "form-declaration/:orderId",
      element: <CustomsDeclarationForm />,
    },
    {
      path: "total-order/:orderId",
      element: <TotalOrder />,
    },

    {
      path: "check",
      element: <HealthCheckForm />,
    },

    {
      path: "order-success",
      element: <OrderSuccess />,
    },

    {
      path: "customer",
      element: <CustomerTemplate />,
      children: [
        {
          path: "customer-profile",
          element: <CustomerProfile />,
        },
        {
          path: "customer-order",
          element: <CustomerOrder />,
        },

      ]
    },

  ]);

  return <RouterProvider router={router} />;
}

export default App;
