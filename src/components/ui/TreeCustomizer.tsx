import { useState } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useStore } from '@/store/useStore'
import { hasCosmicStarAccess, getCosmicStarLockedMessage, COSMIC_STAR_CONFIG } from '@/lib/specialAccess'

interface TreeCustomizerProps {
  currentTreeColor: string
  currentStarColor: string
  currentSkyColor?: string
  onClose: () => void
  onSave: (treeColor: string, starColor: string, skyColor: string) => void
}

const TREE_COLORS = [
  { name: 'Classic Green', value: '#0d5c0d', locked: false },
  { name: 'Forest Green', value: '#228b22', locked: false },
  { name: 'Pine Green', value: '#01796f', locked: true },
  { name: 'Blue Spruce', value: '#2e5a5a', locked: true },
  { name: 'Frost Blue', value: '#4a7c8c', locked: true },
  { name: 'Snow White', value: '#e8e8e8', locked: true },
  { name: 'Silver', value: '#a0a0a0', locked: true },
  { name: 'Rose Gold', value: '#b76e79', locked: true },
]

const STAR_COLORS = [
  { name: 'Classic Gold', value: '#ffd700', locked: false },
  { name: 'Bright Yellow', value: '#ffeb3b', locked: false },
  { name: 'White', value: '#ffffff', locked: true },
  { name: 'Silver', value: '#c0c0c0', locked: true },
  { name: 'Rose', value: '#ff6b9d', locked: true },
  { name: 'Ice Blue', value: '#87ceeb', locked: true },
  { name: 'Ruby Red', value: '#e31c3d', locked: true },
  { name: 'Amethyst', value: '#9966cc', locked: true },
  { 
    name: 'Cosmic Gradient', 
    value: COSMIC_STAR_CONFIG.id, 
    locked: true, 
    isSpecial: true,
    requiresSpecialAccess: true 
  },
]

const SKY_COLORS = [
  { name: 'Midnight', value: '#090A0F', locked: false },
  { name: 'Deep Blue', value: '#0a1628', locked: false },
  { name: 'Aurora Borealis', value: '#003d5c', isSpecial: true, locked: true }, // Deep teal representing northern lights
  { name: 'Night Purple', value: '#1a0a2e', locked: true },
  { name: 'Northern Lights', value: '#0d2818', locked: true },
  { name: 'Arctic Blue', value: '#0a1a2a', locked: true },
  { name: 'Twilight', value: '#1a0f1a', locked: true },
  { name: 'Starry Night', value: '#0f0f1a', locked: true },
  { name: 'Aurora', value: '#0a1f1f', locked: true },
]

export function TreeCustomizer({ 
  currentTreeColor, 
  currentStarColor, 
  currentSkyColor = '#090A0F',
  onClose, 
  onSave 
}: TreeCustomizerProps) {
  const { user, setUser, messagesCompleted } = useStore()
  const [treeColor, setTreeColor] = useState(currentTreeColor)
  const [starColor, setStarColor] = useState(currentStarColor)
  const [skyColor, setSkyColor] = useState(currentSkyColor)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  
  const isUnlocked = messagesCompleted >= 3

  const handleSave = async () => {
    if (!user) return

    setSaving(true)
    setError('')

    // Demo mode - just update locally
    if (!isSupabaseConfigured()) {
      const updatedUser = { ...user, tree_color: treeColor, star_color: starColor, sky_color: skyColor }
      setUser(updatedUser)
      onSave(treeColor, starColor, skyColor)
      return
    }

    try {
      // Try to update the profile with tree colors
      const updateQuery = supabase
        .from('profiles')
        // @ts-ignore - Supabase type inference limitation with custom columns (tree_color, star_color, sky_color)
        .update({
          tree_color: treeColor,
          star_color: starColor,
          sky_color: skyColor,
        })
        .eq('id', user.id)
        .select()
        .single()
      
      const { data, error: updateError } = await updateQuery as any

      if (updateError) {
        // Check if error is due to missing columns
        if (updateError.message?.includes('column') || updateError.code === '42703') {
          setError('Please run the migration: supabase-migration-v3.sql')
          return
        }
        throw updateError
      }

      // Update local user state
      if (data) {
        setUser({ ...user, tree_color: (data as any).tree_color, star_color: (data as any).star_color, sky_color: (data as any).sky_color })
      }
      
      onSave(treeColor, starColor, skyColor)
    } catch (err) {
      console.error('Error saving tree customization:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to save'
      
      // Provide helpful error messages
      if (errorMessage.includes('violates row-level security')) {
        setError('Permission denied. Check RLS policies.')
      } else if (errorMessage.includes('column')) {
        setError('Database needs migration. Run supabase-migration-v3.sql')
      } else {
        setError(errorMessage)
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md glass rounded-2xl p-5 z-10 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold text-yellow-400 mb-4 flex items-center gap-2">
          🎨 Customize Your Tree
        </h2>

        <div className="space-y-5">
          {/* Tree Color */}
          <div>
            <label className="block text-white/80 mb-2 text-sm font-medium">
              🌲 Tree Color
            </label>
            <div className="flex gap-2 flex-wrap">
              {TREE_COLORS.map((color) => {
                const locked = color.locked && !isUnlocked
                return (
                  <div key={color.value} className="relative group">
                    <button
                      type="button"
                      onClick={() => !locked && setTreeColor(color.value)}
                      disabled={locked}
                      className={`w-9 h-9 rounded-lg transition-all relative ${
                        treeColor === color.value
                          ? 'ring-2 ring-white scale-110'
                          : locked
                          ? 'opacity-40 cursor-not-allowed'
                          : 'hover:scale-105 opacity-70 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    >
                      {locked && (
                        <span className="absolute inset-0 flex items-center justify-center text-white text-sm">
                          🔒
                        </span>
                      )}
                    </button>
                    {locked && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        Complete missions to unlock!
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Star Color */}
          <div>
            <label className="block text-white/80 mb-2 text-sm font-medium">
              ⭐ Star Color
            </label>
            <div className="flex gap-2 flex-wrap">
              {STAR_COLORS.map((color) => {
                // Check for special Cosmic Star access
                const hasSpecialAccess = color.requiresSpecialAccess 
                  ? hasCosmicStarAccess(user?.email)
                  : true
                
                const locked = color.locked && !isUnlocked && !hasSpecialAccess
                const isCosmicStar = color.value === COSMIC_STAR_CONFIG.id
                
                return (
                  <div key={color.value} className="relative group">
                    <button
                      type="button"
                      onClick={() => !locked && setStarColor(color.value)}
                      disabled={locked}
                      className={`w-9 h-9 rounded-lg transition-all relative overflow-hidden ${
                        starColor === color.value
                          ? 'ring-2 ring-white scale-110'
                          : locked
                          ? 'opacity-40 cursor-not-allowed'
                          : 'hover:scale-105 opacity-70 hover:opacity-100'
                      }`}
                      style={{
                        ...(isCosmicStar
                          ? {
                              background: 'linear-gradient(45deg, #ff00ff, #00ffff, #ffff00, #ff0088, #00ff88, #ff00ff)',
                              backgroundSize: '400% 400%',
                              animation: !locked ? 'gradientShift 3s ease infinite' : undefined,
                            }
                          : {
                              backgroundColor: color.value,
                            }
                        ),
                        boxShadow: locked ? 'none' : isCosmicStar ? '0 0 12px #ff00ff80' : `0 0 8px ${color.value}40`,
                      }}
                      title={color.name}
                    >
                      {locked && (
                        <span className="absolute inset-0 flex items-center justify-center text-white text-sm drop-shadow-lg">
                          🔒
                        </span>
                      )}
                      {isCosmicStar && !locked && (
                        <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold drop-shadow-lg">
                          ✨
                        </span>
                      )}
                    </button>
                    {locked && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-black/95 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 max-w-xs text-center border border-purple-500/30">
                        {color.requiresSpecialAccess ? (
                          <span className="text-purple-300">{getCosmicStarLockedMessage()}</span>
                        ) : (
                          'Complete missions to unlock!'
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Sky Color */}
          <div>
            <label className="block text-white/80 mb-2 text-sm font-medium">
              🌌 Sky Color
            </label>
            <div className="flex gap-2 flex-wrap">
              {SKY_COLORS.map((color) => {
                const locked = color.locked && !isUnlocked
                return (
                  <div key={color.name} className="relative group">
                    <button
                      type="button"
                      onClick={() => !locked && setSkyColor(color.value)}
                      disabled={locked}
                      className={`w-9 h-9 rounded-lg transition-all border border-white/10 relative overflow-hidden ${
                        skyColor === color.value
                          ? 'ring-2 ring-white scale-110'
                          : locked
                          ? 'opacity-40 cursor-not-allowed'
                          : 'hover:scale-105 opacity-70 hover:opacity-100'
                      }`}
                      style={{ 
                        backgroundColor: color.value,
                        boxShadow: color.isSpecial ? '0 0 12px rgba(0, 95, 115, 0.6)' : 'none'
                      }}
                      title={color.name}
                    >
                      {color.isSpecial && !locked && (
                        <span className="absolute inset-0 flex items-center justify-center text-xs">
                          ✨
                        </span>
                      )}
                      {locked && (
                        <span className="absolute inset-0 flex items-center justify-center text-white text-sm z-10 bg-black/40">
                          🔒
                        </span>
                      )}
                    </button>
                    {locked && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                        Complete missions to unlock!
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Preview */}
          <div className="flex items-center gap-3 p-3 rounded-lg border border-white/10" style={{ backgroundColor: skyColor }}>
            <div className="w-8 h-8 rounded" style={{ backgroundColor: treeColor }} />
            <span className="text-white/40">+</span>
            <div 
              className="w-8 h-8 rounded"
              style={{ backgroundColor: starColor, boxShadow: `0 0 8px ${starColor}60` }}
            />
            <span className="text-white/60 text-sm ml-2">Preview</span>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-green-600 to-green-700 text-white font-medium hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
            >
              {saving ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving...
                </>
              ) : (
                <>✓ Save</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
