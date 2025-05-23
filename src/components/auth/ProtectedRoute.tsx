
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading...</span>
      </div>
    );
  }

  // Not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user role is allowed for this route
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect based on role
    switch (user.role) {
      case 'system_admin':
        return <Navigate to="/system-admin" replace />;
      case 'tenant_admin':
        return <Navigate to="/tenant-admin" replace />;
      case 'employee':
        return <Navigate to="/ess" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  // User is allowed to access this route
  return <Outlet />;
};
