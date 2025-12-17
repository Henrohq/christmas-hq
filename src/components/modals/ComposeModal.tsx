import { useState, useRef } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useStore } from '@/store/useStore'
import type { Message, DecorationType } from '@/types/database'

// Timeout wrapper for mobile network issues
function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout - please check your connection and try again')), timeoutMs)
    ),
  ])
}

interface ComposeModalProps {
  recipientId: string
}

const DECORATION_COLORS = [
  '#c41e3a', '#228b22', '#1e90ff', '#9932cc', 
  '#daa520', '#ff69b4', '#20b2aa', '#ff8c00',
]

function getRandomDecorationType(): DecorationType {
  const types: DecorationType[] = ['card', 'gift', 'ornament']
  return types[Math.floor(Math.random() * types.length)]
}

export function ComposeModal({ recipientId }: ComposeModalProps) {
  const { user, closeComposeModal, addMessage, allUsers, setMessagesCompleted } = useStore()
  const [content, setContent] = useState('')
  const [decorationStyle, setDecorationStyle] = useState('#c41e3a')
  const [isPrivate, setIsPrivate] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const isSubmittingRef = useRef(false)

  const recipient = allUsers.find((u) => u.id === recipientId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !content.trim() || isSubmittingRef.current) {
      console.log('[ComposeModal] Submit blocked', { 
        hasUser: !!user, 
        hasContent: !!content.trim(), 
        isSubmitting: isSubmittingRef.current 
      })
      return
    }

    // Prevent double submission
    isSubmittingRef.current = true
    
    console.log('[ComposeModal] Starting message send...', { 
      recipientId, 
      userId: user.id,
      isMobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    })
    
    setLoading(true)
    setError('')

    const decorationType = getRandomDecorationType()

    const newMessage: Message = {
      id: crypto.randomUUID(),
      recipient_id: recipientId,
      sender_id: user.id,
      content: content.trim(),
      decoration_type: decorationType,
      decoration_style: decorationStyle,
      position_data: null,
      position_index: null,
      is_private: isPrivate,
      created_at: new Date().toISOString(),
    }

    // Safety timeout to always reset loading state after 15 seconds
    const safetyTimeout = setTimeout(() => {
      console.error('[ComposeModal] Safety timeout triggered after 15s')
      if (isSubmittingRef.current) {
        setLoading(false)
        isSubmittingRef.current = false
        setError('Request took too long. Your message may have been sent - please refresh the page.')
      }
    }, 15000)

    try {
      if (!isSupabaseConfigured()) {
        // Demo mode
        console.log('[ComposeModal] Demo mode - adding message locally')
        addMessage(newMessage)
        clearTimeout(safetyTimeout)
        setLoading(false)
        isSubmittingRef.current = false
        closeComposeModal()
        return
      }

      console.log('[ComposeModal] Supabase configured, inserting message with 10s timeout...')
      
      // Wrap the insert with timeout (10 seconds for mobile networks)
      const insertQuery = supabase
        .from('messages')
        .insert({
          recipient_id: recipientId,
          sender_id: user.id,
          content: content.trim(),
          decoration_type: decorationType,
          decoration_style: decorationStyle,
          is_private: isPrivate,
        } as any)
        .select()
        .single()

      const { data: insertedMessage, error: insertError } = await withTimeout(insertQuery as unknown as Promise<{ data: Message | null; error: any }>, 10000)

      console.log('[ComposeModal] Insert result:', { data: insertedMessage, error: insertError })

      if (insertError) {
        console.error('[ComposeModal] Insert error:', insertError)
        throw insertError
      }

      if (insertedMessage) {
        console.log('[ComposeModal] Message inserted successfully, adding to store')
        addMessage(insertedMessage)
      } else {
        console.log('[ComposeModal] No inserted message returned, using local message')
        addMessage(newMessage)
      }
      
      // Refresh missions progress after sending message (with timeout, don't block if it fails)
      try {
        console.log('[ComposeModal] Updating missions progress...')
        const missionQuery = supabase
          .from('messages')
          .select('recipient_id')
          .eq('sender_id', user.id)
        
        const { data } = await withTimeout(missionQuery as unknown as Promise<{ data: Array<{ recipient_id: string }> | null; error: any }>, 5000)
        
        if (data) {
          const uniqueRecipients = new Set(data.map((m: any) => m.recipient_id))
          console.log('[ComposeModal] Missions updated:', uniqueRecipients.size)
          setMessagesCompleted(uniqueRecipients.size)
        }
      } catch (missionErr) {
        console.error('[ComposeModal] Error updating missions (non-blocking):', missionErr)
        // Don't block message sending if missions update fails
      }
      
      console.log('[ComposeModal] Message sent successfully, closing modal')
      clearTimeout(safetyTimeout)
      setLoading(false)
      isSubmittingRef.current = false
      closeComposeModal()
    } catch (err) {
      console.error('[ComposeModal] Error in handleSubmit:', err)
      clearTimeout(safetyTimeout)
      
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message. Please try again.'
      console.error('[ComposeModal] Error message:', errorMessage)
      
      setError(errorMessage)
      setLoading(false)
      isSubmittingRef.current = false
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={closeComposeModal}
      />

      <div className="relative w-full max-w-md glass rounded-2xl p-5 z-10">
        <button
          onClick={closeComposeModal}
          className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors text-sm"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold text-yellow-400 mb-1">
          🎁 Leave a Message
        </h2>
        <p className="text-white/60 text-sm mb-4">
          For {recipient?.display_name || recipient?.full_name || 'this person'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Color Selection - Compact */}
          <div className="flex items-center gap-3">
            <span className="text-white/70 text-sm">Color:</span>
            <div className="flex gap-1.5 flex-wrap">
              {DECORATION_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setDecorationStyle(color)}
                  className={`w-7 h-7 rounded-full transition-all ${
                    decorationStyle === color
                      ? 'ring-2 ring-white scale-110'
                      : 'hover:scale-105 opacity-70 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Message Content */}
          <div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-yellow-400 transition-colors resize-none text-sm"
              placeholder="Write your holiday wishes..."
              rows={4}
              required
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-1">
              <span className="text-white/40 text-xs">🎲 Random decoration type</span>
              <span className="text-white/40 text-xs">{content.length}/500</span>
            </div>
          </div>

          {/* Private Toggle - Compact inline */}
          <label className="flex items-center gap-2 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-white/20 rounded-full peer-checked:bg-yellow-500 transition-colors" />
              <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4" />
            </div>
            <span className="text-white/70 text-sm">🔒 Private (only they can see)</span>
          </label>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30">
              <p className="text-red-400 text-sm font-medium">{error}</p>
              {error.includes('timeout') && (
                <button
                  type="button"
                  onClick={() => {
                    setLoading(false)
                    isSubmittingRef.current = false
                    closeComposeModal()
                  }}
                  className="mt-2 text-yellow-400 text-xs underline"
                >
                  Close and check if message was sent
                </button>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="w-full py-2.5 rounded-lg bg-yellow-400 text-black font-medium hover:bg-yellow-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Sending...
              </>
            ) : (
              <>🎄 Send Holiday Wishes</>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
