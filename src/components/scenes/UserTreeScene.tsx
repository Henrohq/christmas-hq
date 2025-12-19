import { Suspense, useEffect, useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useParams } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useStore } from '@/store/useStore'
import { ChristmasTree, getDecorationLevel } from '@/components/three/ChristmasTree'
import { 
  GiftDecoration, 
  CardDecoration, 
  OrnamentDecoration,
  calculateDecorationPositions 
} from '@/components/three/MessageDecorations'
import { SnowGround, Snowfall, Starfield, SceneLighting, LandscapeDecorations } from '@/components/three/Environment'
import { MessageModal } from '@/components/modals/MessageModal'
import { ComposeModal } from '@/components/modals/ComposeModal'
import { TreeCustomizer } from '@/components/ui/TreeCustomizer'
import { UserAvatar } from '@/components/ui/UserAvatar'
import type { Message, Profile } from '@/types/database'

interface UserTreeSceneProps {
  userId?: string
  isOwnTree?: boolean
}

export function UserTreeScene({ userId: propUserId, isOwnTree }: UserTreeSceneProps) {
  const { userId: paramUserId } = useParams()
  const treeOwnerId = propUserId || paramUserId
  
  const { 
    user, 
    messages, 
    setMessages, 
    allUsers,
    openMessageModal, 
    isMessageModalOpen,
    isComposeModalOpen,
    openComposeModal,
  } = useStore()
  
  const [treeOwner, setTreeOwner] = useState<Profile | null>(null)
  const [canLeaveMessage, setCanLeaveMessage] = useState(false)
  const [senderProfiles, setSenderProfiles] = useState<Map<string, Profile>>(new Map())
  const [isLoading, setIsLoading] = useState(true)
  const [showCustomizer, setShowCustomizer] = useState(false)

  // Fetch tree owner info
  useEffect(() => {
    const fetchOwner = async () => {
      if (!treeOwnerId) return

      if (!isSupabaseConfigured()) {
        const mockOwner = allUsers.find((u) => u.id === treeOwnerId) || {
          id: treeOwnerId,
          email: 'user@demo.com',
          full_name: 'Demo User',
          display_name: 'Demo',
          avatar_url: null,
          tree_color: '#0d5c0d',
          star_color: '#ffd700',
          sky_color: '#090A0F',
          created_at: '',
          updated_at: '',
        }
        setTreeOwner(mockOwner)
        return
      }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', treeOwnerId)
        .single()

      if (data) {
        setTreeOwner(data)
      }
    }

    fetchOwner()
  }, [treeOwnerId, allUsers])

  // Fetch messages for this tree
  useEffect(() => {
    if (!treeOwnerId) return

    const fetchMessages = async () => {
      setIsLoading(true)

      if (!isSupabaseConfigured()) {
        // Demo mode - show empty tree (Supabase not configured)
        console.warn('Supabase not configured - showing empty tree')
        setMessages([])
        setIsLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('recipient_id', treeOwnerId)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error fetching messages:', error)
      } else if (data) {
        setMessages(data)
        
        const senderIds = [...new Set(data.map((m: Message) => m.sender_id))]
        if (senderIds.length > 0) {
          const { data: profiles } = await supabase
            .from('profiles')
            .select('*')
            .in('id', senderIds)
          
          if (profiles) {
            const profileMap = new Map<string, Profile>()
            profiles.forEach((p: Profile) => profileMap.set(p.id, p))
            setSenderProfiles(profileMap)
          }
        }
      }
      setIsLoading(false)
    }

    fetchMessages()

    // Real-time subscription
    if (isSupabaseConfigured()) {
      const channel = supabase
        .channel(`messages:${treeOwnerId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `recipient_id=eq.${treeOwnerId}`,
          },
          async (payload) => {
            const newMessage = payload.new as Message
            const { data: senderProfile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', newMessage.sender_id)
              .single()
            
            if (senderProfile) {
              setSenderProfiles((prev: Map<string, Profile>) => new Map(prev).set((senderProfile as Profile).id, senderProfile as Profile))
            }
            
            setMessages([...messages, newMessage])
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [treeOwnerId, setMessages])

  // Check if current user can leave a message
  useEffect(() => {
    if (!user || !treeOwnerId || user.id === treeOwnerId) {
      setCanLeaveMessage(false)
      return
    }

    const hasExistingMessage = messages.some((m) => m.sender_id === user.id)
    setCanLeaveMessage(!hasExistingMessage)
  }, [user, treeOwnerId, messages])

  // Filter messages based on privacy
  const visibleMessages = useMemo(() => {
    return messages.filter((m) => {
      if (!m.is_private) return true
      return user?.id === treeOwnerId || user?.id === m.sender_id
    })
  }, [messages, user?.id, treeOwnerId])

  // Calculate positions for all decoration types
  const positions = useMemo(() => calculateDecorationPositions(50), [])

  // Separate messages by type
  const { gifts, cards, ornaments } = useMemo(() => {
    const gifts: Message[] = []
    const cards: Message[] = []
    const ornaments: Message[] = []

    visibleMessages.forEach((m) => {
      switch (m.decoration_type) {
        case 'gift':
          gifts.push(m)
          break
        case 'card':
          cards.push(m)
          break
        case 'ornament':
          ornaments.push(m)
          break
      }
    })

    return { gifts, cards, ornaments }
  }, [visibleMessages])

  const handleDecorationClick = (message: Message) => {
    openMessageModal(message)
  }

  const getSender = (senderId: string): Profile | undefined => {
    return senderProfiles.get(senderId) || allUsers.find((u) => u.id === senderId)
  }

  // Tree customization
  const treeColor = treeOwner?.tree_color || '#0d5c0d'
  const starColor = treeOwner?.star_color || '#ffd700'
  const skyColor = treeOwner?.sky_color || '#090A0F'
  const decorationLevel = getDecorationLevel(visibleMessages.length)

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 5, 14], fov: 55 }}
        shadows
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
        gl={{ 
          antialias: false,
          powerPreference: 'high-performance',
          toneMapping: 3,
          toneMappingExposure: 1.2
        }}
      >
        <color attach="background" args={[skyColor]} />
        <Suspense fallback={null}>
          <SceneLighting />
          <fog attach="fog" args={[skyColor, 20, 60]} />

          {/* Main Tree with customization */}
          <ChristmasTree 
            treeColor={treeColor}
            starColor={starColor}
            decorationLevel={decorationLevel}
            showBaseDecorations={true}
          />

          {/* Gift decorations at base of tree */}
          {gifts.map((message, index) => (
            <GiftDecoration
              key={message.id}
              message={message}
              sender={getSender(message.sender_id)}
              position={positions.giftPositions[index % positions.giftPositions.length]}
              onClick={() => handleDecorationClick(message)}
            />
          ))}

          {/* Card decorations floating around tree */}
          {cards.map((message, index) => (
            <CardDecoration
              key={message.id}
              message={message}
              sender={getSender(message.sender_id)}
              position={positions.cardPositions[index % positions.cardPositions.length]}
              onClick={() => handleDecorationClick(message)}
            />
          ))}

          {/* Ornament decorations on tree */}
          {ornaments.map((message, index) => (
            <OrnamentDecoration
              key={message.id}
              message={message}
              sender={getSender(message.sender_id)}
              position={positions.ornamentPositions[index % positions.ornamentPositions.length]}
              onClick={() => handleDecorationClick(message)}
            />
          ))}

          {/* Environment */}
          <SnowGround />
          <LandscapeDecorations decorationLevel={decorationLevel} />
          <Snowfall />
          <Starfield />

          {/* Controls */}
          <OrbitControls
            target={[0, 3.5, 0]}
            enableDamping
            dampingFactor={0.08}
            minDistance={8}
            maxDistance={25}
            maxPolarAngle={Math.PI / 2 + 0.2}
            minPolarAngle={0.4}
            autoRotate
            autoRotateSpeed={0.15}
          />
        </Suspense>
      </Canvas>

      {/* Tree Owner Info with Avatar - UPPER LEFT */}
      <div className="fixed top-24 left-4 glass rounded-xl px-4 py-3">
        <div className="flex items-center gap-3">
          {treeOwner && (
            <UserAvatar user={treeOwner} size="lg" />
          )}
          <div>
            <h2 className="text-2xl font-semibold text-yellow-400">
              {isOwnTree ? 'Your Tree' : `${treeOwner?.display_name || treeOwner?.full_name || 'Loading...'}'s Tree`}
            </h2>
            <p className="text-white/60 text-sm mt-1">
              {isLoading ? (
                <span className="animate-pulse">Loading messages...</span>
              ) : (
                <>
                  {visibleMessages.length} {visibleMessages.length === 1 ? 'message' : 'messages'}
                  {decorationLevel > 0 && (
                    <span className="ml-2 text-yellow-400">
                      {'⭐'.repeat(decorationLevel)}
                    </span>
                  )}
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Customize Tree Button (only for own tree) - WITH SPACING */}
      {isOwnTree && (
        <button
          onClick={() => setShowCustomizer(true)}
          className="fixed top-52 left-4 px-4 py-2 glass rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2"
        >
          <span>🎨</span>
          <span className="md:inline">Customize</span>
        </button>
      )}

      {/* Leave Message Button - MOBILE FRIENDLY */}
      {canLeaveMessage && (
        <button
          onClick={openComposeModal}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 px-4 md:px-6 py-2.5 md:py-3 bg-yellow-400 text-black font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 hover:bg-yellow-500 transition-all duration-300 flex items-center gap-2 whitespace-nowrap text-sm md:text-base"
        >
          <span>🎁</span>
          <span className="hidden sm:inline">Leave a Message</span>
          <span className="sm:hidden">Message</span>
        </button>
      )}

      {/* Instructions */}
      {!canLeaveMessage && !isOwnTree && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 text-center">
          <p className="text-white/70 text-lg">
            {messages.some((m) => m.sender_id === user?.id)
              ? "You've already left a message here ✨"
              : 'Click on any decoration to read the message'}
          </p>
        </div>
      )}

      {isOwnTree && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 text-center">
          <p className="text-white/70 text-lg">
            Click on decorations to read messages from your colleagues 💝
          </p>
        </div>
      )}

      {/* Modals */}
      {isMessageModalOpen && <MessageModal />}
      {isComposeModalOpen && treeOwnerId && <ComposeModal recipientId={treeOwnerId} />}
      {showCustomizer && treeOwner && (
        <TreeCustomizer 
          currentTreeColor={treeColor}
          currentStarColor={starColor}
          currentSkyColor={skyColor}
          onClose={() => setShowCustomizer(false)}
          onSave={(newTreeColor, newStarColor, newSkyColor) => {
            setTreeOwner({ ...treeOwner, tree_color: newTreeColor, star_color: newStarColor, sky_color: newSkyColor })
            setShowCustomizer(false)
          }}
        />
      )}
    </div>
  )
}
