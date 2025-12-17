import { useRef, useState, useMemo, memo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import type { Profile } from '@/types/database'
import { getUserAvatarUrl, getInitials, getAvatarColor } from '@/lib/userAvatars'

interface UserOrnamentProps {
  user: Profile
  position: [number, number, number]
  onClick: () => void
}

// PERFORMANCE OPTIMIZED: Reduced polygon counts, removed constant point lights, memoized
export const UserOrnament = memo(function UserOrnament({ user, position, onClick }: UserOrnamentProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  
  // Random color based on user id - brighter and more saturated
  const colorHsl = useMemo(() => {
    const hue = (user.id.charCodeAt(0) * 37 + user.id.charCodeAt(1) * 13) % 360
    return { hue, color: `hsl(${hue}, 80%, 55%)` }
  }, [user.id])

  const glowColor = useMemo(() => {
    return new THREE.Color(`hsl(${colorHsl.hue}, 100%, 70%)`)
  }, [colorHsl.hue])

  // Avatar info
  const avatarUrl = getUserAvatarUrl(user.email)
  const initials = getInitials(user.display_name || user.full_name)
  const avatarBgColor = getAvatarColor(user.email)

  // OPTIMIZED: Only animate when hovered or use simpler rotation
  useFrame((state) => {
    if (meshRef.current) {
      // Slower, simpler rotation
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
    }
    // Only pulse glow when hovered
    if (glowRef.current && hovered) {
      const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.15 + 0.85
      glowRef.current.scale.setScalar(pulse * 1.3)
    }
  })

  return (
    <group position={position}>
      {/* Outer glow sphere - OPTIMIZED: Reduced from 16x16 to 8x8 segments */}
      <mesh ref={glowRef} scale={hovered ? 1.2 : 1.1}>
        <sphereGeometry args={[0.22, 8, 8]} />
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={hovered ? 0.35 : 0.15}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Main ornament - OPTIMIZED: Reduced from 32x32 to 12x12 segments */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
        onPointerOver={() => {
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHovered(false)
          document.body.style.cursor = 'auto'
        }}
        scale={hovered ? 1.2 : 1}
      >
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshStandardMaterial
          color={colorHsl.color}
          roughness={0.2}
          metalness={0.85}
          emissive={colorHsl.color}
          emissiveIntensity={hovered ? 0.5 : 0.2}
        />
      </mesh>

      {/* Ornament cap - OPTIMIZED: Reduced segments from 8 to 6 */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 0.08, 6]} />
        <meshStandardMaterial color="#ffd700" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* REMOVED: Point light - using emissive materials instead for better performance */}

      {/* Hover tooltip with avatar - LEFT ALIGNED */}
      {hovered && (
        <Html
          position={[0, 0.6, 0]}
          center
          style={{
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          <div className="glass px-3 py-2 rounded-lg flex items-center gap-2">
            {/* Avatar */}
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold overflow-hidden flex-shrink-0"
              style={{ backgroundColor: avatarUrl ? 'transparent' : avatarBgColor }}
            >
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt={user.display_name || user.full_name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
            <div className="text-left">
              <p className="text-white font-medium text-sm">
                {user.display_name || user.full_name}
              </p>
              <p className="text-yellow-400 text-xs">Click to visit tree</p>
            </div>
          </div>
        </Html>
      )}
    </group>
  )
})
