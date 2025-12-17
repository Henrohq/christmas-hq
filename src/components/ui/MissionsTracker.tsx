import { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useStore } from '@/store/useStore'

export function MissionsTracker() {
  const { user, setShowMissions, messagesCompleted, setMessagesCompleted, setMissionsOpened } = useStore()
  const [showUnlockNotification, setShowUnlockNotification] = useState(false)

  // Mark missions as opened when component mounts
  useEffect(() => {
    setMissionsOpened(true)
  }, [setMissionsOpened])

  // Fetch missions progress
  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) return

      if (!isSupabaseConfigured()) {
        // Demo mode - count from store messages sent by current user
        // Note: This requires messages to be stored in the store
        // For demo mode, we'll track locally
        return
      }

      try {
        // Count unique messages sent by user
        const { data, error } = await supabase
          .from('messages')
          .select('recipient_id')
          .eq('sender_id', user.id)

        if (error) {
          console.error('Error fetching missions progress:', error)
          return
        }

        if (data) {
          // Count unique recipients
          const uniqueRecipients = new Set(data.map((m: any) => m.recipient_id))
          const count = uniqueRecipients.size
          
          // Check if just completed
          if (count >= 3 && messagesCompleted < 3) {
            setShowUnlockNotification(true)
            setTimeout(() => setShowUnlockNotification(false), 5000)
          }
          
          setMessagesCompleted(count)
        }
      } catch (err) {
        console.error('Error in fetchProgress:', err)
      }
    }

    fetchProgress()

    // Subscribe to real-time updates
    if (isSupabaseConfigured() && user) {
      const channel = supabase
        .channel(`missions:${user.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `sender_id=eq.${user.id}`,
          },
          (payload) => {
            console.log('New message detected for missions:', payload)
            fetchProgress()
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [user, setMessagesCompleted]) // Removed messagesCompleted from deps to avoid infinite loop

  const isComplete = messagesCompleted >= 3

  return (
    <>
      {/* Missions Tracker Panel */}
      <div className="fixed top-24 right-4 w-72 glass rounded-xl p-4 z-50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-yellow-400 flex items-center gap-2">
            📜 Missions
          </h3>
          <button
            onClick={() => setShowMissions(false)}
            className="text-white/60 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3">
          {/* Mission: Send 3 Messages */}
          <div className={`p-3 rounded-lg ${isComplete ? 'bg-green-500/20 border border-green-500/30' : 'bg-white/5 border border-white/10'}`}>
            <div className="flex items-start gap-3">
              <div className="text-2xl flex-shrink-0">
                {isComplete ? '✅' : '📬'}
              </div>
              <div className="flex-1">
                <h4 className="text-white font-medium text-sm mb-1">
                  {isComplete ? 'Mission Complete!' : 'Spread Holiday Cheer'}
                </h4>
                <p className="text-white/60 text-xs mb-2">
                  {isComplete 
                    ? 'You\'ve unlocked all tree customization styles!' 
                    : 'Send messages to 3 different colleagues'}
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        isComplete ? 'bg-green-500' : 'bg-yellow-400'
                      }`}
                      style={{ width: `${Math.min((messagesCompleted / 3) * 100, 100)}%` }}
                    />
                  </div>
                  <span className={`text-xs font-medium ${isComplete ? 'text-green-400' : 'text-yellow-400'}`}>
                    {messagesCompleted}/3
                  </span>
                </div>
              </div>
            </div>
            {isComplete && (
              <div className="mt-2 pt-2 border-t border-white/10 text-xs text-green-400">
                🎁 Reward: All tree customization options unlocked!
              </div>
            )}
          </div>

          {/* Future missions placeholder */}
          <div className="p-3 rounded-lg bg-white/5 border border-white/10 opacity-50">
            <div className="flex items-start gap-3">
              <div className="text-2xl flex-shrink-0">🔒</div>
              <div>
                <h4 className="text-white font-medium text-sm mb-1">
                  More Missions Coming Soon!
                </h4>
                <p className="text-white/60 text-xs">
                  Complete the first mission to unlock more challenges
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Unlock Notification */}
      {showUnlockNotification && (
        <div className="fixed bottom-8 right-8 glass rounded-xl p-4 shadow-2xl animate-fade-in z-[200] max-w-sm">
          <div className="flex items-start gap-3">
            <div className="text-3xl">🎉</div>
            <div>
              <h4 className="text-yellow-400 font-semibold text-lg mb-1">
                Mission Complete!
              </h4>
              <p className="text-white text-sm">
                You've unlocked all tree customization styles! Visit the customize menu to try them out.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

