-- Create a user account for CMS login
-- Insert user into auth.users table with the specified credentials
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'info@futurehomesturkey.com',
  crypt('Alifuture12!', gen_salt('bf')),
  now(),
  now(),
  now(),
  '',
  '',
  '',
  ''
);