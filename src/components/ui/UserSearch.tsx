import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useStore } from '@/store/useStore'
import { UserAvatar } from '@/components/ui/UserAvatar'
import type { Profile } from '@/types/database'

interface UserSearchProps {
  onClose: () => void
}

export function UserSearch({ onClose }: UserSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Profile[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const { allUsers, user } = useStore()

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    const searchUsers = async () => {
      // Show all users when no query (limited)
      if (!query.trim()) {
        if (!isSupabaseConfigured()) {
          setResults(allUsers.filter(u => u.id !== user?.id).slice(0, 10))
        } else {
          // Show recent users when search is empty
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .neq('id', user?.id || '')
            .order('full_name')
            .limit(10)
          
          if (data) {
            setResults(data)
          }
        }
        return
      }

      setLoading(true)

      if (!isSupabaseConfigured()) {
        // Filter mock users locally
        const filtered = allUsers.filter(
          (u) =>
            u.id !== user?.id &&
            (u.full_name.toLowerCase().includes(query.toLowerCase()) ||
              u.email.toLowerCase().includes(query.toLowerCase()))
        )
        setResults(filtered)
        setLoading(false)
        return
      }

      // Try RPC function first, fallback to direct query
      try {
        const { data, error } = await supabase.rpc('search_users', {
          search_query: query,
        })

        if (error) throw error

        if (data) {
          setResults(data.filter((u) => u.id !== user?.id))
        }
      } catch {
        // Fallback: direct query with ILIKE
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .neq('id', user?.id || '')
          .or(`full_name.ilike.%${query}%,email.ilike.%${query}%,display_name.ilike.%${query}%`)
          .order('full_name')
          .limit(20)
        
        if (data) {
          setResults(data)
        }
      }
      setLoading(false)
    }

    const debounce = setTimeout(searchUsers, 300)
    return () => clearTimeout(debounce)
  }, [query, allUsers, user?.id])

  const handleSelect = (userId: string) => {
    navigate(`/tree/${userId}`)
    onClose()
  }

  return (
    <div className="glass rounded-xl p-4 shadow-2xl">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users..."
          className="w-full px-4 py-2 pr-10 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-yellow-400 transition-colors"
        />
        <button
          onClick={onClose}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
        >
          ✕
        </button>
      </div>

      {loading && (
        <div className="py-4 text-center text-white/60">
          <span className="animate-pulse">Searching...</span>
        </div>
      )}

      {results.length > 0 && (
        <ul className="mt-3 space-y-1 max-h-64 overflow-auto">
          {results.map((result) => (
            <li key={result.id}>
              <button
                onClick={() => handleSelect(result.id)}
                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors text-left"
              >
                <UserAvatar user={result} size="md" />
                <div>
                  <p className="text-white font-medium">{result.full_name}</p>
                  <p className="text-white/50 text-sm">{result.email}</p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      {query && !loading && results.length === 0 && (
        <p className="py-4 text-center text-white/60">No users found</p>
      )}
    </div>
  )
}
