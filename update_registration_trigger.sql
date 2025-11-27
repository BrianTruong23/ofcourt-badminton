-- ============================================
-- UPDATE TRIGGER FOR USER REGISTRATION
-- ============================================

-- 1. Update service_users table to include name column if not exists
ALTER TABLE service_users ADD COLUMN IF NOT EXISTS name text;

-- 2. Update the trigger function to capture name from metadata
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into service_users with client role, store_id from metadata, and NAME from metadata
  INSERT INTO service_users (user_id, email, store_id, role, name)
  VALUES (
    NEW.id,
    NEW.email,
    (NEW.raw_user_meta_data->>'store_id')::uuid, -- Extract store_id from metadata
    'client',
    NEW.raw_user_meta_data->>'full_name' -- Extract name from metadata
  );
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    -- If user already exists in service_users, ignore
    RETURN NEW;
  WHEN OTHERS THEN
    RAISE WARNING 'Failed to create service_user for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Re-create the trigger (if needed, though replacing function is usually enough)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
