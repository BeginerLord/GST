import { useState } from "react"
import { X, FileText, Download, Loader2, Calendar } from "lucide-react"
import { useGetReportHook } from "@/hooks/supervisor"
import { downloadReportPDF } from "@/service/supervisor"

interface ViewReportModalProps {
  isOpen: boolean
  onClose: () => void
  reportId: string
}

export default function ViewReportModal({ isOpen, onClose, reportId }: ViewReportModalProps) {
  const {
    data: report,
    isLoading,
    error,
  } = useGetReportHook(reportId, {
    enabled: isOpen && !!reportId,
  })

  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    if (!reportId) return

    setIsDownloading(true)
    try {
      console.log("🔽 Iniciando descarga del reporte:", reportId)

      // ✅ Usar la función que incluye autenticación
      const blob = await downloadReportPDF(reportId)

      // Crear URL temporal del blob
      const url = window.URL.createObjectURL(blob)

      // Crear elemento <a> temporal para forzar la descarga
      const link = document.createElement("a")
      link.href = url
      link.download = `reporte-${reportId}.pdf`
      document.body.appendChild(link)
      link.click()

      // Limpiar
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      console.log("✅ Reporte descargado exitosamente")
    } catch (error) {
      console.error("❌ Error al descargar reporte:", error)
      alert(error instanceof Error ? error.message : "Error al descargar el reporte")
    } finally {
      setIsDownloading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileText size={24} className="text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Ver Reporte</h3>
              <p className="text-sm text-gray-500 mt-1">Información del reporte generado</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 size={48} className="animate-spin text-purple-500 mb-4" />
              <p className="text-gray-600">Cargando información del reporte...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-800">
                <strong>Error:</strong>{" "}
                {error instanceof Error ? error.message : "No se pudo cargar el reporte"}
              </p>
            </div>
          ) : report ? (
            <div className="space-y-6">
              {/* Información del Reporte */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <FileText size={20} className="text-gray-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500">ID del Reporte</p>
                    <p className="text-gray-900 font-mono text-sm mt-1">{report.id}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar size={20} className="text-gray-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500">Fecha de Generación</p>
                    <p className="text-gray-900 mt-1">{formatDate(report.generatedAt)}</p>
                  </div>
                </div>
              </div>

              {/* Vista Previa del Reporte */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-700">Vista Previa del Documento</p>
                </div>
                <div className="p-4 bg-white">
                  {report.fileUrl ? (
                    <div className="aspect-[8.5/11] w-full bg-gray-100 rounded-lg flex items-center justify-center">
                      <iframe
                        src={report.fileUrl}
                        className="w-full h-full rounded-lg"
                        title="Vista previa del reporte"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[8.5/11] w-full bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <FileText size={48} className="text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">No hay vista previa disponible</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No se encontró información del reporte</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 bg-gray-50 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cerrar
          </button>
          <button
            onClick={handleDownload}
            disabled={!reportId || isDownloading}
            className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isDownloading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Descargando...
              </>
            ) : (
              <>
                <Download size={18} />
                Descargar Reporte
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}