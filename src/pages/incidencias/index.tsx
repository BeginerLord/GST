import { useState } from "react"
import IncidenceTable from "@/components/revisor/IncidenceTable"
import CreateProcessModal from "@/components/revisor/CreateProcessModal"
import { AlertTriangle, FolderPlus } from "lucide-react"

export default function IncidenciasPage() {
  const [isCreateProcessModalOpen, setIsCreateProcessModalOpen] = useState(false)

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

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setIsCreateProcessModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors shadow-sm"
          >
            <FolderPlus size={18} />
            <span>Nuevo Proceso</span>
          </button>
        </div>
      </div>

      <IncidenceTable />

      {/* Modal para crear proceso */}
      <CreateProcessModal
        isOpen={isCreateProcessModalOpen}
        onClose={() => setIsCreateProcessModalOpen(false)}
      />
    </main>
  )
}
