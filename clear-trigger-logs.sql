-- Clear all trigger logs
-- Run this in your Supabase SQL Editor to delete all trigger log data

DELETE FROM trigger_logs;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'All trigger logs have been cleared!';
END $$;
