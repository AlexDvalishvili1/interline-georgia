-- Add display control fields to posts table
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS display_locations text[] DEFAULT ARRAY['offers_page'];
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS sort_order integer;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS pinned boolean DEFAULT false;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS featured boolean DEFAULT false;

-- Add new contact fields to site_settings table
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS phones text[] DEFAULT '{}';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS emails text[] DEFAULT '{}';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS tiktok_url text DEFAULT '';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS youtube_url text DEFAULT '';

-- Migrate existing phone/email to arrays
UPDATE public.site_settings 
SET phones = ARRAY[phone] 
WHERE phone IS NOT NULL AND phone != '' AND (phones IS NULL OR phones = '{}');

UPDATE public.site_settings 
SET emails = ARRAY[email] 
WHERE email IS NOT NULL AND email != '' AND (emails IS NULL OR emails = '{}');

-- Create storage bucket for post images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('post-images', 'post-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies for post images
CREATE POLICY "Anyone can view post images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'post-images');

CREATE POLICY "Admins can upload post images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'post-images' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update post images" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'post-images' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete post images" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'post-images' AND has_role(auth.uid(), 'admin'));