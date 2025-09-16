import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useEffect } from "react";
import { createIncident, getProcessesForReviewer } from "@/service/revisor";
import type {
  CreateIncidentRequest,
  ProcessResponse,
} from "@/models/incidents";

/**
 * Hook para manejar la creación de incidencias.
 * Ejemplo de uso:
 * const { createIncidentFn, isPending } = useCreateIncidentHook();
 * createIncidentFn({ processId, description, evidence });
 */
export const useCreateIncidentHook = (options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}) => {
  const mutation = useMutation({
    mutationKey: ["incidents", "create"],
    mutationFn: (incidentData: CreateIncidentRequest) =>
      createIncident(incidentData),
    onSuccess: (data) => {
      toast.success("Incidencia creada exitosamente");
      options?.onSuccess?.(data);
    },
    onError: (error: any) => {
      const message =
        error instanceof Error
          ? error.message
          : "Ocurrió un error al crear la incidencia";
      toast.error(message);
      options?.onError?.(error instanceof Error ? error : new Error(message));
    },
  });

  return {
    createIncidentFn: (incidentData: CreateIncidentRequest) =>
      mutation.mutate(incidentData),
    createIncidentAsync: (incidentData: CreateIncidentRequest) =>
      mutation.mutateAsync(incidentData),
    ...mutation,
  };
};

export type UseCreateIncidentHookReturn = ReturnType<
  typeof useCreateIncidentHook
>;

/**
 * Hook para obtener los procesos del revisor.
 * Ejemplo de uso:
 * const { data: processes, isLoading, error, refetch } = useGetProcessesForReviewerHook();
 */
export const useGetProcessesForReviewerHook = (options?: {
  enabled?: boolean;
  onSuccess?: (data: ProcessResponse[]) => void;
  onError?: (error: Error) => void;
}) => {
  const query = useQuery({
    queryKey: ["processes", "reviewer"],
    queryFn: getProcessesForReviewer,
    enabled: options?.enabled ?? true,
  });

  // Handle success and error callbacks with useEffect
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

export type UseGetProcessesForReviewerHookReturn = ReturnType<
  typeof useGetProcessesForReviewerHook
>;
