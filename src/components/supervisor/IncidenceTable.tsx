import { useEffect, useState } from "react"
import { Eye, CheckCircle, Search, ChevronDown, ChevronUp, Plus, Download } from "lucide-react"
import CreateIncidenceModal from "./CreateIncidenceModal"
import ViewIncidenceModal from "../revisor/ViewIncidenceModal"
import GenerateReportModal from "./GenerateReportModal"
import ConfirmDialog from "@/components/ui/confirm-dialog"
import type { Incidence } from "@/models/incidents"
import {
  useGetAllIncidencesHook,
  useResolveIncidentHook,
  useGetAllProcessesHook,
} from "@/hooks/supervisor"

export default function IncidenceTable() {
  // Hooks
  const {
    data: incidences = [],
    isLoading,
    error,
    refetch: loadAllIncidents,
  } = useGetAllIncidencesHook()

  const { data: processes = [], refetch: loadProcesses } = useGetAllProcessesHook()

  const { resolveIncidentFn } = useResolveIncidentHook({
    onSuccess: () => {
      loadAllIncidents()
      setIsConfirmDialogOpen(false)
      setIncidenceToResolve(null)
    },
  })

  // Estados locales
  const [filteredIncidences, setFilteredIncidences] = useState<Incidence[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING" | "RESOLVED">("ALL")
  const [sortBy, setSortBy] = useState<keyof Incidence>("createdAt")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  // Modales
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [selectedIncidence, setSelectedIncidence] = useState<Incidence | null>(null)
  const [incidenceToResolve, setIncidenceToResolve] = useState<string | null>(null)

  // Cargar datos al montar el componente
  useEffect(() => {
    loadAllIncidents()
    loadProcesses()
  }, [])

  // Filtrar incidencias
  useEffect(() => {
    let filtered = incidences

    // Filtro por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (inc) =>
          inc.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inc.processId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inc.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtro por estado
    if (statusFilter !== "ALL") {
      filtered = filtered.filter((inc) => inc.status === statusFilter)
    }

    // Ordenar
    filtered.sort((a, b) => {
      const aValue = a[sortBy]
      const bValue = b[sortBy]

      if (aValue === undefined && bValue === undefined) return 0
      if (aValue === undefined) return sortDirection === "asc" ? 1 : -1
      if (bValue === undefined) return sortDirection === "asc" ? -1 : 1

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
      return 0
    })

    setFilteredIncidences(filtered)
  }, [incidences, searchTerm, statusFilter, sortBy, sortDirection])

  const handleSort = (field: keyof Incidence) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortDirection("asc")
    }
  }

  const handleCreateIncidence = async () => {
    await loadAllIncidents()
  }

  const handleResolveIncidence = async (incidenceId: string) => {
    if (!incidenceId) {
      console.error("❌ Error: ID de incidencia no válido:", incidenceId)
      alert("Error: No se puede resolver la incidencia. ID no válido.")
      return
    }

    setIncidenceToResolve(incidenceId)
    setIsConfirmDialogOpen(true)
  }

  const confirmResolveIncidence = async () => {
    if (!incidenceToResolve) return
    resolveIncidentFn(incidenceToResolve)
  }

  const handleViewIncidence = (incidence: Incidence) => {
    setSelectedIncidence(incidence)
    setIsViewModalOpen(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-50 border-b border-red-200 p-4">
            <div className="flex items-center">
              <div className="text-red-800">
                <strong>Error:</strong> {error.message}
                <button
                  onClick={() => loadAllIncidents()}
                  className="ml-4 text-red-600 underline hover:text-red-800"
                >
                  Reintentar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filtros y controles */}
        <div className="p-5 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Buscar por ID, proceso o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 outline-none"
              />
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            <select
              className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 outline-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "ALL" | "PENDING" | "RESOLVED")}
            >
              <option value="ALL">Todos los estados</option>
              <option value="PENDING">Pendientes</option>
              <option value="RESOLVED">Resueltas</option>
            </select>

            <button
              onClick={() => setIsReportModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              <Download size={16} />
              <span>Generar Reporte</span>
            </button>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus size={16} />
              <span>Nueva Incidencia</span>
            </button>
          </div>
        </div>

        {/* Tabla - continuación igual que revisor... */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("processId")}
                >
                  <div className="flex items-center">
                    Proceso ID
                    {sortBy === "processId" &&
                      (sortDirection === "asc" ? <ChevronUp size={15} /> : <ChevronDown size={15} />)}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descripción
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center">
                    Estado
                    {sortBy === "status" &&
                      (sortDirection === "asc" ? <ChevronUp size={15} /> : <ChevronDown size={15} />)}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Evidencia
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("createdBy")}
                >
                  <div className="flex items-center">
                    Creado Por
                    {sortBy === "createdBy" &&
                      (sortDirection === "asc" ? <ChevronUp size={15} /> : <ChevronDown size={15} />)}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("createdAt")}
                >
                  <div className="flex items-center">
                    Fecha Creación
                    {sortBy === "createdAt" &&
                      (sortDirection === "asc" ? <ChevronUp size={15} /> : <ChevronDown size={15} />)}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("resolvedAt")}
                >
                  <div className="flex items-center">
                    Fecha Resolución
                    {sortBy === "resolvedAt" &&
                      (sortDirection === "asc" ? <ChevronUp size={15} /> : <ChevronDown size={15} />)}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-2"></div>
                      Cargando incidencias...
                    </div>
                  </td>
                </tr>
              ) : filteredIncidences.length > 0 ? (
                filteredIncidences.map((incidence) => (
                  <tr key={incidence.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{incidence.processId}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900 max-w-xs truncate" title={incidence.description}>
                        {incidence.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          incidence.status === "RESOLVED"
                            ? "bg-green-100 text-green-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {incidence.status === "RESOLVED" ? "Resuelta" : "Pendiente"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {incidence.evidence && incidence.evidence.length > 0 ? (
                        <div className="flex items-center gap-2">
                          <span className="text-blue-600">
                            {incidence.evidence.length} archivo{incidence.evidence.length > 1 ? "s" : ""}
                          </span>
                          <button
                            onClick={() => handleViewIncidence(incidence)}
                            className="text-blue-600 hover:text-blue-800 underline text-sm"
                          >
                            Ver
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-400">Sin evidencia</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      <div
                        className="max-w-xs truncate"
                        title={
                          typeof incidence.createdBy === "string"
                            ? incidence.createdBy
                            : incidence.createdBy?.name || incidence.createdBy?.email || "Usuario"
                        }
                      >
                        {typeof incidence.createdBy === "string"
                          ? incidence.createdBy
                          : incidence.createdBy?.name || incidence.createdBy?.email || "Usuario"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{formatDate(incidence.createdAt)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      {incidence.resolvedAt ? formatDate(incidence.resolvedAt) : <span className="text-gray-400">-</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          className="p-1 rounded-full hover:bg-gray-100"
                          title="Ver detalles"
                          onClick={() => handleViewIncidence(incidence)}
                        >
                          <Eye size={18} className="text-gray-500" />
                        </button>
                        {incidence.status === "PENDING" && incidence.id && (
                          <button
                            className="p-1 rounded-full hover:bg-gray-100"
                            title="Marcar como resuelta"
                            onClick={() => handleResolveIncidence(incidence.id)}
                          >
                            <CheckCircle size={18} className="text-green-500" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    No se encontraron incidencias con los criterios de búsqueda actuales.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer con información */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Mostrando <span className="font-medium">{filteredIncidences.length}</span> de{" "}
            <span className="font-medium">{incidences.length}</span> incidencias
          </div>
        </div>
      </div>

      {/* Modales */}
      <CreateIncidenceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateIncidence}
      />

      {selectedIncidence && (
        <ViewIncidenceModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false)
            setSelectedIncidence(null)
          }}
          incidence={selectedIncidence}
        />
      )}

      <GenerateReportModal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} processes={processes} />

      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => {
          setIsConfirmDialogOpen(false)
          setIncidenceToResolve(null)
        }}
        onConfirm={confirmResolveIncidence}
        title="Confirmar resolución"
        message="¿Estás seguro de que deseas marcar esta incidencia como resuelta? Esta acción no se puede deshacer."
        confirmText="Marcar como resuelta"
        cancelText="Cancelar"
        variant="success"
      />
    </>
  )
}