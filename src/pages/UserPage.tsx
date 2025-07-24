
import { useState } from 'react';
import { useSchedules } from '@/hooks/useSchedules';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { LogOut, Train, Bus, Search, Eye, Clock, MapPin, Info } from 'lucide-react';
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
        return 'bg-green-500 hover:bg-green-600';
      case 'delayed':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'cancelled':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getStatusGradient = (status: string) => {
    switch (status) {
      case 'on_time':
        return 'from-green-400 to-emerald-600';
      case 'delayed':
        return 'from-yellow-400 to-orange-500';
      case 'cancelled':
        return 'from-red-400 to-red-600';
      default:
        return 'from-gray-400 to-gray-600';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      {/* Header with colorful background */}
      <div className="mb-8">
        <div className="flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white shadow-xl">
          <div>
            <h1 className="text-5xl font-bold mb-2 animate-pulse">
              🚂 Transport Status Tracker
            </h1>
            <p className="text-xl opacity-90">
              Welcome, {user?.email} ✨
            </p>
          </div>
          <div className="flex gap-3">
            <Button asChild variant="outline" className="bg-white/20 border-white/30 hover:bg-white/30 text-white">
              <Link to="/">
                <Train className="mr-2 h-4 w-4" />
                View Display
              </Link>
            </Button>
            <Button variant="outline" onClick={signOut} className="bg-white/20 border-white/30 hover:bg-white/30 text-white">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Search Card with colorful design */}
      <Card className="mb-8 border-0 shadow-lg bg-gradient-to-r from-pink-100 to-purple-100">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl flex items-center gap-3 text-purple-800">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
              <Search className="h-6 w-6 text-white" />
            </div>
            Search Transport
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-4 top-4 h-5 w-5 text-purple-500" />
            <Input
              type="text"
              placeholder="🔍 Search by transport number, origin, or destination..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 text-lg border-2 border-purple-200 focus:border-purple-500 rounded-xl bg-white/80"
            />
          </div>
        </CardContent>
      </Card>

      {/* Results Card */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-xl">
          <CardTitle className="text-3xl flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-full">
              <Eye className="h-8 w-8" />
            </div>
            Transport Status ({filteredSchedules.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-bounce mb-6">
                <Train className="h-16 w-16 mx-auto text-blue-500" />
              </div>
              <p className="text-2xl font-medium text-gray-700">Loading schedules...</p>
            </div>
          ) : filteredSchedules.length === 0 ? (
            <div className="text-center py-16">
              <Train className="h-20 w-20 text-gray-400 mx-auto mb-6" />
              <p className="text-2xl text-gray-500 mb-4">
                {searchTerm ? '🔍 No schedules found matching your search' : '📅 No schedules available'}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredSchedules.map((schedule) => (
                <Card key={schedule.id} className="hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-0 bg-gradient-to-r from-white to-gray-50">
                  <CardContent className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                      {/* Transport Info */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-3 rounded-full bg-gradient-to-r ${schedule.type === 'train' ? 'from-blue-500 to-purple-600' : 'from-green-500 to-blue-500'}`}>
                            {schedule.type === 'train' ? (
                              <Train className="h-6 w-6 text-white" />
                            ) : (
                              <Bus className="h-6 w-6 text-white" />
                            )}
                          </div>
                          <span className="capitalize font-bold text-xl text-gray-800">{schedule.type}</span>
                        </div>
                        <div className="font-mono text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                          {schedule.transport_id}
                        </div>
                        <Badge className="bg-gradient-to-r from-orange-400 to-pink-500 text-white border-0 px-4 py-2 text-sm">
                          🚉 Platform {schedule.platform}
                        </Badge>
                      </div>

                      {/* Route Info */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="h-5 w-5" />
                          <span className="font-medium">Route</span>
                        </div>
                        <div className="text-xl font-bold text-gray-800">{schedule.origin}</div>
                        <div className="text-lg text-gray-600 flex items-center gap-2">
                          <span className="text-2xl">→</span>
                          <span>{schedule.destination}</span>
                        </div>
                      </div>

                      {/* Time Info */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="h-5 w-5" />
                          <span className="font-medium">Schedule</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Arrival:</span>
                            <span className="font-mono font-bold text-lg text-green-600">{formatTime(schedule.arrival_time)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Departure:</span>
                            <span className="font-mono font-bold text-lg text-blue-600">{formatTime(schedule.departure_time)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Status Display */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Info className="h-5 w-5" />
                          <span className="font-medium">Status</span>
                        </div>
                        <div className="space-y-3">
                          <Badge className={`${getStatusColor(schedule.status)} text-white border-0 px-4 py-2 text-sm font-bold transition-all duration-300`}>
                            {schedule.status === 'on_time' && '✅ '}
                            {schedule.status === 'delayed' && '⏰ '}
                            {schedule.status === 'cancelled' && '❌ '}
                            {schedule.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
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
