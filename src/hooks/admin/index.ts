import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useEffect } from "react";
import { registerUser, getUsers, updateUser, toggleUserStatus, createProcess, getActiveReviewers, getAllProcesses } from "@/service/admin";
import type { RegisterUserRequest, UpdateUserRequest, CreateProcessRequest, ProcessResponse } from "@/models/admin";

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
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["admin", "register-user"],
    mutationFn: (userData: RegisterUserRequest) => registerUser(userData),
    onSuccess: (data) => {
      toast.success("Usuario registrado exitosamente");
      // Invalidar la query de usuarios para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
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

/**
 * Hook para obtener la lista de usuarios (SOLO administradores).
 * Ejemplo de uso:
 * const { data: users, isLoading } = useGetUsersHook();
 */
export const useGetUsersHook = () => {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: getUsers,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};

/**
 * Hook para obtener la lista de revisores activos (SOLO administradores).
 * Ejemplo de uso:
 * const { data: reviewers, isLoading } = useGetActiveReviewersHook();
 */
export const useGetActiveReviewersHook = () => {
  return useQuery({
    queryKey: ["admin", "reviewers", "active"],
    queryFn: getActiveReviewers,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};

/**
 * Hook para actualizar un usuario existente (SOLO administradores).
 * Ejemplo de uso:
 * const { updateUserFn, isPending } = useUpdateUserHook();
 * updateUserFn({ userId: "123", userData: { name: "Nuevo nombre" } });
 */
export const useUpdateUserHook = (options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["admin", "update-user"],
    mutationFn: ({ userId, userData }: { userId: string; userData: UpdateUserRequest }) =>
      updateUser(userId, userData),
    onSuccess: (data) => {
      toast.success("Usuario actualizado exitosamente");
      // Invalidar la query de usuarios para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      options?.onSuccess?.(data);
    },
    onError: (error: any) => {
      const message =
        error instanceof Error
          ? error.message
          : "Ocurrió un error al actualizar el usuario";
      toast.error(message);
      options?.onError?.(error instanceof Error ? error : new Error(message));
    },
  });

  return {
    updateUserFn: (params: { userId: string; userData: UpdateUserRequest }) =>
      mutation.mutate(params),
    updateUserAsync: (params: { userId: string; userData: UpdateUserRequest }) =>
      mutation.mutateAsync(params),
    ...mutation,
  };
};

export type UseUpdateUserHookReturn = ReturnType<typeof useUpdateUserHook>;

/**
 * Hook para cambiar el estado de un usuario (activar/desactivar) (SOLO administradores).
 * Ejemplo de uso:
 * const { toggleStatusFn, isPending } = useToggleUserStatusHook();
 * toggleStatusFn("userId123");
 */
export const useToggleUserStatusHook = (options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["admin", "toggle-user-status"],
    mutationFn: (userId: string) => toggleUserStatus(userId),
    onSuccess: (data) => {
      const statusText = data.isActive ? "activado" : "desactivado";
      toast.success(`Usuario ${statusText} exitosamente`);
      // Invalidar la query de usuarios para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      options?.onSuccess?.(data);
    },
    onError: (error: any) => {
      const message =
        error instanceof Error
          ? error.message
          : "Ocurrió un error al cambiar el estado del usuario";
      toast.error(message);
      options?.onError?.(error instanceof Error ? error : new Error(message));
    },
  });

  return {
    toggleStatusFn: (userId: string) => mutation.mutate(userId),
    toggleStatusAsync: (userId: string) => mutation.mutateAsync(userId),
    ...mutation,
  };
};

export type UseToggleUserStatusHookReturn = ReturnType<typeof useToggleUserStatusHook>;

// ========================================
// HOOKS PARA PROCESOS (ADMIN)
// ========================================

/**
 * Hook para crear un nuevo proceso (SOLO administradores).
 * Ejemplo de uso:
 * const { createProcessFn, isPending } = useCreateProcessHook();
 * createProcessFn({ name, description, dueDate });
 */
export const useCreateProcessHook = (options?: {
  onSuccess?: (data: ProcessResponse) => void;
  onError?: (error: Error) => void;
}) => {
  const mutation = useMutation({
    mutationKey: ["admin", "processes", "create"],
    mutationFn: (processData: CreateProcessRequest) => createProcess(processData),
    onSuccess: (data) => {
      toast.success("Proceso creado exitosamente");
      options?.onSuccess?.(data);
    },
    onError: (error: any) => {
      const message =
        error instanceof Error
          ? error.message
          : "Ocurrió un error al crear el proceso";
      toast.error(message);
      options?.onError?.(error instanceof Error ? error : new Error(message));
    },
  });

  return {
    createProcessFn: (processData: CreateProcessRequest) =>
      mutation.mutate(processData),
    createProcessAsync: (processData: CreateProcessRequest) =>
      mutation.mutateAsync(processData),
    ...mutation,
  };
};

export type UseCreateProcessHookReturn = ReturnType<typeof useCreateProcessHook>;

/**
 * Hook para obtener todos los procesos (administradores y supervisores)
 * Ejemplo de uso:
 * const { data: processes, isLoading, error, refetch } = useGetAllProcessesHook();
 */
export const useGetAllProcessesHook = (options?: {
  enabled?: boolean;
  onSuccess?: (data: ProcessResponse[]) => void;
  onError?: (error: Error) => void;
}) => {
  const query = useQuery({
    queryKey: ["admin", "processes", "all"],
    queryFn: getAllProcesses,
    enabled: options?.enabled ?? true,
  });

  useEffect(() => {
    if (query.data && query.isSuccess && options?.onSuccess) {
      options.onSuccess(query.data);
    }
  }, [query.data, query.isSuccess, options?.onSuccess]);

  useEffect(() => {
    if (query.error && query.isError) {
      const message =
        query.error instanceof Error
          ? query.error.message
          : "Error al obtener los procesos";
      toast.error(message);
      if (options?.onError) {
        options.onError(
          query.error instanceof Error ? query.error : new Error(message)
        );
      }
    }
  }, [query.error, query.isError, options?.onError]);

  return query;
};

export type UseGetAllProcessesHookReturn = ReturnType<typeof useGetAllProcessesHook>;

// ========================================
// NOTA IMPORTANTE
// ========================================
// Los administradores tienen acceso a la gestión completa de usuarios y pueden crear procesos.
// La gestión de incidencias y reportes está disponible exclusivamente
// para el rol de Revisor a través del endpoint /processes/reviewer.