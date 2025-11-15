import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody } from '@react-three/rapier'
import * as THREE from 'three'

const BoxComponent = ({ item, mouseDown, isAsleep, instructionRef }) => {
    const  meshRef = useRef()
    const bodyRef = useRef()

    useFrame(() => {
        const inst = instructionRef.current[item.id]
        if (!inst?.sleep) {
          const body = bodyRef.current
          const curr = body.translation()
      
          const targetX = inst.goTo[0]
      
          const stiffness = 20
          const damping = 3
      
          const dx = targetX - curr.x
          const vx = body.linvel().x
      
          // Spring formula: F = kx - dv
          const force = dx * stiffness - vx * damping
      
          body.applyImpulse({ x: force * 0.6, y: 0, z: 0 }, true)
        }
      })

    const onMouseDown = () => {
        mouseDown(bodyRef, meshRef, item)
    }

    return (
            <RigidBody ref={bodyRef}  linearDamping={0} canSleep position={ item.pos ?? [0,500,0] } colliders={"cuboid"} gravityScale={0}>
                <mesh ref={meshRef} onPointerDown={onMouseDown} >
                    <boxGeometry args={[50,50,5]} />
                    <meshStandardMaterial color="blue" />
                </mesh>
            </RigidBody>
    );
}

export default BoxComponent;
