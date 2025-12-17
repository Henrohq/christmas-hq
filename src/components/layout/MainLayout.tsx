import { ReactNode, useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useStore } from '@/store/useStore'
import { UserSearch } from '@/components/ui/UserSearch'
import { UserAvatar } from '@/components/ui/UserAvatar'
import { MissionsTracker } from '@/components/ui/MissionsTracker'

interface MainLayoutProps {
  children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, setUser, showMissions, setShowMissions, missionsOpened } = useStore()
  const [showSearch, setShowSearch] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  const handleLogout = async () => {
    setShowUserMenu(false)
    try {
      if (isSupabaseConfigured()) {
        await supabase.auth.signOut()
      }
      setUser(null)
      navigate('/')
    } catch (error) {
      console.error('Logout error:', error)
      // Force logout even on error
      setUser(null)
      navigate('/')
    }
  }

  const isActive = (path: string) => location.pathname === path

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setShowMobileMenu(false)
      }
    }

    if (showUserMenu || showMobileMenu) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showUserMenu, showMobileMenu])

  return (
    <div className="w-full h-full relative">
      {/* Top Navigation */}
      <header 
        className="fixed top-0 left-0 right-0 z-[100] p-2 md:p-4"
        style={{ pointerEvents: 'auto' }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between glass rounded-xl px-3 md:px-4 py-2">
          {/* Logo */}
          <button
            type="button"
            onClick={() => {
              navigate('/')
              setShowMobileMenu(false)
            }}
            className="text-xl md:text-2xl lg:text-3xl text-yellow-400 hover:scale-105 transition-transform font-semibold"
          >
            🎄 Christmas HQ
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2 lg:gap-4">
            <button
              type="button"
              onClick={() => {
                setShowSearch(!showSearch)
                if (!showSearch) setShowMissions(false)
              }}
              className="px-3 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all"
            >
              🔍
            </button>

            {/* Missions Toggle */}
            <button
              type="button"
              onClick={() => {
                setShowMissions(!showMissions)
                if (!showMissions) setShowSearch(false)
              }}
              className="relative px-3 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all"
              title="Missions"
            >
              📜
              {!missionsOpened && (
                <span className="absolute -top-1 -left-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white/20" />
              )}
            </button>

            {/* HQ Tree and My Tree */}
            <button
              type="button"
              onClick={() => {
                setShowSearch(false)
                setShowMissions(false)
                navigate('/')
              }}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/')
                  ? 'bg-yellow-400 text-black'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              🏠 HQ Tree
            </button>

            <button
              type="button"
              onClick={() => {
                setShowSearch(false)
                setShowMissions(false)
                navigate('/my-tree')
              }}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/my-tree')
                  ? 'bg-yellow-400 text-black'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              🎄 My Tree
            </button>

            {/* User Menu */}
            <div ref={userMenuRef} className="relative ml-2 pl-4 border-l border-white/20 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-white/10 transition-all cursor-pointer"
              >
                <div className="hidden lg:block text-right">
                  <p className="text-sm text-white font-medium">
                    {user?.display_name || user?.full_name}
                  </p>
                  <p className="text-xs text-white/50">{user?.email}</p>
                </div>
                <UserAvatar user={user} size="sm" />
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 glass rounded-lg overflow-hidden shadow-xl">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-left text-white hover:bg-red-500/20 transition-all flex items-center gap-2"
                  >
                    <span>🚪</span>
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all"
            aria-label="Menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {showMobileMenu ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {showMobileMenu && (
          <div
            ref={mobileMenuRef}
            className="md:hidden absolute top-full left-0 right-0 mt-2 mx-2 glass rounded-xl overflow-hidden shadow-2xl z-50"
          >
            <div className="py-2">
              {/* Search */}
              <button
                type="button"
                onClick={() => {
                  setShowSearch(!showSearch)
                  if (!showSearch) setShowMissions(false)
                  setShowMobileMenu(false)
                }}
                className="w-full px-4 py-3 text-left text-white/80 hover:text-white hover:bg-white/10 transition-all flex items-center gap-3"
              >
                <span className="text-xl">🔍</span>
                <span>Search</span>
              </button>

              {/* Missions */}
              <button
                type="button"
                onClick={() => {
                  setShowMissions(!showMissions)
                  if (!showMissions) setShowSearch(false)
                  setShowMobileMenu(false)
                }}
                className="w-full px-4 py-3 text-left text-white/80 hover:text-white hover:bg-white/10 transition-all flex items-center gap-3 relative"
              >
                <span className="text-xl">📜</span>
                <span>Missions</span>
                {!missionsOpened && (
                  <span className="ml-auto w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>

              {/* Divider */}
              <div className="h-px bg-white/10 my-1" />

              {/* HQ Tree */}
              <button
                type="button"
                onClick={() => {
                  setShowSearch(false)
                  setShowMissions(false)
                  setShowMobileMenu(false)
                  navigate('/')
                }}
                className={`w-full px-4 py-3 text-left transition-all flex items-center gap-3 ${
                  isActive('/')
                    ? 'bg-yellow-400/20 text-yellow-400'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="text-xl">🏠</span>
                <span>HQ Tree</span>
              </button>

              {/* My Tree */}
              <button
                type="button"
                onClick={() => {
                  setShowSearch(false)
                  setShowMissions(false)
                  setShowMobileMenu(false)
                  navigate('/my-tree')
                }}
                className={`w-full px-4 py-3 text-left transition-all flex items-center gap-3 ${
                  isActive('/my-tree')
                    ? 'bg-yellow-400/20 text-yellow-400'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="text-xl">🎄</span>
                <span>My Tree</span>
              </button>

              {/* Divider */}
              <div className="h-px bg-white/10 my-1" />

              {/* User Info */}
              <div className="px-4 py-3 border-t border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <UserAvatar user={user} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium truncate">
                      {user?.display_name || user?.full_name}
                    </p>
                    <p className="text-xs text-white/50 truncate">{user?.email}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowMobileMenu(false)
                    handleLogout()
                  }}
                  className="w-full px-4 py-2 rounded-lg text-white hover:bg-red-500/20 transition-all flex items-center gap-2"
                >
                  <span>🚪</span>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Search Dropdown - Desktop */}
        {showSearch && (
          <div className="hidden md:block absolute top-full right-4 mt-2 w-80">
            <UserSearch onClose={() => setShowSearch(false)} />
          </div>
        )}
      </header>

      {/* Missions Tracker */}
      {showMissions && <MissionsTracker />}

      {/* Main Content */}
      <main className="w-full h-full">
        {children}
      </main>
    </div>
  )
}
