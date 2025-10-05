-- Remove photo URLs from symptom logs with notes "Test"
-- This clears the random railroad and sky images

UPDATE symptom_logs
SET photo_url = NULL
WHERE notes = 'Test'
  AND photo_url IS NOT NULL;
