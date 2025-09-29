import type React from "react"
import { useState } from "react"
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react"
import { useLoginHook } from "@/hooks/login"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  
  const { loginFn, isPending } = useLoginHook({
    onSuccess: (response) => {
      // El servicio de login ya guarda el token y los datos del usuario
      // Solo necesitamos navegar según el rol
      const userRole = response?.user?.role;

      console.log("✅ Login exitoso. Rol del usuario:", userRole);

      if (userRole === 'administrador') {
        console.log("🔐 Navegando a /admin");
        navigate("/admin");
      } else if (userRole === 'revisor') {
        console.log("🔐 Navegando a /revisor");
        navigate("/revisor");
      } else {
        console.warn("⚠️ Rol no válido:", userRole);
        toast.error("Rol de usuario no válido");
      }
    },
    onError: (error) => {
      console.error("❌ Error en login:", error);
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginFn({
      email: formData.email,
      password: formData.password
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-600 rounded-2xl mb-4">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-cyan-600 rounded-sm"></div>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Bienvenido a GST</h1>
          <p className="text-slate-600">Ingresa tus credenciales para acceder</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 bg-slate-50 focus:bg-white"
                  placeholder="admin@platform.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-11 pr-12 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 bg-slate-50 focus:bg-white"
                  placeholder="••••••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="w-4 h-4 text-cyan-600 border-slate-300 rounded focus:ring-cyan-500" />
                <span className="ml-2 text-sm text-slate-600">Recordarme</span>
              </label>
              
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-400 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center group"
            >
              {isPending ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Iniciar Sesión
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-slate-500">
            ¿No tienes cuenta?{" "}
            <button className="text-cyan-600 hover:text-cyan-700 font-medium transition-colors">
              Contacta al administrador
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login;
