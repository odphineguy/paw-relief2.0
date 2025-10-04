-- Seed data for Paw Relief
-- Run this in Supabase SQL Editor to add test data

-- Temporarily disable the foreign key constraint for testing
ALTER TABLE dogs DROP CONSTRAINT IF EXISTS dogs_user_id_fkey;

-- Add the constraint back but make it NOT enforce for now (we'll fix this when we add auth)
-- We need to allow any UUID for testing purposes

-- Insert test dogs (using a valid UUID)
INSERT INTO dogs (user_id, name, breed, age, weight, photo_url, known_allergies, birthday)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Rocko', 'Golden Retriever', 5, 75, '/assets/Rocko.png', ARRAY['Chicken', 'Pollen', 'Corn'], '2019-05-15T00:00:00.000Z'),
  ('00000000-0000-0000-0000-000000000001', 'Lucy', 'Beagle', 3, 25, '/assets/Lucy.png', ARRAY['Beef', 'Dust Mites', 'Wheat'], '2021-08-20T00:00:00.000Z'),
  ('00000000-0000-0000-0000-000000000001', 'Kitty', 'Mixed Breed', 2, 30, '/assets/Kitty.png', ARRAY['Fish', 'Dust'], '2022-03-10T00:00:00.000Z')
ON CONFLICT DO NOTHING;

-- Get the dog IDs we just inserted
DO $$
DECLARE
  rocko_id UUID;
  lucy_id UUID;
BEGIN
  -- Get Rocko's ID
  SELECT id INTO rocko_id FROM dogs WHERE name = 'Rocko' AND user_id = '00000000-0000-0000-0000-000000000001' LIMIT 1;

  -- Get Lucy's ID
  SELECT id INTO lucy_id FROM dogs WHERE name = 'Lucy' AND user_id = '00000000-0000-0000-0000-000000000001' LIMIT 1;

  -- Insert symptom logs for Rocko
  IF rocko_id IS NOT NULL THEN
    INSERT INTO symptom_logs (dog_id, symptom_type, severity, triggers, notes, created_at)
    VALUES
      (rocko_id, 'Excessive Scratching', 4, ARRAY['Pollen'], 'Very itchy after our walk in the park.', NOW() - INTERVAL '1 day'),
      (rocko_id, 'Paw Licking', 3, ARRAY['Walk Location'], 'Licking paws a lot tonight.', NOW() - INTERVAL '2 days')
    ON CONFLICT DO NOTHING;

    -- Insert reminders for Rocko
    INSERT INTO reminders (dog_id, type, name, dosage, next_due, repeat_interval, completed)
    VALUES
      (rocko_id, 'Medication', 'Apoquel', '1 tablet', NOW() + INTERVAL '2 hours', 'daily', false),
      (rocko_id, 'Paw Wipes', 'Wipe paws after walk', NULL, NOW() + INTERVAL '4 hours', 'daily', false)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Insert symptom log for Lucy
  IF lucy_id IS NOT NULL THEN
    INSERT INTO symptom_logs (dog_id, symptom_type, severity, triggers, notes, created_at)
    VALUES
      (lucy_id, 'Digestive Issues', 5, ARRAY['Food'], 'Ate something with beef, had a bad reaction.', NOW() - INTERVAL '3 days')
    ON CONFLICT DO NOTHING;

    -- Insert reminder for Lucy
    INSERT INTO reminders (dog_id, type, name, dosage, next_due, repeat_interval, completed)
    VALUES
      (lucy_id, 'Vet Visit', 'Annual Checkup', NULL, NOW() + INTERVAL '5 days', NULL, false)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Insert sample products
INSERT INTO products (barcode, name, image_url, ingredients)
VALUES
  ('123456789', 'Healthy Paws Chicken & Rice Formula', 'https://picsum.photos/seed/dogfood1/200/200',
   ARRAY['Deboned Chicken', 'Brown Rice', 'Peas', 'Carrots', 'Chicken Meal', 'Corn Gluten Meal', 'Salt']),
  ('987654321', 'Grain-Free Beef & Sweet Potato Bites', 'https://picsum.photos/seed/dogfood2/200/200',
   ARRAY['Beef', 'Sweet Potato', 'Lentils', 'Flaxseed', 'Dried Kelp', 'Wheat Flour', 'Rosemary Extract'])
ON CONFLICT (barcode) DO NOTHING;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Test data inserted successfully!';
  RAISE NOTICE 'You should now see 3 dogs with symptoms and reminders in your app.';
  RAISE NOTICE 'Note: Foreign key constraint on user_id has been removed for testing.';
  RAISE NOTICE 'This will be re-added when authentication is implemented.';
END $$;
