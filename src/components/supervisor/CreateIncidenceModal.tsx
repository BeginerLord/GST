import { useState } from "react"
import { Loader2, X, Upload, FileImage } from "lucide-react"
import { useCreateIncidentHook, useGetAllProcessesHook } from "@/hooks/supervisor"

interface CreateIncidenceData {
  processId: string
  description: string
  evidence?: string
  status: "PENDING" | "RESOLVED"
}

interface CreateIncidenceModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (incidence: CreateIncidenceData) => void
}

export default function CreateIncidenceModal({ isOpen, onClose, onSave }: CreateIncidenceModalProps) {
  const { data: processes, isLoading: loadingProcesses, error: processError } = useGetAllProcessesHook()
  const { createIncidentAsync, isPending: creatingIncident } = useCreateIncidentHook({
    onSuccess: (data) => {
      console.log("Incidencia creada:", data)
      onSave(formData)
      onClose()
      setFormData({
        processId: "",
        description: "",
        evidence: "",
        status: "PENDING",
      })
      setSelectedFile(null)
      setPreviewUrl("")
    },
    onError: (error) => {
      console.error("Error al crear incidencia:", error)
      alert("Error al crear la incidencia. Por favor, inténtalo de nuevo.")
    },
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<CreateIncidenceData>({
    processId: "",
    description: "",
    evidence: "",
    status: "PENDING",
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Por favor, selecciona solo archivos de imagen")
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("El archivo es demasiado grande. Máximo 5MB permitido.")
        return
      }

      setSelectedFile(file)

      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setPreviewUrl(result)
        setFormData((prev) => ({
          ...prev,
          evidence: result,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.processId || !formData.description.trim() || !selectedFile) {
      alert("Por favor, completa todos los campos obligatorios incluyendo la evidencia")
      return
    }

    setIsSubmitting(true)

    try {
      await createIncidentAsync({
        processId: formData.processId,
        description: formData.description,
        evidence: selectedFile,
      })
    } catch (error) {
      console.error("Error en handleSubmit:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
    setPreviewUrl("")
    setFormData((prev) => ({
      ...prev,
      evidence: "",
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
        <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">Nueva Incidencia</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500 focus:outline-none">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
            <div className="space-y-6">
              <div>
                <label htmlFor="processId" className="block text-sm font-medium text-gray-700 mb-1">
                  Proceso <span className="text-red-500">*</span>
                </label>
                <select
                  id="processId"
                  name="processId"
                  value={formData.processId}
                  onChange={handleChange}
                  required
                  disabled={loadingProcesses}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  <option value="">{loadingProcesses ? "Cargando procesos..." : "Selecciona un proceso"}</option>
                  {processes?.map((process) => (
                    <option key={process.id} value={process.id}>
                      {process.name}
                    </option>
                  ))}
                  {processError && (
                    <option value="" disabled>
                      Error al cargar procesos
                    </option>
                  )}
                </select>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  required
                  placeholder="Describe detalladamente la incidencia encontrada..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Mínimo 10 caracteres. Sé específico sobre el problema encontrado.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Evidencia (Imagen)</label>

                {!previewUrl ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="evidence-upload" />
                    <label htmlFor="evidence-upload" className="cursor-pointer flex flex-col items-center">
                      <Upload size={32} className="text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 mb-1">Haz clic para subir una imagen o arrastra aquí</p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 5MB</p>
                    </label>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={previewUrl || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={removeFile}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                    <div className="mt-2 flex items-center text-sm text-gray-600">
                      <FileImage size={16} className="mr-1" />
                      {selectedFile?.name}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 px-6 py-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={
                creatingIncident || isSubmitting || !formData.processId || !formData.description.trim() || !selectedFile
              }
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {creatingIncident || isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" />
                  Creando...
                </>
              ) : (
                "Crear Incidencia"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}