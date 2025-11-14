import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody } from '@react-three/rapier'
import * as THREE from 'three'

const BoxComponent = ({ item, gravity, mouseDown, dragSignal }) => {
    const  meshRef = useRef()
    const bodyRef = useRef()

    console.log(item)

    useFrame(() => {
        const signal = dragSignal.current
        // console.log({signal})
        
        if(signal?.name === item.currentContainer && item.id !== signal.currBox) {
            // console.log({ item })
            const body = bodyRef.current
            const curr = body.translation()

            const isBefore = item.index > signal.hoveredIndex

            const { x: bx, y: by, z: bz } = bodyRef.current.translation()

            const offset = isBefore ? -0.5 : 0.5

            // const targetX = bx + offset;
            // const targetY = by + offset
            const targetZ = bz + offset


            // const newX = THREE.MathUtils.lerp(curr.x, targetX, 0.1)
            
            // const dx = targetX - curr.x;
            // const dy = targetY - curr.y
            const dz = targetZ - curr.z
            // body.setLinvel({ x: 0, y: 400 * dy, z: 0 });
            body.setLinvel({ x: 0, y: 0, z: 40 * dz });




            // body.setNextKinematicTranslation(newPos);




        }
    })

    const onMouseDown = () => {
        mouseDown(bodyRef, meshRef, item)
    }

    const hasGravity = gravity ? 1 : 0
    return (
            <RigidBody ref={bodyRef}  linearDamping={0} canSleep position={ item.pos ?? [0,500,0] } colliders={"cuboid"} gravityScale={hasGravity}>
                <mesh ref={meshRef} onPointerDown={onMouseDown} >
                    <boxGeometry args={[50,5,50]} />
                    <meshStandardMaterial color="blue" />
                </mesh>
            </RigidBody>
    );
}

export default BoxComponent;
