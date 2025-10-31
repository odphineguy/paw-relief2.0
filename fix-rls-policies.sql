-- Fix RLS policies to allow testing without authentication
-- Run this in Supabase SQL Editor

-- Drop all existing RLS policies
DROP POLICY IF EXISTS "Users can view their own dogs" ON dogs;
DROP POLICY IF EXISTS "Users can insert their own dogs" ON dogs;
DROP POLICY IF EXISTS "Users can update their own dogs" ON dogs;
DROP POLICY IF EXISTS "Users can delete their own dogs" ON dogs;

DROP POLICY IF EXISTS "Users can view symptom logs for their dogs" ON symptom_logs;
DROP POLICY IF EXISTS "Users can insert symptom logs for their dogs" ON symptom_logs;
DROP POLICY IF EXISTS "Users can update symptom logs for their dogs" ON symptom_logs;
DROP POLICY IF EXISTS "Users can delete symptom logs for their dogs" ON symptom_logs;

DROP POLICY IF EXISTS "Users can view reminders for their dogs" ON reminders;
DROP POLICY IF EXISTS "Users can insert reminders for their dogs" ON reminders;
DROP POLICY IF EXISTS "Users can update reminders for their dogs" ON reminders;
DROP POLICY IF EXISTS "Users can delete reminders for their dogs" ON reminders;

DROP POLICY IF EXISTS "Users can view trigger logs for their dogs" ON trigger_logs;
DROP POLICY IF EXISTS "Users can insert trigger logs for their dogs" ON trigger_logs;
DROP POLICY IF EXISTS "Users can update trigger logs for their dogs" ON trigger_logs;
DROP POLICY IF EXISTS "Users can delete trigger logs for their dogs" ON trigger_logs;

DROP POLICY IF EXISTS "Anyone can view products" ON products;
DROP POLICY IF EXISTS "Authenticated users can insert products" ON products;

-- Create permissive policies for testing (TEMPORARY - will fix with auth later)
CREATE POLICY "Allow all operations on dogs for testing"
  ON dogs FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on symptom_logs for testing"
  ON symptom_logs FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on reminders for testing"
  ON reminders FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on trigger_logs for testing"
  ON trigger_logs FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on products for testing"
  ON products FOR ALL
  USING (true)
  WITH CHECK (true);

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'RLS policies updated for testing!';
  RAISE NOTICE 'All tables now allow unrestricted access.';
  RAISE NOTICE 'REMEMBER: Add proper authentication and RLS policies before production!';
END $$;
