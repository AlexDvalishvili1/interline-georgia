-- Drop existing policy
DROP POLICY IF EXISTS "Admins can read all profiles" ON public.profiles;

-- Create a restrictive admin-only SELECT policy that explicitly requires authentication
CREATE POLICY "Only admins can read profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Ensure no INSERT/UPDATE/DELETE policies exist (block all writes)
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON public.profiles;