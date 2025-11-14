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
        if(signal?.name === item.currentContainer) {
            // console.log({ item })
            const body = bodyRef.current
            const curr = body.translation()

            const isBefore = item.index < signal.draggedIndex

            const { x: bx } = bodyRef.current.translation()

            const offset = isBefore ? -0.5 : 0.5

            const targetX = bx + offset;

            const newX = THREE.MathUtils.lerp(curr.x, targetX, 0.1)
            const newPos = { x: newX, y: curr.y, z: curr.z }

            body.setNextKinematicTranslation(newPos);




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
