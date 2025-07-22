
import { useAuth } from '@/hooks/useAuth';
import StationDisplay from '@/components/display/StationDisplay';
import { Button } from '@/components/ui/button';
import { Settings, LogIn, User, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const { user, profile } = useAuth();

  return (
    <div className="relative">
      {/* Access Buttons */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        {user && profile ? (
          <>
            {profile.role === 'user' && (
              <Button asChild variant="outline">
                <Link to="/user">
                  <User className="mr-2 h-4 w-4" />
                  User Panel
                </Link>
              </Button>
            )}
            {profile.role === 'admin' && (
              <>
                <Button asChild variant="outline">
                  <Link to="/user">
                    <User className="mr-2 h-4 w-4" />
                    User Panel
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/admin">
                    <Settings className="mr-2 h-4 w-4" />
                    Admin Panel
                  </Link>
                </Button>
              </>
            )}
          </>
        ) : (
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link to="/auth/user">
                <User className="mr-2 h-4 w-4" />
                User Login
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/auth/admin">
                <Shield className="mr-2 h-4 w-4" />
                Admin Login
              </Link>
            </Button>
          </div>
        )}
      </div>
      
      {/* Main Display */}
      <StationDisplay />
    </div>
  );
};

export default Index;
