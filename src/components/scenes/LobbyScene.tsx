import { Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useNavigate } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { ChristmasTree } from '@/components/three/ChristmasTree'
import { UserOrnament } from '@/components/three/UserOrnament'
import { SnowGround, Snowfall, Starfield, SceneLighting } from '@/components/three/Environment'

export function LobbyScene() {
  const navigate = useNavigate()
  const { allUsers, user } = useStore()

  // Position users as ornaments on the tree
  const userPositions = useMemo(() => {
    const positions: { user: typeof allUsers[0]; position: [number, number, number] }[] = []
    
    // Filter out current user
    const otherUsers = allUsers.filter((u) => u.id !== user?.id)
    
    otherUsers.forEach((u, index) => {
      // Distribute around the tree in a spiral
      const layer = Math.floor(index / 8)
      const angleOffset = (index % 8) * (Math.PI / 4) + layer * 0.4
      
      // Tighter radii to keep ornaments close to tree surface
      const layerData = [
        { y: 2, radius: 1.9 },
        { y: 3, radius: 1.6 },
        { y: 4, radius: 1.3 },
        { y: 5, radius: 1.0 },
        { y: 5.8, radius: 0.7 },
      ][layer % 5]
      
      positions.push({
        user: u,
        position: [
          Math.cos(angleOffset) * layerData.radius,
          layerData.y,
          Math.sin(angleOffset) * layerData.radius,
        ],
      })
    })
    
    return positions
  }, [allUsers, user?.id])

  const handleUserClick = (userId: string) => {
    navigate(`/tree/${userId}`)
  }

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 5, 12], fov: 60 }}
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
        <Suspense fallback={null}>
          <SceneLighting />
          <fog attach="fog" args={['#090A0F', 15, 50]} />

          {/* Main Tree */}
          <ChristmasTree showBaseDecorations={false} />

          {/* User Ornaments */}
          {userPositions.map(({ user: u, position }) => (
            <UserOrnament
              key={u.id}
              user={u}
              position={position}
              onClick={() => handleUserClick(u.id)}
            />
          ))}

          {/* Environment */}
          <SnowGround />
          <Snowfall />
          <Starfield />

          {/* Controls - target slightly above tree center */}
          <OrbitControls
            target={[0, 4, 0]}
            enableDamping
            dampingFactor={0.08}
            minDistance={6}
            maxDistance={20}
            maxPolarAngle={Math.PI / 2 + 0.3}
            minPolarAngle={0.3}
            autoRotate
            autoRotateSpeed={0.2}
          />
        </Suspense>
      </Canvas>

      {/* Instructions */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 text-center">
        <p className="text-white/70 font-handwriting text-xl animate-fade-in">
          Click on an ornament to visit someone's tree 🎄
        </p>
      </div>
    </div>
  )
}


