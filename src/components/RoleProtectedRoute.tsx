
import { useAuth } from '@/hooks/useAuth';
import { Navigate, useLocation } from 'react-router-dom';
import { Train } from 'lucide-react';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  requiredRole: 'admin' | 'user';
}

export default function RoleProtectedRoute({ children, requiredRole }: RoleProtectedRouteProps) {
  const { user, profile, loading } = useAuth();
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
    const authPath = requiredRole === 'admin' ? '/auth/admin' : '/auth/user';
    return <Navigate to={authPath} state={{ from: location }} replace />;
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/10 flex items-center justify-center">
        <div className="text-center">
          <Train className="h-12 w-12 animate-bounce mx-auto mb-4 text-primary" />
          <p className="text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (profile.role !== requiredRole) {
    // Redirect to appropriate auth page if role doesn't match
    const authPath = requiredRole === 'admin' ? '/auth/admin' : '/auth/user';
    return <Navigate to={authPath} replace />;
  }

  return <>{children}</>;
}
