import IncidenceTable from "@/components/revisor/IncidenceTable"
import { AlertTriangle, LogOut } from "lucide-react"

export default function IncidenciasPage() {
  const handleLogout = () => {
    sessionStorage.removeItem("token")
    sessionStorage.removeItem("user")
    sessionStorage.removeItem("userRole")
    window.location.href = "/login"
  }

  return (
    <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <AlertTriangle className="text-emerald-600" />
            Gestión de Incidencias
          </h1>
          <p className="text-gray-600 mt-1">Administra las incidencias de procesos en el sistema</p>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors shadow-sm"
        >
          <LogOut size={18} />
          <span>Cerrar Sesión</span>
        </button>
      </div>

      <IncidenceTable />
    </main>
  )
}
