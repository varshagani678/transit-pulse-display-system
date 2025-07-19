import { useEffect, useState } from 'react';
import { useSchedules } from '@/hooks/useSchedules';
import { Schedule } from '@/types/schedule';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, MapPin, Train, Bus, Navigation } from 'lucide-react';

export default function StationDisplay() {
  const { schedules, loading } = useSchedules();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getStatusColor = (status: Schedule['status']) => {
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

  const getStatusText = (status: Schedule['status']) => {
    switch (status) {
      case 'on_time':
        return 'On Time';
      case 'delayed':
        return 'Delayed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const formatTime = (timeString: string) => {
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/5 flex items-center justify-center">
        <div className="text-center">
          <Train className="h-12 w-12 animate-bounce mx-auto mb-4 text-primary" />
          <p className="text-lg">Loading schedules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/5 p-4">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-primary mb-2">Central Station</h1>
        <div className="flex items-center justify-center gap-2 text-xl text-muted-foreground">
          <Clock className="h-5 w-5" />
          <span>{currentTime.toLocaleTimeString('en-US', { hour12: false })}</span>
          <span className="mx-2">•</span>
          <span>{currentTime.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </div>
      </div>

      {/* Schedules Display */}
      <Card className="max-w-7xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Navigation className="h-6 w-6" />
            Departures & Arrivals
          </CardTitle>
        </CardHeader>
        <CardContent>
          {schedules.length === 0 ? (
            <div className="text-center py-12">
              <Train className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-xl text-muted-foreground">No schedules available</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left p-4 font-semibold">Type</th>
                    <th className="text-left p-4 font-semibold">ID</th>
                    <th className="text-left p-4 font-semibold">From</th>
                    <th className="text-left p-4 font-semibold">To</th>
                    <th className="text-left p-4 font-semibold">Arrival</th>
                    <th className="text-left p-4 font-semibold">Departure</th>
                    <th className="text-left p-4 font-semibold">Platform</th>
                    <th className="text-left p-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {schedules.map((schedule, index) => (
                    <tr 
                      key={schedule.id} 
                      className={`border-b border-border hover:bg-muted/30 transition-colors ${
                        index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                      }`}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {schedule.type === 'train' ? (
                            <Train className="h-5 w-5 text-primary" />
                          ) : (
                            <Bus className="h-5 w-5 text-secondary-foreground" />
                          )}
                          <span className="capitalize font-medium">{schedule.type}</span>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-sm font-medium">
                        {schedule.transport_id}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{schedule.origin}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{schedule.destination}</span>
                        </div>
                      </td>
                      <td className="p-4 font-mono">
                        {formatTime(schedule.arrival_time)}
                      </td>
                      <td className="p-4 font-mono">
                        {formatTime(schedule.departure_time)}
                      </td>
                      <td className="p-4">
                        <Badge variant="outline" className="font-medium">
                          Platform {schedule.platform}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge 
                          className={`${getStatusColor(schedule.status)} text-white font-medium`}
                        >
                          {getStatusText(schedule.status)}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center mt-8 text-sm text-muted-foreground">
        <p>Updates in real-time • Central Station Management System</p>
      </div>
    </div>
  );
}