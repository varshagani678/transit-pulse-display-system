
import { useState } from 'react';
import { useSchedules } from '@/hooks/useSchedules';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { LogOut, Train, Bus, Search, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function UserPage() {
  const { schedules, loading } = useSchedules();
  const { signOut, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter schedules based on search term
  const filteredSchedules = schedules.filter((schedule) =>
    schedule.transport_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    schedule.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    schedule.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on_time':
        return 'bg-green-500';
      case 'delayed':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatTime = (timeString: string) => {
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/10 p-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-2">Transport Status Tracker</h1>
            <p className="text-muted-foreground">
              Welcome, {user?.email}
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link to="/">
                <Train className="mr-2 h-4 w-4" />
                View Display
              </Link>
            </Button>
            <Button variant="outline" onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Transport
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by transport number, origin, or destination..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Eye className="h-6 w-6" />
            Transport Status ({filteredSchedules.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <Train className="h-12 w-12 animate-bounce mx-auto mb-4 text-primary" />
              <p className="text-lg">Loading schedules...</p>
            </div>
          ) : filteredSchedules.length === 0 ? (
            <div className="text-center py-12">
              <Train className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-xl text-muted-foreground mb-4">
                {searchTerm ? 'No schedules found matching your search' : 'No schedules available'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSchedules.map((schedule) => (
                <Card key={schedule.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Transport Info */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {schedule.type === 'train' ? (
                            <Train className="h-5 w-5 text-primary" />
                          ) : (
                            <Bus className="h-5 w-5 text-secondary-foreground" />
                          )}
                          <span className="capitalize font-medium text-lg">{schedule.type}</span>
                        </div>
                        <div className="font-mono text-xl font-bold text-primary">
                          {schedule.transport_id}
                        </div>
                        <Badge variant="outline">
                          Platform {schedule.platform}
                        </Badge>
                      </div>

                      {/* Route Info */}
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">Route</div>
                        <div className="text-lg font-medium">{schedule.origin}</div>
                        <div className="text-muted-foreground">→ {schedule.destination}</div>
                      </div>

                      {/* Time Info */}
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">Schedule</div>
                        <div className="font-mono">
                          <div className="text-sm">Arrival: <span className="font-medium">{formatTime(schedule.arrival_time)}</span></div>
                          <div className="text-sm">Departure: <span className="font-medium">{formatTime(schedule.departure_time)}</span></div>
                        </div>
                      </div>

                      {/* Status Display */}
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">Status</div>
                        <div className="space-y-2">
                          <Badge className={`${getStatusColor(schedule.status)} text-white`}>
                            {schedule.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <div className="text-xs text-muted-foreground">
                            Real-time status
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
