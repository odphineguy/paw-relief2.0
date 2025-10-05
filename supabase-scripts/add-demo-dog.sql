/* Add a sample dog for the demo user
   This gives the demo account a pet to work with */

/* Get the demo user's ID */
DO $$
DECLARE
  demo_user_id uuid;
BEGIN
  /* Find the demo user */
  SELECT id INTO demo_user_id
  FROM auth.users
  WHERE email = 'demo@pawrelief.app';

  /* Delete any existing demo dogs */
  DELETE FROM dogs WHERE user_id = demo_user_id;

  /* Insert a sample dog */
  INSERT INTO dogs (
    user_id,
    name,
    breed,
    age,
    weight,
    photo_url,
    known_allergies,
    birthday
  ) VALUES (
    demo_user_id,
    'Buddy',
    'Golden Retriever',
    3,
    65,
    'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=400',
    ARRAY['Chicken', 'Pollen', 'Dust'],
    '2021-06-15'
  );

  /* Confirm the dog was created */
  RAISE NOTICE 'Demo dog created for user %', demo_user_id;
END $$;

/* Show the created dog */
SELECT d.id, d.name, d.breed, d.age, u.email as owner_email
FROM dogs d
JOIN auth.users u ON d.user_id = u.id
WHERE u.email = 'demo@pawrelief.app';
