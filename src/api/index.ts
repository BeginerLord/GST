import axios from "axios";

const { VITE_API_URL, VITE_SECRET_KEY } = import.meta.env;

console.log("🔧 API Base URL:", VITE_API_URL);

export const gstApi = axios.create({
  baseURL: VITE_API_URL,
  headers: {
    "api-key": VITE_SECRET_KEY,
  },
});
gstApi.interceptors.request.use(
  (config: any) => {
    // Obtener el token directamente del sessionStorage
    const jwt = sessionStorage.getItem("token");

    if (jwt) {
      // Configurar el header de autorización si el token es válido (sessionStorage)
      config.headers.Authorization = `Bearer ${jwt}`;
    }

    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);
