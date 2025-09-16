import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';


interface RoleBasedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
}

const RoleBasedRoute = ({ children, allowedRoles }: RoleBasedRouteProps) => {
  const token = sessionStorage.getItem('token');
  const userRole = sessionStorage.getItem('userRole');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  if (!userRole || !allowedRoles.includes(userRole)) {
    if (userRole === 'administrador') {
      return <Navigate to="/admin" replace />;
    } else if (userRole === 'revisor') {
      return <Navigate to="/revisor" replace />;
    } else {
      return <Navigate to="/login" replace />;
    }
  }
  
  return <>{children}</>;
};

export default RoleBasedRoute;