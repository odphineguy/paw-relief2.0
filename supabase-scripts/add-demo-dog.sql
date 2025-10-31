DO $$
DECLARE
  demo_user_id uuid;
BEGIN
  SELECT id INTO demo_user_id
  FROM auth.users
  WHERE email = 'demo@pawrelief.app';

  DELETE FROM dogs WHERE user_id = demo_user_id;

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

  RAISE NOTICE 'Demo dog created for user %', demo_user_id;
END $$;

SELECT d.id, d.name, d.breed, d.age, u.email as owner_email
FROM dogs d
JOIN auth.users u ON d.user_id = u.id
WHERE u.email = 'demo@pawrelief.app';
