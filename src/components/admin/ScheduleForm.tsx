import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Schedule, ScheduleInput } from '@/types/schedule';
import { X } from 'lucide-react';

interface ScheduleFormProps {
  schedule?: Schedule;
  onSubmit: (data: ScheduleInput) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function ScheduleForm({ schedule, onSubmit, onCancel, loading }: ScheduleFormProps) {
  const [formData, setFormData] = useState<ScheduleInput>({
    transport_id: '',
    type: 'bus',
    origin: '',
    destination: '',
    arrival_time: '',
    departure_time: '',
    platform: 1,
    status: 'on_time',
  });

  useEffect(() => {
    if (schedule) {
      setFormData({
        transport_id: schedule.transport_id,
        type: schedule.type,
        origin: schedule.origin,
        destination: schedule.destination,
        arrival_time: schedule.arrival_time,
        departure_time: schedule.departure_time,
        platform: schedule.platform,
        status: schedule.status,
      });
    }
  }, [schedule]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleChange = (field: keyof ScheduleInput, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            {schedule ? 'Edit Schedule' : 'Add New Schedule'}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="transport_id">Transport ID</Label>
              <Input
                id="transport_id"
                value={formData.transport_id}
                onChange={(e) => handleChange('transport_id', e.target.value)}
                placeholder="e.g., TR001, BUS205"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={formData.type} onValueChange={(value: 'bus' | 'train') => handleChange('type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bus">Bus</SelectItem>
                  <SelectItem value="train">Train</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="origin">Origin</Label>
              <Input
                id="origin"
                value={formData.origin}
                onChange={(e) => handleChange('origin', e.target.value)}
                placeholder="Starting station"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <Input
                id="destination"
                value={formData.destination}
                onChange={(e) => handleChange('destination', e.target.value)}
                placeholder="End station"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="arrival_time">Arrival Time</Label>
              <Input
                id="arrival_time"
                type="time"
                value={formData.arrival_time}
                onChange={(e) => handleChange('arrival_time', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="departure_time">Departure Time</Label>
              <Input
                id="departure_time"
                type="time"
                value={formData.departure_time}
                onChange={(e) => handleChange('departure_time', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Input
                id="platform"
                type="number"
                min="1"
                max="50"
                value={formData.platform}
                onChange={(e) => handleChange('platform', parseInt(e.target.value))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value: 'on_time' | 'delayed' | 'cancelled') => handleChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="on_time">On Time</SelectItem>
                  <SelectItem value="delayed">Delayed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Saving...' : (schedule ? 'Update Schedule' : 'Add Schedule')}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}