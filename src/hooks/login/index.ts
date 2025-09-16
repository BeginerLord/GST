import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner"; // Usamos sonner ya que react-toastify no está en dependencias
import { login } from "@/service/login";

interface Credentials {
  email: string;
  password: string;
}

/**
 * Hook para manejar el login.
 * Ejemplo de uso:
 * const { loginFn, isPending } = useLoginHook();
 * loginFn({ email, password });
 */
export const useLoginHook = (options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}) => {
  const mutation = useMutation({
    mutationKey: ["auth", "login"],
    mutationFn: ({ email, password }: Credentials) => login(email, password),
    onSuccess: (data) => {
      toast.success("Inicio de sesión exitoso");
      options?.onSuccess?.(data);
    },
    onError: (error: any) => {
      const message =
        error instanceof Error
          ? error.message
          : "Ocurrió un error al iniciar sesión";
      toast.error(message);
      options?.onError?.(error instanceof Error ? error : new Error(message));
    },
  });

  return {
    loginFn: (credentials: Credentials) => mutation.mutate(credentials),
    loginAsync: (credentials: Credentials) => mutation.mutateAsync(credentials),
    ...mutation,
  };
};

export type UseLoginHookReturn = ReturnType<typeof useLoginHook>;
