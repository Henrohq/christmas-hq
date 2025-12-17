import { getUserAvatarUrl, getInitials, getAvatarColor } from '@/lib/userAvatars'
import type { Profile } from '@/types/database'

interface UserAvatarProps {
  user: Profile | null | undefined
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeClasses = {
  sm: 'w-7 h-7 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
}

export function UserAvatar({ user, size = 'md', className = '' }: UserAvatarProps) {
  const avatarUrl = getUserAvatarUrl(user?.email)
  const initials = getInitials(user?.display_name || user?.full_name)
  const bgColor = getAvatarColor(user?.email || user?.id)
  
  return (
    <div 
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-semibold text-white overflow-hidden ${className}`}
      style={{ backgroundColor: avatarUrl ? 'transparent' : bgColor }}
    >
      {avatarUrl ? (
        <img 
          src={avatarUrl} 
          alt={user?.display_name || user?.full_name || 'User'} 
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to initials if image fails to load
            const target = e.target as HTMLImageElement
            target.style.display = 'none'
            target.parentElement!.style.backgroundColor = bgColor
            target.parentElement!.innerHTML = initials
          }}
        />
      ) : (
        initials
      )}
    </div>
  )
}

