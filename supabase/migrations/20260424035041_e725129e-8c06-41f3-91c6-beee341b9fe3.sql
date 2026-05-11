-- Ensure samincroseo@gmail.com gets admin role when they sign up
-- Create a trigger function that auto-assigns admin role to this specific email

CREATE OR REPLACE FUNCTION public.handle_admin_user_signup()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Auto-assign admin role to specific email
  IF NEW.email = 'samincroseo@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
    
    INSERT INTO public.admin_users (user_id, email)
    VALUES (NEW.id, NEW.email)
    ON CONFLICT DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created_admin_check ON auth.users;
CREATE TRIGGER on_auth_user_created_admin_check
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_admin_user_signup();

-- If the user already exists, assign the admin role now
DO $$
DECLARE
  existing_user_id uuid;
BEGIN
  SELECT id INTO existing_user_id FROM auth.users WHERE email = 'samincroseo@gmail.com' LIMIT 1;
  
  IF existing_user_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (existing_user_id, 'admin'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
    
    INSERT INTO public.admin_users (user_id, email)
    VALUES (existing_user_id, 'samincroseo@gmail.com')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;