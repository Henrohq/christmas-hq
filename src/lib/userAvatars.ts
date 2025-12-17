/**
 * User Avatar Mapping
 * 
 * Maps user emails to their avatar image paths.
 * Images should be placed in /public/avatars/ directory.
 * 
 * To add a user's avatar:
 * 1. Add their image to /public/avatars/ (e.g., john.doe.jpg)
 * 2. Add their email and filename to this map
 * 
 * Example: 'john.doe@company.com': 'john.doe.jpg'
 */

export const USER_AVATAR_MAP: Record<string, string> = {
  // Add your user email -> avatar filename mappings here
  // Example entries (replace with real data):
  'alice.johnson@company.com': 'alice.johnson.jpg',
  'bob.smith@company.com': 'bob.smith.jpg',
  'carol.williams@company.com': 'carol.williams.jpg',
  'david.brown@company.com': 'david.brown.jpg',
  'emma.davis@company.com': 'emma.davis.jpg',
  'frank.miller@company.com': 'frank.miller.jpg',
  'grace.wilson@company.com': 'grace.wilson.jpg',
  'henry.taylor@company.com': 'henry.taylor.jpg',
  'ivy.anderson@company.com': 'ivy.anderson.jpg',
  'jack.thomas@company.com': 'jack.thomas.jpg',
  'kate.jackson@company.com': 'kate.jackson.jpg',
  'liam.white@company.com': 'liam.white.jpg',
  'mia.harris@company.com': 'mia.harris.jpg',
  'noah.martin@company.com': 'noah.martin.jpg',
  'olivia.garcia@company.com': 'olivia.garcia.jpg',
  'peter.martinez@company.com': 'peter.martinez.jpg',
  'quinn.robinson@company.com': 'quinn.robinson.jpg',
  'rachel.clark@company.com': 'rachel.clark.jpg',
  'sam.rodriguez@company.com': 'sam.rodriguez.jpg',
  'tina.lewis@company.com': 'tina.lewis.jpg',
  'uma.lee@company.com': 'uma.lee.jpg',
  'victor.walker@company.com': 'victor.walker.jpg',
  'wendy.hall@company.com': 'wendy.hall.jpg',
  'xavier.allen@company.com': 'xavier.allen.jpg',
  'yara.young@company.com': 'yara.young.jpg',
  'zack.king@company.com': 'zack.king.jpg',
  'anna.wright@company.com': 'anna.wright.jpg',
  'ben.scott@company.com': 'ben.scott.jpg',
  'chloe.green@company.com': 'chloe.green.jpg',
  'dan.adams@company.com': 'dan.adams.jpg',
}

/**
 * Get the avatar URL for a user by their email
 * Returns the mapped avatar path or null if not found
 */
export function getUserAvatarUrl(email: string | undefined | null): string | null {
  if (!email) return null
  
  const filename = USER_AVATAR_MAP[email.toLowerCase()]
  if (filename) {
    return `/avatars/${filename}`
  }
  
  return null
}

/**
 * Get initials from a name for fallback avatar
 */
export function getInitials(name: string | undefined | null): string {
  if (!name) return '?'
  
  const parts = name.trim().split(' ')
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase()
  }
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

/**
 * Generate a consistent color based on a string (for fallback avatar backgrounds)
 */
export function getAvatarColor(str: string | undefined | null): string {
  if (!str) return '#6b7280'
  
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  const hue = Math.abs(hash % 360)
  return `hsl(${hue}, 65%, 45%)`
}

