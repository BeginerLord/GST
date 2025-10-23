import { useState } from "react"
import { X, FolderPlus, Loader2, Calendar, UserCheck } from "lucide-react"
import { useCreateProcessHook, useGetActiveReviewersHook } from "@/hooks/admin"
import type { CreateProcessRequest } from "@/models/admin"

interface CreateProcessModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CreateProcessModal({ isOpen, onClose }: CreateProcessModalProps) {
  const [formData, setFormData] = useState<CreateProcessRequest>({
    name: "",
    description: "",
    dueDate: "",
    assignedReviewerId: "",
  })

  const { data: reviewers, isLoading: isLoadingReviewers } = useGetActiveReviewersHook()

  const { createProcessAsync, isPending } = useCreateProcessHook({
    onSuccess: () => {
      handleClose()
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.description || !formData.dueDate || !formData.assignedReviewerId) {
      alert("Por favor completa todos los campos")
      return
    }

    // Convertir datetime-local a formato YYYY-MM-DD para el backend
    const dueDateFormatted = formData.dueDate.split('T')[0]

    try {
      await createProcessAsync({
        ...formData,
        dueDate: dueDateFormatted,
      })
    } catch (error) {
      console.error("Error al crear proceso:", error)
    }
  }

  const handleClose = () => {
    setFormData({
      name: "",
      description: "",
      dueDate: "",
      assignedReviewerId: "",
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <FolderPlus size={24} className="text-emerald-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Crear Nuevo Proceso</h3>
              <p className="text-sm text-gray-500 mt-1">Completa la información del proceso</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isPending}
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 max-h-[calc(90vh-200px)] overflow-y-auto">
            {/* Nombre */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Proceso <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 outline-none"
                placeholder="Ej: Proceso de revisión Q1 2025"
                required
                disabled={isPending}
              />
            </div>

            {/* Descripción */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Descripción <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 outline-none resize-none"
                placeholder="Describe el proceso en detalle..."
                rows={5}
                required
                disabled={isPending}
              />
            </div>

            {/* Asignar Revisor */}
            <div>
              <label htmlFor="assignedReviewerId" className="block text-sm font-medium text-gray-700 mb-2">
                Asignar a Revisor <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="assignedReviewerId"
                  value={formData.assignedReviewerId}
                  onChange={(e) => setFormData({ ...formData, assignedReviewerId: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 outline-none appearance-none bg-white"
                  required
                  disabled={isPending || isLoadingReviewers}
                >
                  <option value="">Selecciona un revisor</option>
                  {reviewers?.map((reviewer) => (
                    <option key={reviewer._id} value={reviewer._id}>
                      {reviewer.name} ({reviewer.email})
                    </option>
                  ))}
                </select>
                <UserCheck size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                <svg
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              {isLoadingReviewers && (
                <p className="text-xs text-gray-500 mt-1">Cargando revisores disponibles...</p>
              )}
              {!isLoadingReviewers && reviewers && reviewers.length === 0 && (
                <p className="text-xs text-red-500 mt-1">No hay revisores activos disponibles</p>
              )}
              {!isLoadingReviewers && reviewers && reviewers.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  Selecciona el revisor responsable de este proceso
                </p>
              )}
            </div>

            {/* Fecha Límite */}
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
                Fecha Límite <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="dueDate"
                  type="datetime-local"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 outline-none"
                  required
                  disabled={isPending}
                />
                <Calendar size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Selecciona la fecha y hora límite para completar este proceso
              </p>
            </div>

            {/* Nota informativa */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-blue-100 rounded-lg mt-0.5">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-blue-800">
                    <strong>Nota:</strong> El proceso será creado automáticamente con tu usuario como creador.
                    Los timestamps se generarán automáticamente.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 bg-gray-50 rounded-b-xl border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isPending}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 size={18} className="animate-spin mr-2" />
                  Creando...
                </>
              ) : (
                <>
                  <FolderPlus size={18} className="mr-2" />
                  Crear Proceso
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
