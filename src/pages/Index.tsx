import { useAuth } from '@/hooks/useAuth';
import StationDisplay from '@/components/display/StationDisplay';
import { Button } from '@/components/ui/button';
import { Settings, LogIn, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="relative">
      {/* Access Buttons */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        {user ? (
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
        ) : (
          <Button asChild variant="outline">
            <Link to="/auth">
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Link>
          </Button>
        )}
      </div>
      
      {/* Main Display */}
      <StationDisplay />
    </div>
  );
};

export default Index;
