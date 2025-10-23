import { useState, useEffect } from "react"
import { Loader2, X, Eye, EyeOff } from "lucide-react"
import { useUpdateUserHook } from "@/hooks/admin"
import type { UpdateUserRequest, User } from "@/models/admin"

interface EditUserModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  user: User | null
}

export default function EditUserModal({ isOpen, onClose, onSuccess, user }: EditUserModalProps) {
  const { updateUserAsync, isPending } = useUpdateUserHook({
    onSuccess: () => {
      setShowPassword(false)
      onSuccess?.()
      onClose()
    },
  })

  const [formData, setFormData] = useState<UpdateUserRequest>({
    name: "",
    email: "",
    password: "",
    role: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof UpdateUserRequest, string>>>({})

  // Cargar datos del usuario cuando cambie
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        password: "", // No prellenamos la contraseña por seguridad
        role: user.role,
      })
      setErrors({})
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error for this field
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof UpdateUserRequest, string>> = {}

    if (formData.name && formData.name.trim().length < 3) {
      newErrors.name = "El nombre debe tener al menos 3 caracteres"
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido"
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) return

    if (!validateForm()) {
      return
    }

    try {
      // Solo enviar los campos que han sido modificados
      const updateData: UpdateUserRequest = {}

      if (formData.name && formData.name !== user.name) {
        updateData.name = formData.name
      }

      if (formData.email && formData.email !== user.email) {
        updateData.email = formData.email
      }

      if (formData.password && formData.password.trim() !== "") {
        updateData.password = formData.password
      }

      if (formData.role && formData.role !== user.role) {
        updateData.role = formData.role
      }

      // Si no hay cambios, mostrar mensaje
      if (Object.keys(updateData).length === 0) {
        setErrors({ name: "No se detectaron cambios" })
        return
      }

      await updateUserAsync({ userId: user._id, userData: updateData })
    } catch (error) {
      console.error("Error al actualizar usuario:", error)
    }
  }

  if (!isOpen || !user) return null

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">Editar Usuario</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500 focus:outline-none">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre completo
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ej: Juan Pérez"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="ejemplo@correo.com"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña (opcional)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Dejar vacío para no cambiar"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
              <p className="text-xs text-gray-500 mt-1">
                {formData.password ? "Mínimo 6 caracteres" : "Dejar vacío si no deseas cambiar la contraseña"}
              </p>
            </div>

            {/* Role */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Rol
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.role ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="revisor">Revisor</option>
                <option value="administrador">Administrador</option>
                <option value="supervisor">Supervisor</option>
              </select>
              {errors.role && <p className="text-xs text-red-500 mt-1">{errors.role}</p>}
              <p className="text-xs text-gray-500 mt-1">
                {formData.role === "revisor"
                  ? "Puede gestionar incidencias y generar reportes"
                  : formData.role === "supervisor"
                  ? "Puede supervisar procesos y asignar incidencias"
                  : "Tiene acceso completo al sistema"}
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 px-6 py-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" />
                  Actualizando...
                </>
              ) : (
                "Guardar Cambios"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
