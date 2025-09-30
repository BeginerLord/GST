import { useState, useEffect } from "react"
import { X, UserPlus, Loader2 } from "lucide-react"
import { gstApi } from "@/api"
import type { Revisor } from "@/models/supervisor"

interface AssignIncidenceModalProps {
  isOpen: boolean
  onClose: () => void
  onAssign: (revisorId: string) => void
}

export default function AssignIncidenceModal({
  isOpen,
  onClose,
  onAssign,
}: AssignIncidenceModalProps) {
  const [revisores, setRevisores] = useState<Revisor[]>([])
  const [selectedRevisorId, setSelectedRevisorId] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingRevisores, setIsLoadingRevisores] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadRevisores()
    }
  }, [isOpen])

  const loadRevisores = async () => {
    setIsLoadingRevisores(true)
    try {
      // Obtener lista de usuarios con rol "revisor"
      const { data } = await gstApi.get<Revisor[]>("/users?role=revisor")
      setRevisores(data)
    } catch (error) {
      console.error("Error al cargar revisores:", error)
    } finally {
      setIsLoadingRevisores(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedRevisorId) {
      alert("Por favor selecciona un revisor")
      return
    }

    setIsLoading(true)
    try {
      await onAssign(selectedRevisorId)
      handleClose()
    } catch (error) {
      console.error("Error al asignar incidencia:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setSelectedRevisorId("")
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserPlus size={24} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Asignar Incidencia</h3>
              <p className="text-sm text-gray-500 mt-1">Selecciona un revisor para esta incidencia</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isLoading}
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="revisor" className="block text-sm font-medium text-gray-700 mb-2">
                Revisor *
              </label>
              {isLoadingRevisores ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 size={24} className="animate-spin text-blue-500" />
                  <span className="ml-2 text-gray-600">Cargando revisores...</span>
                </div>
              ) : (
                <select
                  id="revisor"
                  value={selectedRevisorId}
                  onChange={(e) => setSelectedRevisorId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none"
                  required
                  disabled={isLoading}
                >
                  <option value="">Selecciona un revisor</option>
                  {revisores.map((revisor) => (
                    <option key={revisor._id} value={revisor._id}>
                      {revisor.name} ({revisor.email})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {revisores.length === 0 && !isLoadingRevisores && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-800">
                  No hay revisores disponibles en el sistema.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 bg-gray-50 rounded-b-xl border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              disabled={isLoading || isLoadingRevisores || revisores.length === 0}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin mr-2" />
                  Asignando...
                </>
              ) : (
                <>
                  <UserPlus size={18} className="mr-2" />
                  Asignar
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}