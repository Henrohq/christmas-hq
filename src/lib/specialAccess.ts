/**
 * Special Access Management
 * Manages access to exclusive features like the Aurora sky and Cosmic Star
 */

// List of emails with special access to Aurora sky
// Add/remove emails here to grant/revoke access
const AURORA_ACCESS_EMAILS = [
  'henryaleraga@gmail.com', // Testing account
  // Add more emails below as needed:
  // 'special.user@company.com',
  // 'vip@company.com',
]

// List of emails with special access to Cosmic Star gradient
// This is a VERY exclusive feature for the chosen ones
const COSMIC_STAR_ACCESS_EMAILS = [
  'henryaleraga@gmail.com', // Testing account
  // Add more emails below as needed - only the most special people:
  // 'santa@northpole.com',
  // 'chosen.one@company.com',
]

/**
 * Check if a user has access to the Aurora Borealis sky
 * @param email - User's email address
 * @returns true if user has access, false otherwise
 */
export function hasAuroraAccess(email: string | null | undefined): boolean {
  if (!email) return false
  
  // Convert to lowercase for case-insensitive comparison
  const normalizedEmail = email.toLowerCase().trim()
  
  return AURORA_ACCESS_EMAILS.some(
    accessEmail => accessEmail.toLowerCase().trim() === normalizedEmail
  )
}

/**
 * Get all users with Aurora access (for admin purposes)
 */
export function getAuroraAccessList(): string[] {
  return [...AURORA_ACCESS_EMAILS]
}

/**
 * Check if user can add someone to Aurora access list
 * (Reserved for future admin features)
 */
export function canGrantAuroraAccess(email: string | null | undefined): boolean {
  // For now, only the test account can grant access
  return email === 'henryaleraga@gmail.com'
}

/**
 * Get a fun message for locked Aurora sky
 */
export function getAuroraLockedMessage(): string {
  const messages = [
    '✨ A mystical sky reserved for the chosen few...',
    '🌌 The northern lights await those who seek them',
    '🔮 This celestial wonder is meant for special eyes only',
    '⭐ The aurora whispers to only a select group',
    '🎭 A secret sky for those who know the magic words',
  ]
  
  return messages[Math.floor(Math.random() * messages.length)]
}

/**
 * Check if a user has access to the Cosmic Star gradient
 * @param email - User's email address
 * @returns true if user has access, false otherwise
 */
export function hasCosmicStarAccess(email: string | null | undefined): boolean {
  if (!email) return false
  
  // Convert to lowercase for case-insensitive comparison
  const normalizedEmail = email.toLowerCase().trim()
  
  return COSMIC_STAR_ACCESS_EMAILS.some(
    accessEmail => accessEmail.toLowerCase().trim() === normalizedEmail
  )
}

/**
 * Get all users with Cosmic Star access (for admin purposes)
 */
export function getCosmicStarAccessList(): string[] {
  return [...COSMIC_STAR_ACCESS_EMAILS]
}

/**
 * Get a mysterious message for locked Cosmic Star
 */
export function getCosmicStarLockedMessage(): string {
  const messages = [
    '✨ The Cosmic Star awaits those touched by stardust...',
    '🌟 A celestial secret known only to the universe\'s favorites',
    '💫 This galactic wonder is reserved for the chosen few',
    '⭐ Legends speak of a star that dances across dimensions...',
    '🔮 Only those who can see beyond reality may unlock this',
    '🌠 The cosmos whispers this secret to very special souls',
    '✨ An interdimensional treasure for those who dare to dream',
    '🪐 This stellar phenomenon is not meant for mere mortals',
  ]
  
  return messages[Math.floor(Math.random() * messages.length)]
}

/**
 * Special aurora configuration
 */
export const AURORA_CONFIG = {
  skyColor: '#0a0a1a', // Very dark blue-black
  fogColor: '#0f0f2a',
  ambientColor: '#1a1a3a',
  auroraColors: ['#00ff88', '#00ccff', '#aa00ff', '#ff0088'],
} as const

/**
 * Cosmic Star gradient configuration
 * A mystical moving gradient that shifts through cosmic colors
 */
export const COSMIC_STAR_CONFIG = {
  id: 'COSMIC_GRADIENT', // Special identifier
  name: 'Cosmic Gradient',
  gradientColors: ['#ff00ff', '#00ffff', '#ffff00', '#ff0088', '#00ff88'],
  speed: 1.0, // Animation speed
  emissiveIntensity: 1.2, // Extra bright
} as const
