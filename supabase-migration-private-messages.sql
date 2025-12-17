-- =====================================================
-- MIGRATION: Add Private Messages Feature
-- =====================================================
-- Run this SQL in your Supabase SQL Editor to add private messages

-- Add is_private column to messages table
ALTER TABLE public.messages 
ADD COLUMN IF NOT EXISTS is_private BOOLEAN DEFAULT false;

-- Update RLS policy for messages to handle private visibility
-- Drop existing select policy
DROP POLICY IF EXISTS "Messages are viewable by everyone" ON public.messages;

-- Create new policy that respects privacy
-- Public messages: everyone can see
-- Private messages: only recipient and sender can see
CREATE POLICY "Messages visibility based on privacy" 
    ON public.messages FOR SELECT 
    USING (
        is_private = false 
        OR auth.uid() = recipient_id 
        OR auth.uid() = sender_id
    );

-- Add index for faster private message queries
CREATE INDEX IF NOT EXISTS idx_messages_is_private ON public.messages(is_private);

