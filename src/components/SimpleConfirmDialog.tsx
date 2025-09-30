import { AlertTriangle, CheckCircle } from "lucide-react"

interface SimpleConfirmDialogProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    variant?: "danger" | "success" | "warning"
}

export default function SimpleConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    variant = "warning"
}: SimpleConfirmDialogProps) {
    if (!isOpen) return null

    const handleConfirm = () => {
        console.log("🔘 [SIMPLE_MODAL] Botón confirmar presionado")
        onConfirm()
        onClose()
    }

    const handleCancel = () => {
        console.log("🔘 [SIMPLE_MODAL] Botón cancelar presionado")
        onClose()
    }

    const getVariantStyles = () => {
        switch (variant) {
            case "danger":
                return {
                    icon: <AlertTriangle className="w-6 h-6 text-red-600" />,
                    confirmButton: "bg-red-600 hover:bg-red-700",
                    iconBg: "bg-red-100"
                }
            case "success":
                return {
                    icon: <CheckCircle className="w-6 h-6 text-green-600" />,
                    confirmButton: "bg-green-600 hover:bg-green-700",
                    iconBg: "bg-green-100"
                }
            default: // warning
                return {
                    icon: <AlertTriangle className="w-6 h-6 text-amber-600" />,
                    confirmButton: "bg-amber-600 hover:bg-amber-700",
                    iconBg: "bg-amber-100"
                }
        }
    }

    const styles = getVariantStyles()

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Overlay */}
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
                <div
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                    onClick={handleCancel}
                />

                {/* Modal content */}
                <div className="relative inline-block align-middle bg-white rounded-lg px-6 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full sm:p-6">
                    <div className="sm:flex sm:items-start">
                        {/* Icon */}
                        <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${styles.iconBg} sm:mx-0 sm:h-10 sm:w-10`}>
                            {styles.icon}
                        </div>

                        {/* Content */}
                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
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
                            className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm transition-colors ${styles.confirmButton}`}
                            onClick={handleConfirm}
                        >
                            {confirmText}
                        </button>
                        <button
                            type="button"
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm transition-colors"
                            onClick={handleCancel}
                        >
                            {cancelText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}