-- Create custom types for better data integrity
CREATE TYPE transport_type AS ENUM ('bus', 'train');
CREATE TYPE schedule_status AS ENUM ('on_time', 'delayed', 'cancelled');

-- Create the main schedule table
CREATE TABLE public.schedule (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    transport_id TEXT NOT NULL,
    type transport_type NOT NULL,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    arrival_time TIME NOT NULL,
    departure_time TIME NOT NULL,
    platform INTEGER NOT NULL,
    status schedule_status NOT NULL DEFAULT 'on_time',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profiles table for admin role management
CREATE TABLE public.profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for schedule table
-- Public read access (anyone can view schedules)
CREATE POLICY "Anyone can view schedules" 
ON public.schedule 
FOR SELECT 
USING (true);

-- Authenticated users can insert, update, delete
CREATE POLICY "Authenticated users can insert schedules" 
ON public.schedule 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update schedules" 
ON public.schedule 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete schedules" 
ON public.schedule 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- RLS Policies for profiles table
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_schedule_updated_at
    BEFORE UPDATE ON public.schedule
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, role)
    VALUES (NEW.id, 'admin');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Enable realtime for schedule table
ALTER TABLE public.schedule REPLICA IDENTITY FULL;

-- Add schedule table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.schedule;