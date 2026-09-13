import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: UserRole;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRole }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    // Redirect to login page and preserve attempt path
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRole && currentUser.role !== allowedRole) {
    // If logged in with a different role, direct to their role's dashboard
    if (currentUser.role === 'student') return <Navigate to="/student/dashboard" replace />;
    if (currentUser.role === 'industry') return <Navigate to="/industry/dashboard" replace />;
    if (currentUser.role === 'academician') return <Navigate to="/academician/dashboard" replace />;
    if (currentUser.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
};
