import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useEffect } from "react";
import {
  getAllProcesses,
  getPendingIncidences,
  assignIncident,
  approveIncident,
  getReport,
} from "@/service/supervisor";
import type {
  ProcessResponse,
  Incidence,
  ReportResponse,
} from "@/models/incidents";
import type { AssignIncidentRequest } from "@/models/supervisor";

// ========================================
// HOOKS DE GESTIÓN DE PROCESOS
// ========================================

/**
 * Hook para obtener procesos en revisión (supervisor)
 * Ejemplo de uso:
 * const { data: processes, isLoading, error, refetch } = useGetAllProcessesHook();
 */
export const useGetAllProcessesHook = (options?: {
  enabled?: boolean;
  onSuccess?: (data: ProcessResponse[]) => void;
  onError?: (error: Error) => void;
}) => {
  const query = useQuery({
    queryKey: ["supervisor", "processes", "all"],
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
// HOOKS DE GESTIÓN DE INCIDENCIAS
// ========================================

/**
 * Hook para obtener incidencias pendientes
 * Ejemplo de uso:
 * const { data: pendingIncidences, isLoading, error, refetch } = useGetPendingIncidencesHook();
 */
export const useGetPendingIncidencesHook = (options?: {
  enabled?: boolean;
  onSuccess?: (data: Incidence[]) => void;
  onError?: (error: Error) => void;
}) => {
  const query = useQuery({
    queryKey: ["supervisor", "incidents", "pending"],
    queryFn: getPendingIncidences,
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
          : "Error al obtener las incidencias pendientes";
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

export type UseGetPendingIncidencesHookReturn = ReturnType<
  typeof useGetPendingIncidencesHook
>;

/**
 * Hook para asignar incidencia a revisor
 * Ejemplo de uso:
 * const { assignIncidentFn, isPending } = useAssignIncidentHook();
 * assignIncidentFn({ incidentId, assignData });
 */
export const useAssignIncidentHook = (options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}) => {
  const mutation = useMutation({
    mutationKey: ["supervisor", "incidents", "assign"],
    mutationFn: ({
      incidentId,
      assignData,
    }: {
      incidentId: string;
      assignData: AssignIncidentRequest;
    }) => assignIncident(incidentId, assignData),
    onSuccess: (data) => {
      toast.success("Incidencia asignada exitosamente");
      options?.onSuccess?.(data);
    },
    onError: (error: any) => {
      const message =
        error instanceof Error
          ? error.message
          : "Ocurrió un error al asignar la incidencia";
      toast.error(message);
      options?.onError?.(error instanceof Error ? error : new Error(message));
    },
  });

  return {
    assignIncidentFn: (incidentId: string, assignData: AssignIncidentRequest) =>
      mutation.mutate({ incidentId, assignData }),
    assignIncidentAsync: (incidentId: string, assignData: AssignIncidentRequest) =>
      mutation.mutateAsync({ incidentId, assignData }),
    ...mutation,
  };
};

export type UseAssignIncidentHookReturn = ReturnType<
  typeof useAssignIncidentHook
>;

/**
 * Hook para aprobar incidencia
 * Ejemplo de uso:
 * const { approveIncidentFn, isPending } = useApproveIncidentHook();
 * approveIncidentFn(incidentId);
 */
export const useApproveIncidentHook = (options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}) => {
  const mutation = useMutation({
    mutationKey: ["supervisor", "incidents", "approve"],
    mutationFn: (incidentId: string) => approveIncident(incidentId),
    onSuccess: (data) => {
      toast.success("Incidencia aprobada exitosamente");
      options?.onSuccess?.(data);
    },
    onError: (error: any) => {
      const message =
        error instanceof Error
          ? error.message
          : "Ocurrió un error al aprobar la incidencia";
      toast.error(message);
      options?.onError?.(error instanceof Error ? error : new Error(message));
    },
  });

  return {
    approveIncidentFn: (incidentId: string) => mutation.mutate(incidentId),
    approveIncidentAsync: (incidentId: string) => mutation.mutateAsync(incidentId),
    ...mutation,
  };
};

export type UseApproveIncidentHookReturn = ReturnType<
  typeof useApproveIncidentHook
>;

// ========================================
// HOOKS DE GESTIÓN DE REPORTES
// ========================================

/**
 * Hook para obtener un reporte por ID
 * Ejemplo de uso:
 * const { data: report, isLoading, error } = useGetReportHook(reportId);
 */
export const useGetReportHook = (
  reportId: string,
  options?: {
    enabled?: boolean;
    onSuccess?: (data: ReportResponse) => void;
    onError?: (error: Error) => void;
  }
) => {
  const query = useQuery({
    queryKey: ["supervisor", "reports", reportId],
    queryFn: () => getReport(reportId),
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
          : "Error al obtener el reporte";
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

export type UseGetReportHookReturn = ReturnType<typeof useGetReportHook>;
