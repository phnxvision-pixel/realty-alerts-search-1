-- Add OAuth profile sync fields to users table
-- Run this SQL in Supabase SQL Editor to add new columns for OAuth profile management

ALTER TABLE users ADD COLUMN IF NOT EXISTS oauth_data_needs_review BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'en';
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_name TEXT;

-- Create index for faster queries on oauth_data_needs_review
CREATE INDEX IF NOT EXISTS idx_users_oauth_needs_review ON users(oauth_data_needs_review) WHERE oauth_data_needs_review = true;

-- Update existing users with provider data to need review
UPDATE users SET oauth_data_needs_review = true WHERE provider IS NOT NULL AND oauth_data_needs_review = false;

COMMENT ON COLUMN users.oauth_data_needs_review IS 'Flag to indicate if user needs to review imported OAuth profile data';
COMMENT ON COLUMN users.language IS 'User preferred language code (e.g., en, de, es)';
COMMENT ON COLUMN users.bio IS 'User biography or about text';
COMMENT ON COLUMN users.first_name IS 'User first name from OAuth or manual entry';
COMMENT ON COLUMN users.last_name IS 'User last name from OAuth or manual entry';
