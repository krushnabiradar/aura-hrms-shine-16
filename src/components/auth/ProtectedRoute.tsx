
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '@/context/AuthContext';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading, error } = useAuth();
  const location = useLocation();

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-lg text-muted-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  // Show error state if there's an authentication error
  if (error && !isAuthenticated) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background p-4">
        <div className="max-w-md w-full">
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Navigate to="/login" state={{ from: location }} replace />
        </div>
      </div>
    );
  }

  // Not authenticated, redirect to login
  if (!isAuthenticated) {
    console.log('User not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user role is allowed for this route
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    console.log(`Access denied for user ${user.email} with role ${user.role}. Required roles:`, allowedRoles);
    
    // Redirect based on user's actual role
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

  // User is authenticated and has proper role
  console.log(`Access granted for user ${user?.email} with role ${user?.role}`);
  return <Outlet />;
};
