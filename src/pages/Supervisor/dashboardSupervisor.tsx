import { useState, useEffect } from "react"
import { Eye, AlertTriangle, BarChart3, LogOut, Activity } from "lucide-react"
import IncidenceTable from "@/components/supervisor/IncidenceTable"
import { useGetAllIncidencesHook, useGetAllProcessesHook } from "@/hooks/supervisor"

type ActiveSection = "overview" | "incidences"

interface User {
  _id: string
  name: string
  email: string
  role: "supervisor" | "administrador" | "revisor"
}

export default function DashboardSupervisor() {
  const [activeSection, setActiveSection] = useState<ActiveSection>("overview")
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  // Hooks para estadísticas
  const { data: allIncidences = [] } = useGetAllIncidencesHook()
  const { data: allProcesses = [] } = useGetAllProcessesHook()

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    const userStr = sessionStorage.getItem("user")
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        setCurrentUser(user)
        console.log("👤 Usuario supervisor actual:", user)
      } catch (error) {
        console.error("Error al parsear datos del usuario:", error)
      }
    }
  }, [])

  // Calcular estadísticas
  const stats = {
    totalProcesses: allProcesses.length,
    totalIncidents: allIncidences.length,
    pendingIncidents: allIncidences.filter((inc) => inc.status === "PENDING").length,
    resolvedIncidents: allIncidences.filter((inc) => inc.status === "RESOLVED").length,
  }

  const handleLogout = () => {
    sessionStorage.removeItem("token")
    sessionStorage.removeItem("user")
    sessionStorage.removeItem("userRole")
    window.location.href = "/login"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Panel de Supervisor</h1>
              <p className="text-sm text-gray-600 mt-1">
                {currentUser ? `Bienvenido, ${currentUser.name}` : "Monitoreo global del sistema"}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <LogOut size={18} />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-8">
            <button
              onClick={() => setActiveSection("overview")}
              className={`flex items-center gap-2 px-1 py-4 border-b-2 font-medium text-sm transition-colors ${
                activeSection === "overview"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <BarChart3 size={18} />
              Vista General
            </button>
            <button
              onClick={() => setActiveSection("incidences")}
              className={`flex items-center gap-2 px-1 py-4 border-b-2 font-medium text-sm transition-colors ${
                activeSection === "incidences"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <AlertTriangle size={18} />
              Gestión de Incidencias
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeSection === "overview" && (
          <div className="space-y-6">
            {/* Welcome Card */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2">
                    {currentUser ? `Hola, ${currentUser.name.split(" ")[0]}!` : "Panel de Supervisor"}
                  </h2>
                  <p className="text-blue-100">Monitoreo global del sistema - Acceso a todos los procesos e incidencias</p>
                </div>
                <Activity size={64} className="text-blue-200 opacity-80" />
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Procesos */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <BarChart3 size={24} className="text-purple-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.totalProcesses}</h3>
                <p className="text-sm text-gray-600">Procesos Totales</p>
              </div>

              {/* Total Incidencias */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <AlertTriangle size={24} className="text-blue-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.totalIncidents}</h3>
                <p className="text-sm text-gray-600">Incidencias Totales</p>
              </div>

              {/* Incidencias Pendientes */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-amber-100 rounded-lg">
                    <AlertTriangle size={24} className="text-amber-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.pendingIncidents}</h3>
                <p className="text-sm text-gray-600">Incidencias Pendientes</p>
              </div>

              {/* Incidencias Resueltas */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Eye size={24} className="text-green-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.resolvedIncidents}</h3>
                <p className="text-sm text-gray-600">Incidencias Resueltas</p>
              </div>
            </div>

            {/* Capacidades del Supervisor */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg mt-1">
                    <Eye size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Monitoreo Global</h4>
                    <p className="text-sm text-gray-600">
                      Acceso completo a todos los procesos e incidencias del sistema
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg mt-1">
                    <BarChart3 size={20} className="text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Reportes Consolidados</h4>
                    <p className="text-sm text-gray-600">
                      Genera reportes de múltiples procesos con alcance global
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-100 rounded-lg mt-1">
                    <Activity size={20} className="text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Gestión de Incidencias</h4>
                    <p className="text-sm text-gray-600">
                      Crea, visualiza y resuelve incidencias del sistema
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Note */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg mt-1">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">Privilegios del Supervisor</h4>
                  <p className="text-sm text-blue-800">
                    Como supervisor, tienes acceso global al sistema para monitoreo y gestión de incidencias.
                    Puedes ver todos los procesos, crear y resolver incidencias, y generar reportes consolidados.
                    Sin embargo, no puedes registrar nuevos usuarios (privilegio exclusivo de administradores).
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "incidences" && <IncidenceTable />}
      </main>
    </div>
  )
}