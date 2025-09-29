import { gstApi } from "@/api";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "administrador" | "revisor";
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

interface LoginResponse {
  user: User;
  token: string;
}

export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  if (!email || !password) {
    throw new Error("Email y password son requeridos");
  }
  try {
    const { data } = await gstApi.post<LoginResponse>("/auth/login", {
      email,
      password,
    });

    // Guardar token y datos del usuario en sessionStorage
    if (data?.token) {
      sessionStorage.setItem("token", data.token);
    }

    if (data?.user) {
      sessionStorage.setItem("user", JSON.stringify(data.user));
      sessionStorage.setItem("userRole", data.user.role);
    }

    return data;
  } catch (err: any) {
    const message =
      err?.response?.data?.message ||
      err?.message ||
      "Error en inicio de sesión";
    throw new Error(message);
  }
};
