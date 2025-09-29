import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import Login from './pages/login/screenLogin'
import DashboardAdmin from './pages/Admin/dashboardAdmin'
import DashboardSupervisor from './pages/Supervisor/dashboardSupervisor'
import IncidenciasPage from './pages/incidencias'
import PublicRoute from './guards/PublicRoute'
import RoleBasedRoute from './guards/RoleBasedRoute'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/admin" element={
          <RoleBasedRoute allowedRoles={['administrador']}>
            <DashboardAdmin />
          </RoleBasedRoute>
        } />
        <Route path="/supervisor" element={
          <RoleBasedRoute allowedRoles={['supervisor']}>
            <DashboardSupervisor />
          </RoleBasedRoute>
        } />
        <Route path="/revisor" element={
          <RoleBasedRoute allowedRoles={['revisor']}>
            <IncidenciasPage />
          </RoleBasedRoute>
        } />
      </Routes>
    </Router>
  )
}

export default App
