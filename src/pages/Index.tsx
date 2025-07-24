
import { useAuth } from '@/hooks/useAuth';
import StationDisplay from '@/components/display/StationDisplay';
import { Button } from '@/components/ui/button';
import { Settings, User, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const { user, userProfile, signOut } = useAuth();

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100">
      {/* Access Buttons with colorful design */}
      <div className="absolute top-6 right-6 z-10 flex gap-3">
        {user ? (
          <>
            {userProfile?.role === 'admin' && (
              <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg">
                <Link to="/admin">
                  <Settings className="mr-2 h-4 w-4" />
                  Admin Panel
                </Link>
              </Button>
            )}
            {userProfile?.role === 'user' && (
              <Button asChild className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0 shadow-lg">
                <Link to="/user">
                  <User className="mr-2 h-4 w-4" />
                  User Panel
                </Link>
              </Button>
            )}
            <Button 
              onClick={signOut}
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white border-0 shadow-lg"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </>
        ) : (
          <div className="flex gap-3">
            <Button asChild className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white border-0 shadow-lg">
              <Link to="/user-auth">
                <User className="mr-2 h-4 w-4" />
                User Sign In
              </Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg">
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
