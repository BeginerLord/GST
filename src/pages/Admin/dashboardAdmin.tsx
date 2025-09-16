import type React from "react"
import { useNavigate } from "react-router-dom"

interface AdminAction {
    key: string
    title: string
    description: string
    to: string
    icon: React.ReactNode
}

const UserIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
)

const UsersIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
)

const EditIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
)

const TrashIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="3,6 5,6 21,6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <line x1="10" y1="11" x2="10" y2="17" />
        <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
)

const ReportIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14,2 14,8 20,8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10,9 9,9 8,9" />
    </svg>
)

const ArrowRightIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 12h14" />
        <path d="M12 5l7 7-7 7" />
    </svg>
)

export default function ScreenAdmin() {
    const navigate = useNavigate()

    const actions: AdminAction[] = [
        {
            key: "create-user",
            title: "Crear usuario",
            description: "Da de alta nuevos colaboradores y define su rol.",
            to: "/admin/users/new",
            icon: <UserIcon />,
        },
        {
            key: "view-users",
            title: "Ver usuarios",
            description: "Consulta y filtra el directorio de usuarios.",
            to: "/admin/users",
            icon: <UsersIcon />,
        },
        {
            key: "modify-user",
            title: "Modificar usuario",
            description: "Actualiza rol, datos o estado de acceso.",
            to: "/admin/users/edit",
            icon: <EditIcon />,
        },
        {
            key: "delete-user",
            title: "Eliminar usuario",
            description: "Revoca acceso y elimina cuentas de forma segura.",
            to: "/admin/users/delete",
            icon: <TrashIcon />,
        },
        {
            key: "view-reports",
            title: "Ver reportes",
            description: "Accede a reportes y descargas en PDF.",
            to: "/admin/reports",
            icon: <ReportIcon />,
        },
    ]

    const handleRowClick = (to: string) => {
        navigate(to)
    }

    const handleKeyDown = (event: React.KeyboardEvent, to: string) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault()
            navigate(to)
        }
    }

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>Panel de Administración</h1>
                <p style={styles.subtitle}>Gestiona usuarios, permisos y reportes desde un único lugar.</p>
            </header>

            <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead>
                        <tr style={styles.headerRow}>
                            <th style={styles.headerCell}>Función</th>
                            <th style={styles.headerCell}>Descripción</th>
                            <th style={styles.headerCell}>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {actions.map((action, index) => (
                            <tr
                                key={action.key}
                                style={{
                                    ...styles.row,
                                    borderBottom: index === actions.length - 1 ? "none" : "1px solid #f3f4f6",
                                }}
                                onClick={() => handleRowClick(action.to)}
                                onKeyDown={(e) => handleKeyDown(e, action.to)}
                                tabIndex={0}
                                role="button"
                                aria-label={`${action.title}: ${action.description}`}
                            >
                                <td style={styles.cell}>
                                    <div style={styles.functionCell}>
                                        <div style={styles.iconContainer}>{action.icon}</div>
                                        <span style={styles.functionTitle}>{action.title}</span>
                                    </div>
                                </td>
                                <td style={styles.cell}>
                                    <span style={styles.description}>{action.description}</span>
                                </td>
                                <td style={styles.cell}>
                                    <button
                                        style={styles.actionButton}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleRowClick(action.to)
                                        }}
                                        aria-label={`Ir a ${action.title.toLowerCase()}`}
                                    >
                                        <span>Acceder</span>
                                        <ArrowRightIcon />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

const styles = {
    container: {
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "32px 24px",
        fontFamily: "system-ui, -apple-system, sans-serif",
    } as React.CSSProperties,

    header: {
        textAlign: "center" as const,
        marginBottom: "48px",
    } as React.CSSProperties,

    title: {
        fontSize: "2rem",
        fontWeight: "600",
        color: "#111827",
        margin: "0 0 12px 0",
        letterSpacing: "-0.025em",
    } as React.CSSProperties,

    subtitle: {
        fontSize: "1rem",
        color: "#6b7280",
        margin: "0",
        fontWeight: "400",
    } as React.CSSProperties,

    tableContainer: {
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        border: "1px solid #e5e7eb",
        overflow: "hidden",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    } as React.CSSProperties,

    table: {
        width: "100%",
        borderCollapse: "collapse" as const,
    } as React.CSSProperties,

    headerRow: {
        backgroundColor: "#f9fafb",
        borderBottom: "1px solid #e5e7eb",
    } as React.CSSProperties,

    headerCell: {
        padding: "16px 24px",
        textAlign: "left" as const,
        fontSize: "0.875rem",
        fontWeight: "600",
        color: "#374151",
        textTransform: "uppercase" as const,
        letterSpacing: "0.05em",
    } as React.CSSProperties,

    row: {
        cursor: "pointer",
        transition: "background-color 0.15s ease-in-out",
        outline: "none",
    } as React.CSSProperties,

    cell: {
        padding: "20px 24px",
        verticalAlign: "middle" as const,
    } as React.CSSProperties,

    functionCell: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
    } as React.CSSProperties,

    iconContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "40px",
        height: "40px",
        backgroundColor: "#f3f4f6",
        borderRadius: "8px",
        color: "#6b7280",
        flexShrink: 0,
    } as React.CSSProperties,

    functionTitle: {
        fontSize: "1rem",
        fontWeight: "500",
        color: "#111827",
    } as React.CSSProperties,

    description: {
        fontSize: "0.875rem",
        color: "#6b7280",
        lineHeight: "1.5",
    } as React.CSSProperties,

    actionButton: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        backgroundColor: "transparent",
        border: "1px solid #d1d5db",
        borderRadius: "6px",
        padding: "8px 16px",
        fontSize: "0.875rem",
        fontWeight: "500",
        color: "#374151",
        cursor: "pointer",
        transition: "all 0.15s ease-in-out",
        outline: "none",
    } as React.CSSProperties,
}
