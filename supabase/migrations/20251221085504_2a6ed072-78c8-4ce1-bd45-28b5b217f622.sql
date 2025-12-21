-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'editor');

-- Create user_roles table for role-based access control
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create profiles table for additional user info
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
          AND role = _role
    )
$$;

-- Create posts table with multilingual support
CREATE TABLE public.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL CHECK (category IN ('offer', 'promotion', 'news')),
    is_published BOOLEAN NOT NULL DEFAULT false,
    cover_image_url TEXT,
    gallery JSONB DEFAULT '[]'::jsonb,
    -- Multilingual title
    title_ka TEXT NOT NULL DEFAULT '',
    title_ru TEXT NOT NULL DEFAULT '',
    title_en TEXT NOT NULL DEFAULT '',
    -- Multilingual excerpt
    excerpt_ka TEXT NOT NULL DEFAULT '',
    excerpt_ru TEXT NOT NULL DEFAULT '',
    excerpt_en TEXT NOT NULL DEFAULT '',
    -- Multilingual content
    content_ka TEXT NOT NULL DEFAULT '',
    content_ru TEXT NOT NULL DEFAULT '',
    content_en TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS on posts
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Create site_settings table for company info
CREATE TABLE public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- Multilingual company name
    company_name_ka TEXT NOT NULL DEFAULT 'Interline',
    company_name_ru TEXT NOT NULL DEFAULT 'Interline',
    company_name_en TEXT NOT NULL DEFAULT 'Interline',
    -- Contact info
    phone TEXT DEFAULT '',
    whatsapp TEXT DEFAULT '',
    email TEXT DEFAULT '',
    -- Multilingual address
    address_ka TEXT DEFAULT '',
    address_ru TEXT DEFAULT '',
    address_en TEXT DEFAULT '',
    -- Multilingual working hours
    working_hours_ka TEXT DEFAULT '',
    working_hours_ru TEXT DEFAULT '',
    working_hours_en TEXT DEFAULT '',
    -- Social links
    facebook_url TEXT DEFAULT '',
    instagram_url TEXT DEFAULT '',
    map_embed_url TEXT DEFAULT '',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on site_settings
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Function to handle profile creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data ->> 'full_name');
    RETURN NEW;
END;
$$;

-- Trigger for auto-creating profile on user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_posts_updated_at
    BEFORE UPDATE ON public.posts
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at
    BEFORE UPDATE ON public.site_settings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies for posts
-- Public: Anyone can read published posts
CREATE POLICY "Anyone can read published posts" ON public.posts
    FOR SELECT USING (is_published = true);

-- Admins/Editors can read all posts
CREATE POLICY "Admins can read all posts" ON public.posts
    FOR SELECT TO authenticated
    USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- Admins/Editors can create posts
CREATE POLICY "Admins can create posts" ON public.posts
    FOR INSERT TO authenticated
    WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- Admins/Editors can update posts
CREATE POLICY "Admins can update posts" ON public.posts
    FOR UPDATE TO authenticated
    USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- Admins can delete posts
CREATE POLICY "Admins can delete posts" ON public.posts
    FOR DELETE TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for site_settings
-- Public: Anyone can read settings
CREATE POLICY "Anyone can read site settings" ON public.site_settings
    FOR SELECT USING (true);

-- Admins can update settings
CREATE POLICY "Admins can update site settings" ON public.site_settings
    FOR UPDATE TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

-- Admins can insert settings (for initial setup)
CREATE POLICY "Admins can insert site settings" ON public.site_settings
    FOR INSERT TO authenticated
    WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for profiles
-- Users can read their own profile
CREATE POLICY "Users can read own profile" ON public.profiles
    FOR SELECT TO authenticated
    USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE TO authenticated
    USING (auth.uid() = id);

-- Admins can read all profiles
CREATE POLICY "Admins can read all profiles" ON public.profiles
    FOR SELECT TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for user_roles
-- Admins can read all roles
CREATE POLICY "Admins can read all roles" ON public.user_roles
    FOR SELECT TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

-- Admins can manage roles
CREATE POLICY "Admins can insert roles" ON public.user_roles
    FOR INSERT TO authenticated
    WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles" ON public.user_roles
    FOR DELETE TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

-- Users can read their own roles
CREATE POLICY "Users can read own roles" ON public.user_roles
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id);

-- Insert default site settings
INSERT INTO public.site_settings (
    company_name_ka, company_name_ru, company_name_en,
    phone, whatsapp, email,
    address_ka, address_ru, address_en,
    working_hours_ka, working_hours_ru, working_hours_en,
    facebook_url, instagram_url, map_embed_url
) VALUES (
    'ინტერლაინი', 'Интерлайн', 'Interline',
    '+995 32 200 00 00', '+995 32 200 00 00', 'info@interline.ge',
    'თბილისი, საქართველო', 'Тбилиси, Грузия', 'Tbilisi, Georgia',
    'ორშ - პარ: 10:00 - 19:00', 'Пн - Пт: 10:00 - 19:00', 'Mon - Fri: 10:00 - 19:00',
    'https://facebook.com/interlinegeo', 'https://instagram.com/interlinegeo',
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d95257.67069407399!2d44.71691775!3d41.7151377!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40440cd7e64f626b%3A0x61d084ede2576ea3!2sTbilisi%2C%20Georgia!5e0!3m2!1sen!2sus!4v1234567890'
);