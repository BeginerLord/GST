import { X, Calendar, CheckCircle, Clock, AlertTriangle, ExternalLink } from "lucide-react"
import type { Incidence } from "@/models/incidents"

interface ViewIncidenceModalProps {
  isOpen: boolean
  onClose: () => void
  incidence: Incidence
}

export default function ViewIncidenceModal({ isOpen, onClose, incidence }: ViewIncidenceModalProps) {
  if (!isOpen) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
        <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">Detalles de la Incidencia</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500 focus:outline-none">
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
          <div className="space-y-6">
            {/* Estado de la incidencia */}
            <div
              className={`p-4 rounded-lg border ${
                incidence.status === "RESOLVED" ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200"
              }`}
            >
              <div className="flex items-center">
                {incidence.status === "RESOLVED" ? (
                  <CheckCircle className="text-emerald-500 mr-3" size={24} />
                ) : (
                  <Clock className="text-amber-500 mr-3" size={24} />
                )}
                <div>
                  <h4
                    className={`font-medium ${incidence.status === "RESOLVED" ? "text-emerald-700" : "text-amber-700"}`}
                  >
                    {incidence.status === "RESOLVED" ? "Incidencia Resuelta" : "Incidencia Pendiente"}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {incidence.status === "RESOLVED"
                      ? "Esta incidencia ha sido marcada como resuelta"
                      : "Esta incidencia requiere atención"}
                  </p>
                </div>
              </div>
            </div>

            {/* Información básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">ID de Incidencia</label>
                <p className="text-lg font-semibold text-gray-900">{incidence.id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">ID de Proceso</label>
                <p className="text-lg font-semibold text-gray-900">{incidence.processId}</p>
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">Descripción</label>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-900 leading-relaxed">{incidence.description}</p>
              </div>
            </div>

            {/* Evidencia */}
            {incidence.evidence && incidence.evidence.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Evidencia ({incidence.evidence.length} archivo{incidence.evidence.length > 1 ? 's' : ''})
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {incidence.evidence.map((evidenceUrl, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                      {evidenceUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                        <img
                          src={evidenceUrl}
                          alt={`Evidencia ${index + 1}`}
                          className="w-full h-32 object-cover"
                        />
                      ) : (
                        <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
                          <div className="text-center">
                            <ExternalLink size={24} className="text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">Archivo adjunto</p>
                          </div>
                        </div>
                      )}
                      <div className="p-2">
                        <a
                          href={evidenceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm underline flex items-center gap-1"
                        >
                          <ExternalLink size={14} />
                          Ver evidencia {index + 1}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Fechas y Usuario */}
            <div className="space-y-4">
              <div className="flex items-center text-gray-700">
                <Calendar size={18} className="mr-2" />
                <div>
                  <p className="font-medium">Fecha de Creación</p>
                  <p className="text-sm text-gray-600">{formatDate(incidence.createdAt)}</p>
                  <p className="text-sm text-gray-500">
                    Creado por: {typeof incidence.createdBy === 'string'
                      ? incidence.createdBy
                      : incidence.createdBy?.name || incidence.createdBy?.email || 'Usuario desconocido'}
                  </p>
                </div>
              </div>

              {incidence.resolvedAt && (
                <div className="flex items-center text-emerald-700">
                  <CheckCircle size={18} className="mr-2" />
                  <div>
                    <p className="font-medium">Fecha de Resolución</p>
                    <p className="text-sm text-emerald-600">{formatDate(incidence.resolvedAt)}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Información adicional */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-start space-x-2 text-sm text-gray-500">
                <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
                <p>
                  Esta incidencia está asociada al proceso <strong>{incidence.processId}</strong>. Todas las acciones
                  realizadas quedan registradas en el sistema para auditoría.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 px-6 py-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
