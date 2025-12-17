-- =====================================================
-- CHRISTMAS HQ - SUPABASE DATABASE SCHEMA
-- =====================================================
-- Run this SQL in your Supabase SQL Editor (Dashboard -> SQL Editor)

-- Enable UUID extension (usually already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USERS PROFILE TABLE
-- =====================================================
-- Extends Supabase auth.users with additional profile info
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    display_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone" 
    ON public.profiles FOR SELECT 
    USING (true);

CREATE POLICY "Users can insert their own profile" 
    ON public.profiles FOR INSERT 
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id);

-- =====================================================
-- MESSAGES TABLE (Cards & Gifts left on trees)
-- =====================================================
CREATE TABLE public.messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    -- Who the message is for (tree owner)
    recipient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    -- Who sent the message
    sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    -- Message content
    content TEXT NOT NULL,
    -- Type of decoration: 'card' or 'gift'
    decoration_type TEXT NOT NULL DEFAULT 'card' CHECK (decoration_type IN ('card', 'gift')),
    -- Decoration style/color (hex color or style identifier)
    decoration_style TEXT DEFAULT '#c41e3a',
    -- Position data for 3D placement (stored as JSON)
    position_data JSONB,
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- Ensure one message per sender per recipient
    UNIQUE(recipient_id, sender_id)
);

-- Enable RLS on messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Policies for messages
CREATE POLICY "Messages are viewable by everyone" 
    ON public.messages FOR SELECT 
    USING (true);

CREATE POLICY "Authenticated users can create messages for others" 
    ON public.messages FOR INSERT 
    WITH CHECK (
        auth.uid() = sender_id 
        AND auth.uid() != recipient_id
    );

CREATE POLICY "Users can update their own sent messages" 
    ON public.messages FOR UPDATE 
    USING (auth.uid() = sender_id);

CREATE POLICY "Users can delete their own sent messages" 
    ON public.messages FOR DELETE 
    USING (auth.uid() = sender_id);

-- =====================================================
-- FUNCTION: Auto-create profile on signup
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, display_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX idx_messages_recipient ON public.messages(recipient_id);
CREATE INDEX idx_messages_sender ON public.messages(sender_id);
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_display_name ON public.profiles(display_name);

-- =====================================================
-- FUNCTION: Search users by name or email
-- =====================================================
CREATE OR REPLACE FUNCTION public.search_users(search_query TEXT)
RETURNS SETOF public.profiles AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM public.profiles
    WHERE 
        full_name ILIKE '%' || search_query || '%'
        OR display_name ILIKE '%' || search_query || '%'
        OR email ILIKE '%' || search_query || '%'
    ORDER BY full_name
    LIMIT 20;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- VIEW: User tree stats (message count, etc.)
-- =====================================================
CREATE OR REPLACE VIEW public.user_tree_stats AS
SELECT 
    p.id,
    p.full_name,
    p.display_name,
    p.avatar_url,
    COUNT(m.id) as message_count,
    COUNT(CASE WHEN m.decoration_type = 'card' THEN 1 END) as card_count,
    COUNT(CASE WHEN m.decoration_type = 'gift' THEN 1 END) as gift_count
FROM public.profiles p
LEFT JOIN public.messages m ON m.recipient_id = p.id
GROUP BY p.id, p.full_name, p.display_name, p.avatar_url;


