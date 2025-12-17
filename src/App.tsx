import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useStore } from '@/store/useStore'
import { AuthPage } from '@/components/auth/AuthPage'
import { MainLayout } from '@/components/layout/MainLayout'
import { LobbyScene } from '@/components/scenes/LobbyScene'
import { UserTreeScene } from '@/components/scenes/UserTreeScene'
import { LoadingScreen } from '@/components/ui/LoadingScreen'
import { MOCK_USERS } from '@/lib/mockData'

// ============================================
// MOCK DATA TOGGLE - Easy to remove later
// ============================================
// Set to `true` to include 30 mock users for testing
// Set to `false` to only show real users from database
// When ready to remove: change to `false` and delete this comment block
const INCLUDE_MOCK_USERS = true
// ============================================

function App() {
  const { user, isLoading, setUser, setLoading, setAllUsers } = useStore()

  useEffect(() => {
    // Check for existing session
    const initAuth = async () => {
      if (!isSupabaseConfigured()) {
        // Demo mode - don't auto-login, let user go through auth page
        setLoading(false)
        return
      }

      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        
        if (profile) {
          setUser(profile)
        }
      } else {
        setLoading(false)
      }
    }

    initAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
          
          if (profile) {
            setUser(profile)
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [setUser, setLoading])

  // Fetch all users for the lobby
  useEffect(() => {
    const fetchUsers = async () => {
      if (!isSupabaseConfigured()) {
        // Demo mode - use 30 mock users from mockData
        setAllUsers(MOCK_USERS)
        return
      }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .order('full_name')
      
      if (data) {
        // ============================================
        // MOCK USERS MERGE - Remove this block when done testing
        // ============================================
        if (INCLUDE_MOCK_USERS) {
          // Merge real users with mock users (avoid duplicates by email)
          const realUserEmails = new Set(data.map(u => u.email.toLowerCase()))
          const additionalMockUsers = MOCK_USERS.filter(
            mockUser => !realUserEmails.has(mockUser.email.toLowerCase())
          )
          setAllUsers([...data, ...additionalMockUsers])
        } else {
          // Only real users from database
          setAllUsers(data)
        }
        // ============================================
      } else if (INCLUDE_MOCK_USERS) {
        // Fallback to mock users if database query fails
        setAllUsers(MOCK_USERS)
      }
    }

    if (user) {
      fetchUsers()
    }
  }, [user, setAllUsers])

  if (isLoading) {
    return <LoadingScreen />
  }

  if (!user) {
    return <AuthPage />
  }

  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<LobbyScene />} />
        <Route path="/my-tree" element={<UserTreeScene userId={user.id} isOwnTree />} />
        <Route path="/tree/:userId" element={<UserTreeScene />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MainLayout>
  )
}

export default App
