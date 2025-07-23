
import { useAuth } from '@/hooks/useAuth';
import { Navigate, useLocation } from 'react-router-dom';
import { Train } from 'lucide-react';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export default function RoleProtectedRoute({ children, requiredRole }: RoleProtectedRouteProps) {
  const { user, userProfile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/10 flex items-center justify-center">
        <div className="text-center">
          <Train className="h-12 w-12 animate-bounce mx-auto mb-4 text-primary" />
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to appropriate auth page based on required role
    const redirectTo = requiredRole === 'admin' ? '/admin-auth' : '/user-auth';
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (requiredRole && userProfile?.role !== requiredRole) {
    // Redirect to appropriate page based on user's actual role
    const redirectTo = userProfile?.role === 'admin' ? '/admin' : '/user';
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
