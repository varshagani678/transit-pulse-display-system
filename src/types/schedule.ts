export interface Schedule {
  id: string;
  transport_id: string;
  type: 'bus' | 'train';
  origin: string;
  destination: string;
  arrival_time: string;
  departure_time: string;
  platform: number;
  status: 'on_time' | 'delayed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface ScheduleInput {
  transport_id: string;
  type: 'bus' | 'train';
  origin: string;
  destination: string;
  arrival_time: string;
  departure_time: string;
  platform: number;
  status: 'on_time' | 'delayed' | 'cancelled';
}