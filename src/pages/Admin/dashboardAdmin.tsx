import { useState, useEffect } from "react"
import { UserPlus, LogOut, Users, ShieldCheck, FolderPlus, FolderOpen } from "lucide-react"
import RegisterUserModal from "@/components/admin/RegisterUserModal"
import UsersTable from "@/components/admin/UsersTable"
import CreateProcessModal from "@/components/admin/CreateProcessModal"
import ProcessTable from "@/components/admin/ProcessTable"

type ActiveSection = "overview" | "users" | "processes"

interface User {
  _id: string;
  name: string;
  email: string;
  role: "administrador" | "revisor";
}

export default function ScreenAdmin() {
    const [activeSection, setActiveSection] = useState<ActiveSection>("overview")
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
    const [isCreateProcessModalOpen, setIsCreateProcessModalOpen] = useState(false)
    const [currentUser, setCurrentUser] = useState<User | null>(null)

    // Cargar datos del usuario al montar el componente
    useEffect(() => {
        const userStr = sessionStorage.getItem("user")
        if (userStr) {
            try {
                const user = JSON.parse(userStr)
                setCurrentUser(user)
                console.log("👤 Usuario actual:", user)
            } catch (error) {
                console.error("Error al parsear datos del usuario:", error)
            }
        }
    }, [])

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
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
                            <p className="text-sm text-gray-600 mt-1">
                                {currentUser ? `Bienvenido, ${currentUser.name}` : "Gestiona usuarios, incidencias y reportes del sistema"}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsCreateProcessModalOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <FolderPlus size={18} />
                                <span>Crear Proceso</span>
                            </button>
                            <button
                                onClick={() => setIsRegisterModalOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                            >
                                <UserPlus size={18} />
                                <span>Registrar Usuario</span>
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                <LogOut size={18} />
                                <span>Cerrar Sesión</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Navigation Tabs */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex gap-8">
                        <button
                            onClick={() => setActiveSection("overview")}
                            className={`flex items-center gap-2 px-1 py-4 border-b-2 font-medium text-sm transition-colors ${
                                activeSection === "overview"
                                    ? "border-emerald-600 text-emerald-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                        >
                            <ShieldCheck size={18} />
                            Vista General
                        </button>
                        <button
                            onClick={() => setActiveSection("users")}
                            className={`flex items-center gap-2 px-1 py-4 border-b-2 font-medium text-sm transition-colors ${
                                activeSection === "users"
                                    ? "border-emerald-600 text-emerald-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                        >
                            <Users size={18} />
                            Gestión de Usuarios
                        </button>
                        <button
                            onClick={() => setActiveSection("processes")}
                            className={`flex items-center gap-2 px-1 py-4 border-b-2 font-medium text-sm transition-colors ${
                                activeSection === "processes"
                                    ? "border-emerald-600 text-emerald-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                        >
                            <FolderOpen size={18} />
                            Procesos
                        </button>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeSection === "overview" && (
                    <div className="space-y-6">
                        {/* Welcome Card */}
                        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl shadow-lg p-8 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-3xl font-bold mb-2">
                                        {currentUser ? `Hola, ${currentUser.name.split(' ')[0]}!` : 'Panel de Administración'}
                                    </h2>
                                    <p className="text-emerald-100">
                                        Como administrador, puedes gestionar los usuarios del sistema
                                    </p>
                                </div>
                                <ShieldCheck size={64} className="text-emerald-200 opacity-80" />
                            </div>
                        </div>

                        {/* Admin Actions Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Create Process Card */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 bg-blue-100 rounded-lg">
                                        <FolderPlus size={24} className="text-blue-600" />
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Crear Proceso</h3>
                                <p className="text-gray-600 mb-4 text-sm">
                                    Crea nuevos procesos para gestionar el flujo de trabajo
                                </p>
                                <button
                                    onClick={() => setIsCreateProcessModalOpen(true)}
                                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                >
                                    Nuevo Proceso
                                </button>
                            </div>

                            {/* Register User Card */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 bg-emerald-100 rounded-lg">
                                        <UserPlus size={24} className="text-emerald-600" />
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Registrar Usuario</h3>
                                <p className="text-gray-600 mb-4 text-sm">
                                    Crea nuevas cuentas de usuario y asigna roles (Administrador o Revisor)
                                </p>
                                <button
                                    onClick={() => setIsRegisterModalOpen(true)}
                                    className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                                >
                                    Nuevo Usuario
                                </button>
                            </div>

                            {/* Manage Users Card */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 bg-purple-100 rounded-lg">
                                        <Users size={24} className="text-purple-600" />
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Gestión de Usuarios</h3>
                                <p className="text-gray-600 mb-4 text-sm">
                                    Visualiza, edita y administra las cuentas de usuarios existentes
                                </p>
                                <button
                                    onClick={() => setActiveSection("users")}
                                    className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                                >
                                    Ver Usuarios
                                </button>
                            </div>
                        </div>

                        {/* Info Cards */}
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg mt-1">
                                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-blue-900 mb-1">Información importante</h4>
                                    <p className="text-sm text-blue-800">
                                        Los administradores tienen permisos completos para la gestión de usuarios y creación de procesos.
                                        La gestión de incidencias y reportes está disponible exclusivamente para el rol de Revisor.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeSection === "users" && (
                    <div className="space-y-6">
                        <UsersTable />
                    </div>
                )}

                {activeSection === "processes" && (
                    <div className="space-y-6">
                        <ProcessTable />
                    </div>
                )}
            </main>

            {/* Register User Modal */}
            <RegisterUserModal
                isOpen={isRegisterModalOpen}
                onClose={() => setIsRegisterModalOpen(false)}
                onSuccess={() => {
                    console.log("Usuario registrado exitosamente")
                }}
            />

            {/* Create Process Modal */}
            <CreateProcessModal
                isOpen={isCreateProcessModalOpen}
                onClose={() => setIsCreateProcessModalOpen(false)}
            />
        </div>
    )
}
