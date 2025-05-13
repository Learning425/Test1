/*
  # Create authentication tables

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key)
      - `username` (text, unique)
      - `theme_preference` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `email_verified` (boolean)
      - `activation_token` (text)

  2. Security
    - Enable RLS on `user_profiles` table
    - Add policies for authenticated users to read and update their own profiles
*/

-- Create user profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  theme_preference text DEFAULT 'light',
  email_verified boolean DEFAULT false,
  activation_token text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);