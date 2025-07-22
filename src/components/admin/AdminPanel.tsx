import { useState } from 'react';
import { useSchedules } from '@/hooks/useSchedules';
import { useAuth } from '@/hooks/useAuth';
import { Schedule } from '@/types/schedule';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import ScheduleForm from './ScheduleForm';
import { Plus, Edit, Trash2, LogOut, Train, Bus, Eye, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminPanel() {
  const { schedules, loading, addSchedule, updateSchedule, deleteSchedule } = useSchedules();
  const { signOut, user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setFormLoading(true);
    try {
      if (editingSchedule) {
        await updateSchedule(editingSchedule.id, data);
      } else {
        await addSchedule(data);
      }
      setShowForm(false);
      setEditingSchedule(null);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    await deleteSchedule(id);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSchedule(null);
  };

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

  const formatTime = (timeString: string) => {
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  if (showForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/10 p-4">
        <ScheduleForm
          schedule={editingSchedule}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={formLoading}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/10 p-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-2">Admin Panel</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.email}
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link to="/">
                <Eye className="mr-2 h-4 w-4" />
                View Display
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/user">
                <User className="mr-2 h-4 w-4" />
                User Panel
              </Link>
            </Button>
            <Button variant="outline" onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Schedules</p>
                <p className="text-2xl font-bold">{schedules.length}</p>
              </div>
              <Train className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">On Time</p>
                <p className="text-2xl font-bold text-green-600">
                  {schedules.filter(s => s.status === 'on_time').length}
                </p>
              </div>
              <div className="h-8 w-8 bg-green-500 rounded-full"></div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Delayed</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {schedules.filter(s => s.status === 'delayed').length}
                </p>
              </div>
              <div className="h-8 w-8 bg-yellow-500 rounded-full"></div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cancelled</p>
                <p className="text-2xl font-bold text-red-600">
                  {schedules.filter(s => s.status === 'cancelled').length}
                </p>
              </div>
              <div className="h-8 w-8 bg-red-500 rounded-full"></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Schedule Management</CardTitle>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Schedule
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <Train className="h-12 w-12 animate-bounce mx-auto mb-4 text-primary" />
              <p className="text-lg">Loading schedules...</p>
            </div>
          ) : schedules.length === 0 ? (
            <div className="text-center py-12">
              <Train className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-xl text-muted-foreground mb-4">No schedules found</p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Schedule
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left p-4 font-semibold">Type</th>
                    <th className="text-left p-4 font-semibold">ID</th>
                    <th className="text-left p-4 font-semibold">Route</th>
                    <th className="text-left p-4 font-semibold">Times</th>
                    <th className="text-left p-4 font-semibold">Platform</th>
                    <th className="text-left p-4 font-semibold">Status</th>
                    <th className="text-left p-4 font-semibold">Actions</th>
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
                        <div className="text-sm">
                          <div className="font-medium">{schedule.origin}</div>
                          <div className="text-muted-foreground">→ {schedule.destination}</div>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-sm">
                        <div>Arr: {formatTime(schedule.arrival_time)}</div>
                        <div>Dep: {formatTime(schedule.departure_time)}</div>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline">
                          Platform {schedule.platform}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge className={`${getStatusColor(schedule.status)} text-white`}>
                          {schedule.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(schedule)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="icon">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Schedule</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete schedule {schedule.transport_id}? 
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(schedule.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}