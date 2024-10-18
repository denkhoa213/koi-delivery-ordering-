import axios from "axios";

// Tạo một instance axios với baseURL
const api = axios.create({
  baseURL: "http://localhost:8080/",
});

// Hàm này sẽ được gọi trước khi mỗi request được gửi đi
const handleBefore = (config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`; // Thêm token vào headers nếu có
  }
  return config;
};

// Xử lý lỗi khi xảy ra trong quá trình request
const handleError = (error) => {
  console.log("Lỗi khi gửi request: ", error);
  return Promise.reject(error); // Ném lỗi nếu có lỗi xảy ra
};

// Sử dụng interceptor để xử lý trước mỗi request
api.interceptors.request.use(handleBefore, handleError);

export default api;
