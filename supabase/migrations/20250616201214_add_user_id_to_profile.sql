-- Add user_id column to profile table to link with Clerk users
ALTER TABLE profile 
ADD COLUMN user_id TEXT;

-- Add unique constraint on user_id since each user should have only one profile
ALTER TABLE profile 
ADD CONSTRAINT unique_user_id UNIQUE (user_id);

-- Add index on user_id for better query performance
CREATE INDEX idx_profile_user_id ON profile(user_id);

-- Add comment to document the column
COMMENT ON COLUMN profile.user_id IS 'Clerk user ID to link profile with authenticated user';
