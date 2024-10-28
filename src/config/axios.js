import axios from "axios";

// Tạo một instance axios với baseURL
const api = axios.create({
  baseURL: "http://localhost:8080/",
});

const handleBefore = (config) => {
  const token = localStorage.getItem("token");

  if (token && !config.url.includes("auth/login")) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
};

const handleError = (error) => {
  console.log("Lỗi khi gửi request: ", error);
  return Promise.reject(error);
};

api.interceptors.request.use(handleBefore, handleError);

export default api;
