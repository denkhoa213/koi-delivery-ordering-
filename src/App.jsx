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
import OrderForm from "./pages/form-page/order";
import FishProfileForm from "./pages/form-page/fishProfile";
import DeliveryServiceList from "./components/list-service/service-delivery";
import HealthServiceList from "./components/list-service/service-health";
import CustomsDeclarationForm from "./pages/form-page/declaration";
import TotalOrder from "./pages/form-page/totalDetailOrder";
import OrderSuccess from "./pages/order-success";
import CustomerTemplate from "./components/customer-template";
import CustomerProfile from "./pages/customer-page/customer-profile";
import CustomerOrder from "./pages/customer-page/customer-order";
import ManageUser from "./pages/dashboard/manager/manage-users";
import ManageHealthService from "./pages/dashboard/manager/manage-health-service";
import ManageFishCategory from "./pages/dashboard/manager/manage-fish-categories";
import ManageDelivery from "./pages/dashboard/manager/manage-delivery-method";
import OverViewTotal from "./pages/dashboard/manager/over-view";
import DashboarManager from "./components/dashboard/dashboard-manager";
import DashboardSaleStaff from "./components/dashboard/dashboard-sale-staff";
import DashboardDeliveryStaff from "./components/dashboard/dashboard-delivery-staff";
import CheckHealth from "./pages/dashboard/delivery-staff/manage-checkHealth";
import ManagePackage from "./pages/dashboard/delivery-staff/manage-package";
import HealthcareHistoryManager from "./pages/dashboard/delivery-staff/manage-health-history";
import HandoverForm from "./pages/dashboard/sale-staff/handOver";
import CustomerDeclatation from "./pages/dashboard/sale-staff/customer-declatation";
import Report from "./pages/dashboard/sale-staff/report";
import Profile from "./components/profile";

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
      path: "/dashboard-manager",
      element: (
        <ProtectRouterAuth>
          <DashboarManager />
        </ProtectRouterAuth>
      ),
      children: [
        {
          path: "profile",
          element: <Profile />,
        },
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
      path: "/dashboard-sale-staff",
      element: (
        <ProtectRouterAuth>
          <DashboardSaleStaff />
        </ProtectRouterAuth>
      ),
      children: [
        {
          path: "profile",
          element: <Profile />,
        },
        {
          path: "hand-over",
          element: <HandoverForm />,
        },
        {
          path: "customer-declatation",
          element: <CustomerDeclatation />,
        },
        {
          path: "report",
          element: <Report />,
        },
      ],
    },
    {
      path: "/dashboard-delivery-staff",
      element: (
        <ProtectRouterAuth>
          <DashboardDeliveryStaff />
        </ProtectRouterAuth>
      ),
      children: [
        {
          path: "profile",
          element: <Profile />,
        },
        {
          path: "check-health-fish",
          element: <CheckHealth />,
        },
        {
          path: "create-package",
          element: <ManagePackage />,
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
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
