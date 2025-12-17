-- =====================================================
-- MIGRATION V2: Tree Customization & Ornament Type
-- =====================================================
-- Run this SQL in your Supabase SQL Editor

-- 1. Add tree customization columns to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS tree_color TEXT DEFAULT '#0d5c0d',
ADD COLUMN IF NOT EXISTS star_color TEXT DEFAULT '#ffd700';

-- 2. Update messages decoration_type to include 'ornament'
-- First drop the existing constraint
ALTER TABLE public.messages 
DROP CONSTRAINT IF EXISTS messages_decoration_type_check;

-- Add new constraint with 'ornament' option
ALTER TABLE public.messages 
ADD CONSTRAINT messages_decoration_type_check 
CHECK (decoration_type IN ('card', 'gift', 'ornament'));

-- 3. Add position index for better placement
ALTER TABLE public.messages
ADD COLUMN IF NOT EXISTS position_index INTEGER;

-- 4. Create function to get next position index for a recipient
CREATE OR REPLACE FUNCTION public.get_next_position_index(recipient UUID)
RETURNS INTEGER AS $$
DECLARE
    next_index INTEGER;
BEGIN
    SELECT COALESCE(MAX(position_index), -1) + 1 
    INTO next_index
    FROM public.messages 
    WHERE recipient_id = recipient;
    RETURN next_index;
END;
$$ LANGUAGE plpgsql;

-- 5. Create trigger to auto-assign position index
CREATE OR REPLACE FUNCTION public.assign_position_index()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.position_index IS NULL THEN
        NEW.position_index := public.get_next_position_index(NEW.recipient_id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_position_index ON public.messages;
CREATE TRIGGER set_position_index
    BEFORE INSERT ON public.messages
    FOR EACH ROW
    EXECUTE FUNCTION public.assign_position_index();

-- 6. Update RLS policy for profiles to allow tree customization updates
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id);

-- Also ensure users can read their own profile for the select after update
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" 
    ON public.profiles FOR SELECT 
    USING (true);

-- 7. Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_messages_position ON public.messages(recipient_id, position_index);
CREATE INDEX IF NOT EXISTS idx_profiles_tree_color ON public.profiles(tree_color);
