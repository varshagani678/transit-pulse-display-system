import { useAuth } from '@/hooks/useAuth';
import StationDisplay from '@/components/display/StationDisplay';
import { Button } from '@/components/ui/button';
import { Settings, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="relative">
      {/* Admin Access Button */}
      <div className="absolute top-4 right-4 z-10">
        {user ? (
          <Button asChild variant="outline">
            <Link to="/admin">
              <Settings className="mr-2 h-4 w-4" />
              Admin Panel
            </Link>
          </Button>
        ) : (
          <Button asChild variant="outline">
            <Link to="/auth">
              <LogIn className="mr-2 h-4 w-4" />
              Admin Login
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
