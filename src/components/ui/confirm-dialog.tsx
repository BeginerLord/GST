import { AlertTriangle, CheckCircle, Loader2 } from "lucide-react"

interface ConfirmDialogProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void | Promise<void>
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    variant?: "danger" | "warning" | "success"
    isLoading?: boolean
}

export default function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    variant = "warning",
    isLoading = false
}: ConfirmDialogProps) {
    console.log("🔘 [MODAL] ConfirmDialog renderizado con isOpen:", isOpen)
    console.log("🔘 [MODAL] onConfirm recibido:", typeof onConfirm, onConfirm)

    if (!isOpen) return null

    const handleConfirm = () => {
        console.log("🔘 [MODAL] Iniciando handleConfirm")
        try {
            console.log("🔘 [MODAL] Ejecutando onConfirm...")
            onConfirm()
            console.log("🔘 [MODAL] onConfirm ejecutado exitosamente")
        } catch (error) {
            console.error("❌ [MODAL] Error in confirm action:", error)
        }
    }

    const getVariantStyles = () => {
        switch (variant) {
            case "danger":
                return {
                    icon: <AlertTriangle className="w-6 h-6 text-red-600" />,
                    confirmButton: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
                    iconBg: "bg-red-100"
                }
            case "success":
                return {
                    icon: <CheckCircle className="w-6 h-6 text-green-600" />,
                    confirmButton: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
                    iconBg: "bg-green-100"
                }
            default: // warning
                return {
                    icon: <AlertTriangle className="w-6 h-6 text-amber-600" />,
                    confirmButton: "bg-amber-600 hover:bg-amber-700 focus:ring-amber-500",
                    iconBg: "bg-amber-100"
                }
        }
    }

    const styles = getVariantStyles()

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                {/* Overlay */}
                <div
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                    onClick={onClose}
                />

                {/* Modal positioning */}
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                    &#8203;
                </span>

                {/* Modal content */}
                <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                    <div className="sm:flex sm:items-start">
                        {/* Icon */}
                        <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${styles.iconBg} sm:mx-0 sm:h-10 sm:w-10`}>
                            {styles.icon}
                        </div>

                        {/* Content */}
                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                            <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                {title}
                            </h3>
                            <div className="mt-2">
                                <p className="text-sm text-gray-500">
                                    {message}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                            type="button"
                            className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm transition-colors ${styles.confirmButton} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={() => {
                                console.log("🔘 [MODAL] Botón confirmar presionado")
                                handleConfirm()
                            }}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Procesando...
                                </>
                            ) : (
                                confirmText
                            )}
                        </button>
                        <button
                            type="button"
                            className={`mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={() => {
                                console.log("🔘 [MODAL] Botón cancelar presionado")
                                onClose()
                            }}
                            disabled={isLoading}
                        >
                            {cancelText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}