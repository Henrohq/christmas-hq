import { useState, useEffect } from 'react'
import { useStore } from '@/store/useStore'
import { UserAvatar } from '@/components/ui/UserAvatar'

export function MessageModal() {
  const { selectedMessage, closeMessageModal, allUsers } = useStore()
  const [isUnfolding, setIsUnfolding] = useState(false)
  const [showContent, setShowContent] = useState(false)

  const sender = allUsers.find((u) => u.id === selectedMessage?.sender_id)

  // Reset state when modal opens
  useEffect(() => {
    setIsUnfolding(false)
    setShowContent(false)
    // Auto-start unfolding after a brief delay
    const timer = setTimeout(() => setIsUnfolding(true), 300)
    return () => clearTimeout(timer)
  }, [selectedMessage])

  // Show content after unfolding animation
  useEffect(() => {
    if (isUnfolding) {
      const timer = setTimeout(() => setShowContent(true), 600)
      return () => clearTimeout(timer)
    }
  }, [isUnfolding])

  if (!selectedMessage) return null

  const decorationColor = selectedMessage.decoration_style || '#c41e3a'
  const decorationIcon = {
    card: '✉️',
    gift: '🎁',
    ornament: '🎄',
  }[selectedMessage.decoration_type] || '✉️'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={closeMessageModal}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-lg z-10">
        {/* Close Button */}
        <button
          onClick={closeMessageModal}
          className="absolute -top-14 right-0 w-12 h-12 rounded-full glass flex items-center justify-center text-white text-xl hover:bg-white/20 transition-colors"
        >
          ✕
        </button>

        {/* Private Message Badge */}
        {selectedMessage.is_private && (
          <div className="absolute -top-14 left-0 flex items-center gap-2 px-4 py-2 rounded-full glass text-white/90 text-sm">
            <span>🔒</span>
            <span>Private Message</span>
          </div>
        )}

        {/* Unfolding Letter */}
        <div 
          className="relative perspective-1000"
          style={{ perspective: '1000px' }}
        >
          {/* Letter Container */}
          <div
            className={`relative transition-all duration-700 ease-out ${
              isUnfolding ? 'scale-100' : 'scale-75 opacity-0'
            }`}
          >
            {/* Paper Background */}
            <div 
              className="relative rounded-lg shadow-2xl overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #fffef8 0%, #f8f4e8 50%, #f0ebe0 100%)',
                boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px ${decorationColor}30`,
              }}
            >
              {/* Decorative header strip */}
              <div 
                className="h-3"
                style={{ background: `linear-gradient(90deg, ${decorationColor}, ${adjustColor(decorationColor, 20)}, ${decorationColor})` }}
              />

              {/* Paper texture lines */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-30"
                style={{
                  backgroundImage: 'repeating-linear-gradient(transparent, transparent 28px, #d4cfc4 29px)',
                  top: '60px',
                }}
              />

              {/* Content */}
              <div className={`p-8 transition-all duration-500 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
                {/* From Label with User Avatar & Decoration Icon - SWITCHED ORDER */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <UserAvatar user={sender || undefined} size="lg" />
                    <div>
                      <p className="text-sm text-gray-500">From</p>
                      <p className="text-lg font-semibold text-gray-800">
                        {sender?.display_name || sender?.full_name || 'A Friend'}
                      </p>
                    </div>
                  </div>
                  <span className="text-3xl">{decorationIcon}</span>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                  <span className="text-gray-400">✨</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                </div>

                {/* Message Content */}
                <div className="min-h-[120px] mb-6">
                  <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                    {selectedMessage.content}
                  </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <p className="text-gray-400 text-sm">
                    {new Date(selectedMessage.created_at).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                  <div className="flex items-center gap-2 text-gray-500">
                    <span>🎄</span>
                    <span className="text-sm">Holiday Wishes</span>
                  </div>
                </div>
              </div>

              {/* Decorative corner */}
              <div 
                className="absolute bottom-0 right-0 w-16 h-16"
                style={{
                  background: `linear-gradient(135deg, transparent 50%, ${decorationColor}15 50%)`,
                }}
              />

              {/* Fold effect */}
              <div 
                className="absolute top-0 right-0 w-8 h-8"
                style={{
                  background: 'linear-gradient(135deg, #e8e4d8 50%, transparent 50%)',
                  boxShadow: '-2px 2px 5px rgba(0,0,0,0.1)',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function adjustColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent)
  const R = Math.min(255, Math.max(0, (num >> 16) + amt))
  const G = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amt))
  const B = Math.min(255, Math.max(0, (num & 0x0000ff) + amt))
  return `#${((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1)}`
}
