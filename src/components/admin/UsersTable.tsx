import { useState, useMemo } from "react"
import { Pencil, Loader2, UserCircle, Mail, ShieldCheck, Calendar, CheckCircle, XCircle, Filter } from "lucide-react"
import { useGetUsersHook, useToggleUserStatusHook } from "@/hooks/admin"
import EditUserModal from "./EditUserModal"
import type { User } from "@/models/admin"

type StatusFilter = "all" | "active" | "inactive"

export default function UsersTable() {
  const { data: users, isLoading, error } = useGetUsersHook()
  const { toggleStatusFn } = useToggleUserStatusHook()
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [togglingUserId, setTogglingUserId] = useState<string | null>(null)

  const handleEditClick = (user: User) => {
    setSelectedUser(user)
    setIsEditModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsEditModalOpen(false)
    setSelectedUser(null)
  }

  const handleToggleStatus = (userId: string) => {
    setTogglingUserId(userId)
    toggleStatusFn(userId)
    setTimeout(() => setTogglingUserId(null), 500)
  }

  // Filtrar usuarios según el estado seleccionado
  const filteredUsers = useMemo(() => {
    if (!users) return []

    switch (statusFilter) {
      case "active":
        return users.filter(user => user.isActive)
      case "inactive":
        return users.filter(user => !user.isActive)
      default:
        return users
    }
  }, [users, statusFilter])

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "administrador":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      case "supervisor":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "revisor":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "administrador":
        return <ShieldCheck size={14} />
      case "supervisor":
        return <UserCircle size={14} />
      case "revisor":
        return <UserCircle size={14} />
      default:
        return <UserCircle size={14} />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
        <div className="flex flex-col items-center justify-center">
          <Loader2 size={48} className="animate-spin text-blue-600 mb-4" />
          <p className="text-gray-600">Cargando usuarios...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-red-200 p-8">
        <div className="text-center">
          <div className="text-red-500 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar usuarios</h3>
          <p className="text-gray-600">{error instanceof Error ? error.message : "Ocurrió un error inesperado"}</p>
        </div>
      </div>
    )
  }

  if (!users || users.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
        <div className="text-center">
          <UserCircle size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay usuarios registrados</h3>
          <p className="text-gray-600">Comienza registrando tu primer usuario</p>
        </div>
      </div>
    )
  }

  const activeCount = users.filter(u => u.isActive).length
  const inactiveCount = users.filter(u => !u.isActive).length

  // Mensaje cuando el filtro no tiene resultados
  if (filteredUsers.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Lista de Usuarios</h3>
              <p className="text-sm text-gray-600 mt-1">
                Total: {users.length} | Activos: {activeCount} | Inactivos: {inactiveCount}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-500" />
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${statusFilter === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
              >
                Todos ({users.length})
              </button>
              <button
                onClick={() => setStatusFilter("active")}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${statusFilter === "active"
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
              >
                Activos ({activeCount})
              </button>
              <button
                onClick={() => setStatusFilter("inactive")}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${statusFilter === "inactive"
                    ? "bg-red-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
              >
                Inactivos ({inactiveCount})
              </button>
            </div>
          </div>
        </div>
        <div className="p-12 text-center">
          <UserCircle size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No hay usuarios {statusFilter === "active" ? "activos" : statusFilter === "inactive" ? "inactivos" : ""}
          </h3>
          <p className="text-gray-600 mb-4">
            {statusFilter === "active" && "No hay usuarios activos en este momento."}
            {statusFilter === "inactive" && "No hay usuarios inactivos en este momento."}
          </p>
          <button
            onClick={() => setStatusFilter("all")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ver todos los usuarios
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header with Filter */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Lista de Usuarios</h3>
              <p className="text-sm text-gray-600 mt-1">
                Total: {users.length} | Activos: {activeCount} | Inactivos: {inactiveCount}
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-500" />
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${statusFilter === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
              >
                Todos ({users.length})
              </button>
              <button
                onClick={() => setStatusFilter("active")}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${statusFilter === "active"
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
              >
                Activos ({activeCount})
              </button>
              <button
                onClick={() => setStatusFilter("inactive")}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${statusFilter === "inactive"
                    ? "bg-red-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
              >
                Inactivos ({inactiveCount})
              </button>
            </div>
          </div>
        </div>

        {/* Table for larger screens */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha de Registro
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail size={14} className="mr-2 text-gray-400" />
                      {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(user.role)}`}>
                      {getRoleIcon(user.role)}
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.isActive ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <CheckCircle size={14} />
                        Activo
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                        <XCircle size={14} />
                        Inactivo
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-2 text-gray-400" />
                      {formatDate(user.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEditClick(user)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        title="Editar usuario"
                      >
                        <Pencil size={14} />
                        Editar
                      </button>
                      <button
                        onClick={() => handleToggleStatus(user._id)}
                        disabled={togglingUserId === user._id}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${user.isActive
                            ? "bg-red-600 text-white hover:bg-red-700"
                            : "bg-emerald-600 text-white hover:bg-emerald-700"
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        title={user.isActive ? "Desactivar usuario" : "Activar usuario"}
                      >
                        {togglingUserId === user._id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : user.isActive ? (
                          <XCircle size={14} />
                        ) : (
                          <CheckCircle size={14} />
                        )}
                        {user.isActive ? "Desactivar" : "Activar"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cards for mobile screens */}
        <div className="md:hidden divide-y divide-gray-200">
          {filteredUsers.map((user) => (
            <div key={user._id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-xs text-gray-600 flex items-center mt-1">
                      <Mail size={12} className="mr-1" />
                      {user.email}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(user.role)}`}>
                  {getRoleIcon(user.role)}
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
                {user.isActive ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <CheckCircle size={12} />
                    Activo
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                    <XCircle size={12} />
                    Inactivo
                  </span>
                )}
                <span className="text-xs text-gray-500 flex items-center">
                  <Calendar size={12} className="mr-1" />
                  {formatDate(user.createdAt)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEditClick(user)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs"
                >
                  <Pencil size={12} />
                  Editar
                </button>
                <button
                  onClick={() => handleToggleStatus(user._id)}
                  disabled={togglingUserId === user._id}
                  className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors text-xs ${user.isActive
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-emerald-600 text-white hover:bg-emerald-700"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {togglingUserId === user._id ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : user.isActive ? (
                    <XCircle size={12} />
                  ) : (
                    <CheckCircle size={12} />
                  )}
                  {user.isActive ? "Desactivar" : "Activar"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit User Modal */}
      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        user={selectedUser}
        onSuccess={() => {
          console.log("Usuario actualizado exitosamente")
        }}
      />
    </>
  )
}
