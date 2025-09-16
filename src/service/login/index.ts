import { gstApi } from "@/api";

interface LoginResponse {
  token: string;
  user?: Record<string, any>;
  [k: string]: any;
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
    if (data?.token) {
      sessionStorage.setItem("jwt", data.token);
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
