import { useState, useCallback } from "react";
import { generateReport } from "@/service/revisor";
import type { GenerateReportRequest, ReportResponse } from "@/models/incidents";

export const useReports = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generar reporte
  const generateNewReport = useCallback(async (reportData: GenerateReportRequest): Promise<ReportResponse> => {
    try {
      setIsGenerating(true);
      setError(null);
      const response = await generateReport(reportData);
      return response;
    } catch (err: any) {
      const errorMessage = err.message || "Error al generar el reporte";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  // Limpiar error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isGenerating,
    error,
    generateNewReport,
    clearError,
  };
};