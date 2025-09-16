import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  CheckCircle,
  Clock,
  Users,
  FileText,
  Shield,
  BarChart3,
  Bell,
  Search,
  Eye,
  UserCheck,
  Settings,
} from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function LandingPage() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">GST</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#como-funciona" className="text-muted-foreground hover:text-foreground transition-colors">
              Cómo funciona
            </a>
            <a href="#caracteristicas" className="text-muted-foreground hover:text-foreground transition-colors">
              Características
            </a>
            <Button variant="outline" size="sm" onClick={handleLoginClick}>
              Iniciar sesión
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Verificaciones de procesos en <span className="text-primary">tiempo real</span>, sin fricción
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
            Registra, supervisa y aprueba incidencias con colaboración simultánea, trazabilidad completa y reportes
            listos para auditoría.
          </p>

          {/* Mock Dashboard Preview */}
          <div className="mt-16 bg-card border border-border rounded-lg p-6 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-l-4 border-l-yellow-500">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      Pendiente
                    </Badge>
                    <Clock className="w-4 h-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium">Verificación línea A</p>
                  <p className="text-xs text-muted-foreground">Asignado a: J. García</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      En revisión
                    </Badge>
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium">Control calidad B</p>
                  <p className="text-xs text-muted-foreground">Supervisor: M. López</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Aprobada
                    </Badge>
                    <CheckCircle className="w-4 h-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium">Proceso C completado</p>
                  <p className="text-xs text-muted-foreground">Finalizado: 14:30</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Problem → Solution */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Los problemas que enfrentas diariamente</h2>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground">Falta de trazabilidad en los procesos de verificación</p>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground">Retrasos en la resolución de incidencias críticas</p>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground">Comunicación fragmentada entre equipos</p>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground">Dificultad para generar reportes de auditoría</p>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Nuestra solución</h2>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <p className="text-foreground">
                    <strong>Tiempo real:</strong> Visibilidad instantánea del estado de todos los procesos
                  </p>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <p className="text-foreground">
                    <strong>Colaboración:</strong> Equipos trabajando simultáneamente sin conflictos
                  </p>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <p className="text-foreground">
                    <strong>Reportes automáticos:</strong> PDFs listos para auditorías internas y externas
                  </p>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <p className="text-foreground">
                    <strong>Trazabilidad completa:</strong> Historial detallado de cada acción y cambio
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="como-funciona" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">Cómo funciona</h2>
            <p className="text-xl text-muted-foreground">Flujo simple y eficiente para todos los roles</p>
          </div>

          {/* Process Flow */}
          <div className="mb-16">
            <div className="flex flex-wrap justify-center items-center gap-4 mb-12">
              {["Detectar", "Registrar", "Asignar", "Colaborar", "Resolver", "Aprobar", "Reportar"].map(
                (step, index) => (
                  <div key={step} className="flex items-center">
                    <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <span className="ml-2 font-medium text-foreground">{step}</span>
                    {index < 6 && <div className="w-8 h-px bg-border ml-4"></div>}
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Roles */}
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <UserCheck className="w-6 h-6 text-primary" />
                  <CardTitle>Revisor</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Ve procesos asignados y su estado</li>
                  <li>• Registra incidencias con evidencias</li>
                  <li>• Colabora con otros revisores</li>
                  <li>• Actualiza estados a "resuelta"</li>
                </ul>
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    <strong>Beneficios:</strong> Rapidez para reportar, claridad de pendientes, menos retrabajo
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Eye className="w-6 h-6 text-primary" />
                  <CardTitle>Supervisor</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Prioriza y asigna incidencias</li>
                  <li>• Valida y aprueba resoluciones</li>
                  <li>• Monitorea procesos críticos</li>
                  <li>• Hace seguimiento del progreso</li>
                </ul>
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    <strong>Beneficios:</strong> Control del flujo, cumplimiento de SLA, decisiones con datos
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Settings className="w-6 h-6 text-primary" />
                  <CardTitle>Administrador</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Gestiona usuarios y permisos</li>
                  <li>• Administra procesos y políticas</li>
                  <li>• Accede a reportes globales</li>
                  <li>• Supervisa auditorías</li>
                </ul>
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    <strong>Beneficios:</strong> Gobierno, cumplimiento y seguridad de la información
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section id="caracteristicas" className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">Características clave</h2>
            <p className="text-xl text-muted-foreground">Todo lo que necesitas para optimizar tus procesos</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Clock, title: "Tiempo real", desc: "Visibilidad instantánea del estado de procesos" },
              { icon: Users, title: "Colaboración", desc: "Múltiples usuarios trabajando simultáneamente" },
              { icon: FileText, title: "Historial completo", desc: "Registro detallado de cambios y acciones" },
              { icon: FileText, title: "Reportes PDF", desc: "Generación automática para auditorías" },
              { icon: Bell, title: "Alertas", desc: "Notificaciones instantáneas de cambios" },
              { icon: Search, title: "Filtros avanzados", desc: "Búsqueda por proceso, estado, fecha" },
              { icon: BarChart3, title: "Dashboards", desc: "KPIs y métricas de rendimiento" },
              { icon: Shield, title: "Seguridad", desc: "Control de acceso por roles" },
            ].map((feature, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <feature.icon className="w-8 h-8 text-primary mx-auto mb-2" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Beneficios medibles</h2>
          <p className="text-xl text-muted-foreground mb-12">Impacto real en tu operación</p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">-40%</div>
              <p className="text-foreground font-medium">Tiempo de resolución</p>
              <p className="text-sm text-muted-foreground">Reducción promedio en tiempo de cierre de incidencias</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">+95%</div>
              <p className="text-foreground font-medium">Cumplimiento auditoría</p>
              <p className="text-sm text-muted-foreground">Tasa de aprobación en auditorías externas</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">-60%</div>
              <p className="text-foreground font-medium">Retrabajo</p>
              <p className="text-sm text-muted-foreground">Menos errores por comunicación deficiente</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">Confían en nosotros</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground mb-4">
                  "GST transformó nuestra gestión de calidad. Ahora tenemos visibilidad completa y los reportes se
                  generan automáticamente."
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                    MG
                  </div>
                  <div>
                    <p className="font-medium text-foreground">María González</p>
                    <p className="text-sm text-muted-foreground">Jefa de Calidad, ManufacturingCorp</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground mb-4">
                  "La colaboración en tiempo real eliminó los cuellos de botella. Nuestro equipo es 40% más eficiente."
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                    JR
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Juan Rodríguez</p>
                    <p className="text-sm text-muted-foreground">Director de Operaciones, TechPlant</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground mb-4">
                  "Los reportes automáticos nos ahorraron semanas de trabajo manual. Las auditorías ahora son pan
                  comido."
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                    AS
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Ana Silva</p>
                    <p className="text-sm text-muted-foreground">Gerente de Cumplimiento, IndustrialSafe</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Company Logos */}
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="bg-muted px-6 py-3 rounded-lg">
              <span className="font-bold text-muted-foreground">ManufacturingCorp</span>
            </div>
            <div className="bg-muted px-6 py-3 rounded-lg">
              <span className="font-bold text-muted-foreground">TechPlant</span>
            </div>
            <div className="bg-muted px-6 py-3 rounded-lg">
              <span className="font-bold text-muted-foreground">IndustrialSafe</span>
            </div>
          </div>
        </div>
      </section>
      {/* FAQ */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">Preguntas frecuentes</h2>
          </div>

          <div className="space-y-6">
            {[
              {
                q: "¿Cómo funciona la seguridad por roles?",
                a: "Cada usuario tiene permisos específicos según su rol (Revisor, Supervisor, Administrador). Los datos están protegidos y cada acción queda registrada para auditoría.",
              },
              {
                q: "¿Pueden varios usuarios trabajar simultáneamente?",
                a: "Sí, la plataforma permite colaboración en tiempo real sin conflictos. Los cambios se sincronizan automáticamente y todos ven las actualizaciones al instante.",
              },
              {
                q: "¿Qué tipos de reportes puedo generar?",
                a: "Reportes PDF personalizables para auditorías, dashboards con KPIs, métricas de rendimiento, historial de incidencias y reportes de cumplimiento.",
              },
              {
                q: "¿Cómo funciona el tiempo real?",
                a: "Utilizamos tecnología de sincronización instantánea. Cualquier cambio en el estado de procesos, nuevas incidencias o actualizaciones se reflejan inmediatamente en todos los dispositivos.",
              },
              {
                q: "¿Qué tipo de soporte ofrecen?",
                a: "Ofrecemos soporte por email en el plan Essentials, soporte prioritario en Pro, y soporte dedicado con gerente de cuenta en Enterprise.",
              },
              {
                q: "¿La plataforma es escalable?",
                a: "Completamente. Desde equipos de 10 usuarios hasta organizaciones con miles de empleados. La infraestructura se adapta automáticamente a tus necesidades.",
              },
            ].map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{faq.q}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">GST</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Control y trazabilidad en tiempo real para equipos de calidad y operaciones.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Producto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Características
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Precios
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Integraciones
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Sobre nosotros
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Carreras
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Contacto
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Soporte</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Centro de ayuda
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Documentación
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Estado del servicio
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Política de privacidad
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center">
            <p className="text-sm text-muted-foreground">© 2024 GST. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
