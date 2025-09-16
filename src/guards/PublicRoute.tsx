import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface PublicRouteProps {
  children: ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const token = sessionStorage.getItem('token');
  const userRole = sessionStorage.getItem('userRole');
  
  if (token && userRole) {
    if (userRole === 'administrador') {
      return <Navigate to="/admin" replace />;
    } else if (userRole === 'revisor') {
      return <Navigate to="/revisor" replace />;
    }
  }
  
  return <>{children}</>;
};

export default PublicRoute;