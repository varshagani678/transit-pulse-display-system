
import { useAuth } from '@/hooks/useAuth';
import StationDisplay from '@/components/display/StationDisplay';
import { Button } from '@/components/ui/button';
import { Settings, User, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const { user, userProfile, signOut } = useAuth();

  return (
    <div className="relative">
      {/* Access Buttons */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        {user ? (
          <>
            {userProfile?.role === 'admin' && (
              <Button asChild variant="outline">
                <Link to="/admin">
                  <Settings className="mr-2 h-4 w-4" />
                  Admin Panel
                </Link>
              </Button>
            )}
            {userProfile?.role === 'user' && (
              <Button asChild variant="outline">
                <Link to="/user">
                  <User className="mr-2 h-4 w-4" />
                  User Panel
                </Link>
              </Button>
            )}
            <Button variant="outline" onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </>
        ) : (
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link to="/user-auth">
                <User className="mr-2 h-4 w-4" />
                User Sign In
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/admin-auth">
                <Settings className="mr-2 h-4 w-4" />
                Admin Sign In
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
