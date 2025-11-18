import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody } from '@react-three/rapier'
import * as THREE from 'three'
import { Text3D } from '@react-three/drei'
import helvetiker from '../assets/helvetiker_regular.typeface.json'

const BoxComponent = ({ item, mouseDown, mouseUp, goTo }) => {
    const  meshRef = useRef()
    const bodyRef = useRef()

    const colliderRef = useRef(`cuboid`)

    let index = 0
    
    // console.log({ myBox })
    // useEffect(() => {
    //     console.log(item.pos)
    // },[item])

    const onMouseDown = () => {
        mouseDown(bodyRef, meshRef, item)
    }

    const onMouseUp = () => {
        mouseUp(bodyRef, meshRef, item)
    }

    const hmm = (e) => {
        // console.log(e)
        // console.log(`enter`)
    }
    console.log(item.pos)

    const typeOptions = {size: 20, height: 2}

    return (
            <RigidBody ref={bodyRef}  linearDamping={0} canSleep position={ item.pos ?? [0,500,0] } colliders={colliderRef.current} gravityScale={0}>
                <group ref={meshRef} onPointerDown={onMouseDown} onPointerEnter={hmm} onPointerUp={onMouseUp}>
                    <mesh>
                        <boxGeometry args={[50,50,5]} />
                        <meshStandardMaterial color="blue" />
                    </mesh>
                    <Text3D font={helvetiker} position={[10,0, 5]} {...typeOptions}>{item.val}</Text3D>
                </group>
                
            </RigidBody>
            
    );
}

export default BoxComponent;
