/*
  # Create lottery configuration table

  1. New Tables
    - `lottery_config`
      - `id` (uuid, primary key)
      - `targetNumber` (text)
      - `date` (text)
      - `branch` (text)
      - `prize` (text)
      - `drawDelay` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `lottery_config` table
    - Add policies for authenticated users to read and update configuration
*/

CREATE TABLE IF NOT EXISTS lottery_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  target_number text NOT NULL,
  date text NOT NULL,
  branch text NOT NULL,
  prize text NOT NULL,
  draw_delay integer NOT NULL DEFAULT 2000,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE lottery_config ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow read access to everyone"
  ON lottery_config
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow update for authenticated users"
  ON lottery_config
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow insert for authenticated users"
  ON lottery_config
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Insert initial configuration
INSERT INTO lottery_config (
  target_number,
  date,
  branch,
  prize,
  draw_delay
) VALUES (
  '8944',
  '19/03/2025',
  'VITORIA-PE',
  'R$19.000,00',
  2000
) ON CONFLICT DO NOTHING;