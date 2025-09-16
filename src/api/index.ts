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

    console.log("📤 Axios Request:", {
      method: config.method?.toUpperCase(),
      url: `${config.baseURL}${config.url}`,
      headers: config.headers,
      data: config.data
    });

    return config;
  },
  (error: any) => {
    console.error("❌ Axios Request Error:", error);
    return Promise.reject(error);
  }
);

// Interceptor de respuesta para debugging
gstApi.interceptors.response.use(
  (response) => {
    console.log("✅ Axios Response:", {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      url: response.config.url
    });
    return response;
  },
  (error) => {
    console.error("❌ Axios Response Error:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      fullError: error
    });
    return Promise.reject(error);
  }
);
