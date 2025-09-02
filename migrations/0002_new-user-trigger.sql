-- Custom SQL migration file, put your code below! --

-- Update the trigger function to handle fullname
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$

BEGIN
-- Insert the new user into the USERS table
INSERT INTO public.USERS (id, email)
VALUES (new.id, new.email);

RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create or recreate the trigger
DROP TRIGGER IF EXISTS on_new_user ON auth.users;

CREATE TRIGGER on_new_user
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE PROCEDURE public.handle_new_user();