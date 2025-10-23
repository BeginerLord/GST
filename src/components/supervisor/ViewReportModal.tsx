import { useState } from "react"
import { X, FileText, Download, Loader2 } from "lucide-react"
import { downloadReportPDF } from "@/service/supervisor"

interface ViewReportModalProps {
  isOpen: boolean
  onClose: () => void
  reportId: string
}

export default function ViewReportModal({ isOpen, onClose, reportId }: ViewReportModalProps) {
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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
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
