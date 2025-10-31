/* Create demo user directly in Supabase auth
   Email: demo@pawrelief.app
   Password: password
   This bypasses email confirmation */

/* First, delete the user if it already exists (to avoid conflicts) */
DELETE FROM auth.users WHERE email = 'demo@pawrelief.app';

/* Insert the demo user with confirmed email
   The password is hashed using Supabase's crypt function */
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'demo@pawrelief.app',
  crypt('password', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

/* Confirm the user was created */
SELECT id, email, email_confirmed_at, created_at
FROM auth.users
WHERE email = 'demo@pawrelief.app';
