import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { registerUser } from "@/service/admin";
import type { RegisterUserRequest } from "@/models/admin";

// ========================================
// HOOKS DE GESTIÓN DE USUARIOS
// ========================================

/**
 * Hook para registrar un nuevo usuario (SOLO administradores).
 * Ejemplo de uso:
 * const { registerUserFn, isPending } = useRegisterUserHook();
 * registerUserFn({ name, email, password, role });
 */
export const useRegisterUserHook = (options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}) => {
  const mutation = useMutation({
    mutationKey: ["admin", "register-user"],
    mutationFn: (userData: RegisterUserRequest) => registerUser(userData),
    onSuccess: (data) => {
      toast.success("Usuario registrado exitosamente");
      options?.onSuccess?.(data);
    },
    onError: (error: any) => {
      const message =
        error instanceof Error
          ? error.message
          : "Ocurrió un error al registrar el usuario";
      toast.error(message);
      options?.onError?.(error instanceof Error ? error : new Error(message));
    },
  });

  return {
    registerUserFn: (userData: RegisterUserRequest) =>
      mutation.mutate(userData),
    registerUserAsync: (userData: RegisterUserRequest) =>
      mutation.mutateAsync(userData),
    ...mutation,
  };
};

export type UseRegisterUserHookReturn = ReturnType<typeof useRegisterUserHook>;

// ========================================
// NOTA IMPORTANTE
// ========================================
// Los administradores solo tienen acceso al endpoint de registro de usuarios.
// La gestión de procesos, incidencias y reportes está disponible exclusivamente
// para el rol de Revisor a través del endpoint /processes/reviewer.