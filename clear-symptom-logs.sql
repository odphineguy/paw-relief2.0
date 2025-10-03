-- Clear all symptom logs
-- Run this in your Supabase SQL Editor to delete all symptom log data

DELETE FROM symptom_logs;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'All symptom logs have been cleared!';
END $$;
