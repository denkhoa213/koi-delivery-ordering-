// import { useState } from "react";
// import "./App.css";

// const App = () => {
//   const [activeTab, setActiveTab] = useState(null);
//   const [activeSubTab, setActiveSubTab] = useState(null); // Biến mới để lưu sub-tab

//   const handleTabClick = (tab) => {
//     setActiveTab(tab);
//     setActiveSubTab(null); // Đặt lại sub-tab khi chuyển tab
//   };

//   const handleSubTabClick = (subTab) => {
//     setActiveSubTab(subTab);
//   };

//   return (
//     <div>
//       <div className="header">
//         <button onClick={() => handleTabClick("tra-cuu")}>Tra cứu</button>
//         <button onClick={() => handleTabClick("dich-vu")}>Dịch vụ</button>
//       </div>

//       {activeTab === "tra-cuu" && (
//         <div className="tra-cuu-content">
//           <nav>
//             <button onClick={() => handleSubTabClick("van-don")}>
//               Tra cứu vận đơn
//             </button>
//             <button onClick={() => handleSubTabClick("uoc-tinh")}>
//               Ước tính cước phí
//             </button>
//             <button onClick={() => handleSubTabClick("faq")}>
//               Câu hỏi thường gặp
//             </button>
//           </nav>

//           {activeSubTab === "van-don" && (
//             <div className="van-don">
//               <h3>Tra cứu vận đơn</h3>
//               <input type="text" placeholder="Nhập mã phiếu gửi" />
//               <button>Tra cứu</button>
//             </div>
//           )}

//           {activeSubTab === "uoc-tinh" && (
//             <div className="uoc-tinh">
//               <h3>Ước tính cước phí</h3>
//               <input type="text" placeholder="Gửi từ" />
//               <input type="text" placeholder="Gửi đến" />
//               <input type="number" placeholder="Trọng lượng" />
//               <button>Tính phí</button>
//             </div>
//           )}

//           {activeSubTab === "faq" && (
//             <div className="faq">
//               <h3>Câu hỏi thường gặp</h3>
//               <h4>Title 1</h4>
//               <p>Description cho câu hỏi 1</p>
//               <h4>Title 2</h4>
//               <p>Description cho câu hỏi 2</p>
//             </div>
//           )}
//         </div>
//       )}

//       {activeTab === "dich-vu" && (
//         <div className="dich-vu-content">
//           <h3>Danh mục dịch vụ</h3>
//           <ul>
//             <li>Dịch vụ vận chuyển Koi</li>
//             <li>Dịch vụ bảo quản và chăm sóc Koi</li>
//             <li>Dịch vụ tư vấn và hướng dẫn nuôi Koi</li>
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default App;

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AminDashboard from "./Components/DashBoard/DashBoard-Admin";
import ManageService from "./pages/DashBoard/Admin/Manage-service";

function App() {
  const router = createBrowserRouter([
    {
      path: "",
      element: <HomePage />,
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
      path: "dashboard",
      element: <AminDashboard />,
      children: [
        {
          path: "service",
          element: <ManageService />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
