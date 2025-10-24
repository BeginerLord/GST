import { useEffect, useState } from "react"
import { Search, ChevronDown, ChevronUp, FolderOpen } from "lucide-react"
import type { ProcessResponse } from "@/models/admin"
import { useGetAllProcessesHook } from "@/hooks/admin"

export default function ProcessTable() {
  const {
    data: processes = [],
    isLoading,
    error,
    refetch: loadProcesses,
  } = useGetAllProcessesHook()

  const [filteredProcesses, setFilteredProcesses] = useState<ProcessResponse[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<keyof ProcessResponse>("id")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  const applyFilters = () => {
    let filtered = processes

    if (searchTerm) {
      filtered = filtered.filter(
        (proc) =>
          proc.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          proc.name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

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

    setFilteredProcesses(filtered)
  }

  useEffect(() => {
    applyFilters()
  }, [processes, searchTerm, sortBy, sortDirection])

  const handleSort = (field: keyof ProcessResponse) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortDirection("asc")
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {error && (
        <div className="bg-red-50 border-b border-red-200 p-4">
          <div className="flex items-center">
            <div className="text-red-800">
              <strong>Error:</strong> {error instanceof Error ? error.message : String(error)}
              <button
                onClick={() => loadProcesses()}
                className="ml-4 text-red-600 underline hover:text-red-800"
              >
                Reintentar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-5 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Buscar por ID o nombre de proceso..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all duration-200 outline-none"
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("id")}
              >
                <div className="flex items-center">
                  Proceso ID
                  {sortBy === "id" &&
                    (sortDirection === "asc" ? <ChevronUp size={15} /> : <ChevronDown size={15} />)}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center">
                  Nombre
                  {sortBy === "name" &&
                    (sortDirection === "asc" ? <ChevronUp size={15} /> : <ChevronDown size={15} />)}
                </div>
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
                onClick={() => handleSort("dueDate")}
              >
                <div className="flex items-center">
                  Fecha Límite
                  {sortBy === "dueDate" &&
                    (sortDirection === "asc" ? <ChevronUp size={15} /> : <ChevronDown size={15} />)}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Creador
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Revisor Asignado
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500 mr-2"></div>
                    Cargando procesos...
                  </div>
                </td>
              </tr>
            ) : filteredProcesses.length > 0 ? (
              filteredProcesses.map((process) => (
                <tr key={process.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FolderOpen size={16} className="text-emerald-500 mr-2" />
                      <div className="font-medium text-gray-900">{process.id}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900">{process.name || "-"}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        process.status === "en revisión"
                          ? "bg-blue-100 text-blue-800"
                          : process.status === "completado"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {process.status || "Sin estado"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {formatDate(process.createdAt.toString())}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {formatDate(process.dueDate.toString())}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    <div className="max-w-xs truncate" title={process.createdBy.name}>
                      {process.createdBy.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {process.assignedReviewer ? (
                      <div className="max-w-xs truncate" title={process.assignedReviewer.email}>
                        {process.assignedReviewer.name}
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">No asignado</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                  No se encontraron procesos con los criterios de búsqueda actuales.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Mostrando <span className="font-medium">{filteredProcesses.length}</span> de{" "}
          <span className="font-medium">{processes.length}</span> procesos
        </div>
      </div>
    </div>
  )
}
