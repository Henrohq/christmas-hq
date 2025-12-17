import { useState } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useStore } from '@/store/useStore'
import { DEMO_USER } from '@/lib/mockData'

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false)
  const { setUser } = useStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!isSupabaseConfigured()) {
      // Demo mode - use demo user
      setUser({
        ...DEMO_USER,
        email: email || DEMO_USER.email,
        full_name: fullName || DEMO_USER.full_name,
        display_name: fullName?.split(' ')[0] || DEMO_USER.display_name,
      })
      return
    }

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
      } else {
        const { error, data } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              display_name: fullName.split(' ')[0],
            },
          },
        })
        if (error) throw error
        
        // Check if email confirmation is required
        if (data.user && !data.session) {
          setShowEmailConfirmation(true)
          setLoading(false)
          return
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  // Email Confirmation Screen
  if (showEmailConfirmation) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 text-6xl opacity-20 animate-float">✉️</div>
          <div className="absolute top-20 right-20 text-4xl opacity-20 animate-float" style={{ animationDelay: '1s' }}>🎄</div>
          <div className="absolute bottom-20 left-20 text-5xl opacity-20 animate-float" style={{ animationDelay: '0.5s' }}>✨</div>
          <div className="absolute bottom-10 right-10 text-6xl opacity-20 animate-float" style={{ animationDelay: '1.5s' }}>⭐</div>
        </div>

        <div className="w-full max-w-md">
          <div className="glass rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4">📧</div>
            <h2 className="text-2xl font-semibold text-white mb-4">
              Check Your Email!
            </h2>
            <p className="text-white/70 mb-6">
              We've sent a confirmation link to:
            </p>
            <p className="text-yellow-400 font-medium text-lg mb-6 break-all">
              {email}
            </p>
            <p className="text-white/60 text-sm mb-8">
              Click the link in the email to activate your account and join the holiday celebration! 🎄
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowEmailConfirmation(false)
                  setIsLogin(true)
                }}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold hover:from-green-700 hover:to-green-800 transition-all"
              >
                ✓ I've Confirmed My Email
              </button>
              
              <button
                onClick={() => setShowEmailConfirmation(false)}
                className="w-full py-3 rounded-lg bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all"
              >
                ← Back to Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 text-6xl opacity-20 animate-float">❄️</div>
        <div className="absolute top-20 right-20 text-4xl opacity-20 animate-float" style={{ animationDelay: '1s' }}>🎄</div>
        <div className="absolute bottom-20 left-20 text-5xl opacity-20 animate-float" style={{ animationDelay: '0.5s' }}>🎁</div>
        <div className="absolute bottom-10 right-10 text-6xl opacity-20 animate-float" style={{ animationDelay: '1.5s' }}>⭐</div>
      </div>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-yellow-400 mb-2">
            🎄 Christmas HQ 🎄
          </h1>
          <p className="text-white/70 text-lg">
            Share holiday wishes with your team
          </p>
        </div>

        {/* Auth Card */}
        <div className="glass rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-white mb-6 text-center">
            {isLogin ? 'Welcome Back!' : 'Join the Celebration'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-white/80 mb-2 text-sm">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-yellow-400 transition-colors"
                  placeholder="Your name"
                  required={!isLogin}
                />
              </div>
            )}

            <div>
              <label className="block text-white/80 mb-2 text-sm">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-yellow-400 transition-colors"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-white/80 mb-2 text-sm">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-yellow-400 transition-colors"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-yellow-400 text-black font-semibold hover:bg-yellow-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Loading...
                </span>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-yellow-400 hover:text-yellow-300 transition-colors text-sm"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>

        {!isSupabaseConfigured() && (
          <p className="text-center text-white/50 text-sm mt-4">
            🎅 Demo Mode - No Supabase configured
          </p>
        )}
      </div>
    </div>
  )
}
