------------------------------------------------------
-- Add user to public.users table on auth trigger
------------------------------------------------------
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


------------------------------------------------------
-- Remove user from public.users table on auth trigger
------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_delete_user()
RETURNS trigger AS $$

BEGIN
    DELETE FROM public.users WHERE id = OLD.id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create or recreate the trigger
DROP TRIGGER IF EXISTS on_delete_user ON auth.users;

CREATE TRIGGER on_delete_user
AFTER DELETE ON auth.users
FOR EACH ROW
EXECUTE PROCEDURE public.handle_delete_user();
