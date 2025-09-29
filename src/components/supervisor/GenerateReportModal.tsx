import { useState } from "react"
import { X, Download, Loader2 } from "lucide-react"
import { useGenerateReportHook } from "@/hooks/supervisor"
import type { ProcessResponse } from "@/models/incidents"

interface GenerateReportModalProps {
  isOpen: boolean
  onClose: () => void
  processes: ProcessResponse[]
}

export default function GenerateReportModal({ isOpen, onClose, processes }: GenerateReportModalProps) {
  const [title, setTitle] = useState("")
  const [selectedProcessIds, setSelectedProcessIds] = useState<string[]>([])
  const [localError, setLocalError] = useState<string | null>(null)

  const { generateReportFn, isPending: isGenerating } = useGenerateReportHook({
    onSuccess: (report) => {
      // Si el reporte tiene una URL de archivo, abrir en nueva pestaña
      if (report.fileUrl) {
        const fullUrl = report.fileUrl.startsWith("http")
          ? report.fileUrl
          : `${import.meta.env.VITE_API_URL.replace("/api/v1", "")}${report.fileUrl}`

        window.open(fullUrl, "_blank")
      }

      alert(`Reporte "${title}" generado exitosamente (ID: ${report.id})`)

      // Limpiar formulario y cerrar modal
      setTitle("")
      setSelectedProcessIds([])
      setLocalError(null)
      onClose()
    },
    onError: (error) => {
      setLocalError(error.message || "Error al generar el reporte")
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)

    if (!title.trim()) {
      setLocalError("El título del reporte es requerido")
      return
    }

    if (selectedProcessIds.length === 0) {
      setLocalError("Debe seleccionar al menos un proceso")
      return
    }

    generateReportFn({
      title: title.trim(),
      processIds: selectedProcessIds,
    })
  }

  const handleProcessToggle = (processId: string) => {
    setSelectedProcessIds((prev) =>
      prev.includes(processId) ? prev.filter((id) => id !== processId) : [...prev, processId]
    )
  }

  const handleSelectAll = () => {
    if (selectedProcessIds.length === processes.length) {
      setSelectedProcessIds([])
    } else {
      setSelectedProcessIds(processes.map((p) => p.id))
    }
  }

  const resetForm = () => {
    setTitle("")
    setSelectedProcessIds([])
    setLocalError(null)
  }

  const handleClose = () => {
    if (!isGenerating) {
      resetForm()
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Generar Reporte Consolidado</h2>
          <button
            onClick={handleClose}
            disabled={isGenerating}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Message */}
          {localError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{localError}</div>
          )}

          {/* Título del reporte */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Título del Reporte *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Reporte de Incidencias - Enero 2024"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200 outline-none"
              disabled={isGenerating}
              required
            />
          </div>

          {/* Selección de procesos */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Procesos a incluir *</label>
              <button
                type="button"
                onClick={handleSelectAll}
                disabled={isGenerating}
                className="text-sm text-purple-600 hover:text-purple-800 disabled:opacity-50"
              >
                {selectedProcessIds.length === processes.length ? "Deseleccionar todos" : "Seleccionar todos"}
              </button>
            </div>

            <div className="border border-gray-300 rounded-lg p-3 max-h-40 overflow-y-auto">
              {processes.length === 0 ? (
                <p className="text-gray-500 text-sm">No hay procesos disponibles</p>
              ) : (
                <div className="space-y-2">
                  {processes.map((process) => (
                    <label key={process.id} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedProcessIds.includes(process.id)}
                        onChange={() => handleProcessToggle(process.id)}
                        disabled={isGenerating}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 disabled:opacity-50"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{process.name}</p>
                        <p className="text-xs text-gray-500 truncate">{process.description}</p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          process.status === "completado"
                            ? "bg-green-100 text-green-800"
                            : process.status === "en revisión"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {process.status}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Seleccionados: {selectedProcessIds.length} de {processes.length}
            </p>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isGenerating}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isGenerating || !title.trim() || selectedProcessIds.length === 0}
              className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Generando...
                </>
              ) : (
                <>
                  <Download size={16} />
                  Generar Reporte
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}