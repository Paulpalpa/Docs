import React, { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Points, PointMaterial } from '@react-three/drei'
import * as random from 'maath/random/dist/maath-random.esm'

const SHARDS = [
  { position: [-2.35, 0.95, -0.5], color: '#ffd6a5', scale: 0.16, speed: 1.4 },
  { position: [2.45, -0.55, -0.35], color: '#5ee7ff', scale: 0.13, speed: 1.1 },
  { position: [1.55, 1.25, -1.1], color: '#ff7ad9', scale: 0.11, speed: 1.8 },
  { position: [-1.7, -1.15, -0.7], color: '#c4b5fd', scale: 0.15, speed: 0.9 },
  { position: [0.35, -1.55, -1.4], color: '#ffcc70', scale: 0.09, speed: 1.5 },
]

export default function BackGround() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.4], fov: 52 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
    >
      <color attach="background" args={['#070414']} />
      <fog attach="fog" args={['#070414', 7, 15]} />
      <ambientLight intensity={0.35} />
      <pointLight position={[4, 2.5, 3]} intensity={1.6} color="#ff8ad4" />
      <pointLight position={[-4, -1.5, 2.5]} intensity={1.35} color="#5ee7ff" />
      <pointLight position={[0, 2.2, -1]} intensity={0.7} color="#ffcc70" />
      <Scene />
    </Canvas>
  )
}

function Scene() {
  const rig = useRef()

  useFrame((state) => {
    const { x, y } = state.pointer
    const t = state.clock.elapsedTime
    rig.current.rotation.y += (x * 0.28 - rig.current.rotation.y) * 0.04
    rig.current.rotation.x += (-y * 0.16 - rig.current.rotation.x) * 0.04
    state.camera.position.z = 4.4 + Math.sin(t * 0.22) * 0.12
  })

  return (
    <group ref={rig}>
      <StarField />
      <Core />
      <Rings />
      {SHARDS.map((shard) => (
        <Shard key={shard.color + shard.position.join()} {...shard} />
      ))}
    </group>
  )
}

function StarField() {
  const far = useRef()
  const near = useRef()
  const farPoints = useMemo(() => random.inSphere(new Float32Array(6000), { radius: 6.5 }), [])
  const nearPoints = useMemo(() => random.inSphere(new Float32Array(1400), { radius: 2.8 }), [])

  useFrame((_, delta) => {
    far.current.rotation.y -= delta * 0.035
    far.current.rotation.x -= delta * 0.012
    near.current.rotation.y += delta * 0.06
    near.current.rotation.z -= delta * 0.02
  })

  return (
    <group>
      <Points ref={far} positions={farPoints} stride={3} frustumCulled={false}>
        <PointMaterial transparent color="#d7c4ff" size={0.012} sizeAttenuation depthWrite={false} opacity={0.75} />
      </Points>
      <Points ref={near} positions={nearPoints} stride={3} frustumCulled={false}>
        <PointMaterial transparent color="#ffb3e6" size={0.02} sizeAttenuation depthWrite={false} opacity={0.9} />
      </Points>
    </group>
  )
}

function Core() {
  const group = useRef()

  useFrame((_, delta) => {
    group.current.rotation.y += delta * 0.28
    group.current.rotation.x += delta * 0.08
  })

  return (
    <group ref={group} scale={1.05}>
      <mesh>
        <icosahedronGeometry args={[0.72, 8]} />
        <MeshDistortMaterial
          color="#6d4aff"
          emissive="#3a1d9a"
          emissiveIntensity={0.55}
          roughness={0.15}
          metalness={0.75}
          distort={0.32}
          speed={2.2}
        />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.92, 1]} />
        <meshBasicMaterial color="#ffe1b0" wireframe transparent opacity={0.28} />
      </mesh>
    </group>
  )
}

function Rings() {
  const group = useRef()

  useFrame((_, delta) => {
    group.current.rotation.z += delta * 0.12
    group.current.rotation.x += delta * 0.05
  })

  return (
    <group ref={group}>
      <mesh rotation={[Math.PI / 2.15, 0.25, 0]}>
        <torusGeometry args={[1.35, 0.008, 16, 180]} />
        <meshBasicMaterial color="#ff9ad5" transparent opacity={0.7} />
      </mesh>
      <mesh rotation={[Math.PI / 1.7, 0.9, 0.4]}>
        <torusGeometry args={[1.62, 0.006, 16, 180]} />
        <meshBasicMaterial color="#7af0ff" transparent opacity={0.55} />
      </mesh>
      <mesh rotation={[1.1, 0.2, 1.2]}>
        <torusGeometry args={[1.9, 0.004, 12, 160]} />
        <meshBasicMaterial color="#ffd6a5" transparent opacity={0.4} />
      </mesh>
    </group>
  )
}

function Shard({ position, color, scale, speed }) {
  return (
    <Float speed={speed} rotationIntensity={1.4} floatIntensity={1.6}>
      <mesh position={position} scale={scale}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.45} metalness={0.6} roughness={0.25} />
      </mesh>
    </Float>
  )
}
