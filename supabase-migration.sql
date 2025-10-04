-- Paw Relief Database Schema Migration
-- Run this in your Supabase SQL Editor

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: dogs
-- Stores information about user's dogs
CREATE TABLE IF NOT EXISTS dogs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  breed TEXT NOT NULL,
  age INTEGER NOT NULL,
  weight DECIMAL NOT NULL,
  photo_url TEXT,
  known_allergies TEXT[] DEFAULT '{}',
  birthday TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: symptom_logs
-- Tracks allergy symptoms for each dog
CREATE TABLE IF NOT EXISTS symptom_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dog_id UUID REFERENCES dogs(id) ON DELETE CASCADE NOT NULL,
  symptom_type TEXT NOT NULL,
  severity INTEGER CHECK (severity >= 1 AND severity <= 5) NOT NULL,
  triggers TEXT[] DEFAULT '{}',
  notes TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: reminders
-- Medication and care reminders for dogs
CREATE TABLE IF NOT EXISTS reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dog_id UUID REFERENCES dogs(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  dosage TEXT,
  next_due TIMESTAMP WITH TIME ZONE NOT NULL,
  repeat_interval TEXT CHECK (repeat_interval IN ('daily', 'weekly', 'monthly')),
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: products
-- Product information from barcode scanning
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  barcode TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  image_url TEXT,
  ingredients TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: trigger_logs
-- Stores environmental/trigger data for detective feature
CREATE TABLE IF NOT EXISTS trigger_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dog_id UUID REFERENCES dogs(id) ON DELETE CASCADE NOT NULL,
  trigger_type TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  location TEXT,
  weather_conditions TEXT,
  pollen_level TEXT,
  notes TEXT,
  logged_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_dogs_user_id ON dogs(user_id);
CREATE INDEX IF NOT EXISTS idx_symptom_logs_dog_id ON symptom_logs(dog_id);
CREATE INDEX IF NOT EXISTS idx_symptom_logs_created_at ON symptom_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reminders_dog_id ON reminders(dog_id);
CREATE INDEX IF NOT EXISTS idx_reminders_next_due ON reminders(next_due);
CREATE INDEX IF NOT EXISTS idx_trigger_logs_dog_id ON trigger_logs(dog_id);
CREATE INDEX IF NOT EXISTS idx_trigger_logs_logged_date ON trigger_logs(logged_date DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE dogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE symptom_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE trigger_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for dogs table
CREATE POLICY "Users can view their own dogs"
  ON dogs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own dogs"
  ON dogs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own dogs"
  ON dogs FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own dogs"
  ON dogs FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for symptom_logs table
CREATE POLICY "Users can view symptom logs for their dogs"
  ON symptom_logs FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM dogs WHERE dogs.id = symptom_logs.dog_id AND dogs.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert symptom logs for their dogs"
  ON symptom_logs FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM dogs WHERE dogs.id = symptom_logs.dog_id AND dogs.user_id = auth.uid()
  ));

CREATE POLICY "Users can update symptom logs for their dogs"
  ON symptom_logs FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM dogs WHERE dogs.id = symptom_logs.dog_id AND dogs.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete symptom logs for their dogs"
  ON symptom_logs FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM dogs WHERE dogs.id = symptom_logs.dog_id AND dogs.user_id = auth.uid()
  ));

-- RLS Policies for reminders table
CREATE POLICY "Users can view reminders for their dogs"
  ON reminders FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM dogs WHERE dogs.id = reminders.dog_id AND dogs.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert reminders for their dogs"
  ON reminders FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM dogs WHERE dogs.id = reminders.dog_id AND dogs.user_id = auth.uid()
  ));

CREATE POLICY "Users can update reminders for their dogs"
  ON reminders FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM dogs WHERE dogs.id = reminders.dog_id AND dogs.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete reminders for their dogs"
  ON reminders FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM dogs WHERE dogs.id = reminders.dog_id AND dogs.user_id = auth.uid()
  ));

-- RLS Policies for trigger_logs table
CREATE POLICY "Users can view trigger logs for their dogs"
  ON trigger_logs FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM dogs WHERE dogs.id = trigger_logs.dog_id AND dogs.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert trigger logs for their dogs"
  ON trigger_logs FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM dogs WHERE dogs.id = trigger_logs.dog_id AND dogs.user_id = auth.uid()
  ));

CREATE POLICY "Users can update trigger logs for their dogs"
  ON trigger_logs FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM dogs WHERE dogs.id = trigger_logs.dog_id AND dogs.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete trigger logs for their dogs"
  ON trigger_logs FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM dogs WHERE dogs.id = trigger_logs.dog_id AND dogs.user_id = auth.uid()
  ));

-- RLS Policies for products table (public read, authenticated write)
CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert products"
  ON products FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_dogs_updated_at BEFORE UPDATE ON dogs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reminders_updated_at BEFORE UPDATE ON reminders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Database schema created successfully!';
  RAISE NOTICE 'Tables created: dogs, symptom_logs, reminders, products, trigger_logs';
  RAISE NOTICE 'Row Level Security policies have been enabled.';
END $$;
