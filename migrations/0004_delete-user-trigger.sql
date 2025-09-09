-- Custom SQL migration file, put your code below! --

-- Update the trigger function to handle fullname
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