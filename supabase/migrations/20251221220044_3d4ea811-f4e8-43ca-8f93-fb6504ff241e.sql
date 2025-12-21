-- Add logo_url and site_content columns to site_settings
ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS logo_url text DEFAULT '';

ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS site_content jsonb DEFAULT '{}'::jsonb;