import { useState, useCallback } from "react";
import { getProcessesForReviewer } from "@/service/revisor";
import type { ProcessResponse } from "@/models/incidents";

export const useProcesses = () => {
  const [processes, setProcesses] = useState<ProcessResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar procesos asignados al revisor
  const loadProcesses = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getProcessesForReviewer();
      setProcesses(data);
      return data;
    } catch (err: any) {
      const errorMessage = err.message || "Error al cargar los procesos";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Obtener proceso por ID
  const getProcessById = useCallback((processId: string) => {
    return processes.find(process => process.id === processId);
  }, [processes]);

  // Limpiar error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    processes,
    isLoading,
    error,
    loadProcesses,
    getProcessById,
    clearError,
  };
};