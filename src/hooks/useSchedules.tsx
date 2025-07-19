import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Schedule, ScheduleInput } from '@/types/schedule';
import { useToast } from '@/hooks/use-toast';

export function useSchedules() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch schedules
  const fetchSchedules = async () => {
    try {
      const { data, error } = await supabase
        .from('schedule')
        .select('*')
        .order('departure_time', { ascending: true });

      if (error) throw error;
      setSchedules(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch schedules",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Add schedule
  const addSchedule = async (scheduleData: ScheduleInput) => {
    try {
      const { data, error } = await supabase
        .from('schedule')
        .insert([scheduleData])
        .select()
        .single();

      if (error) throw error;

      setSchedules(prev => [...prev, data]);
      toast({
        title: "Success",
        description: "Schedule added successfully",
      });
      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add schedule",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  // Update schedule
  const updateSchedule = async (id: string, scheduleData: Partial<ScheduleInput>) => {
    try {
      const { data, error } = await supabase
        .from('schedule')
        .update(scheduleData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setSchedules(prev => prev.map(s => s.id === id ? data : s));
      toast({
        title: "Success",
        description: "Schedule updated successfully",
      });
      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update schedule",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  // Delete schedule
  const deleteSchedule = async (id: string) => {
    try {
      const { error } = await supabase
        .from('schedule')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSchedules(prev => prev.filter(s => s.id !== id));
      toast({
        title: "Success",
        description: "Schedule deleted successfully",
      });
      return { error: null };
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete schedule",
        variant: "destructive",
      });
      return { error };
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    fetchSchedules();

    const channel = supabase
      .channel('schedule-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'schedule'
        },
        (payload) => {
          console.log('Real-time update:', payload);
          
          if (payload.eventType === 'INSERT') {
            setSchedules(prev => [...prev, payload.new as Schedule]);
          } else if (payload.eventType === 'UPDATE') {
            setSchedules(prev => prev.map(s => 
              s.id === payload.new.id ? payload.new as Schedule : s
            ));
          } else if (payload.eventType === 'DELETE') {
            setSchedules(prev => prev.filter(s => s.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    schedules,
    loading,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    refetch: fetchSchedules,
  };
}