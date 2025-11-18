import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody } from '@react-three/rapier'
import * as THREE from 'three'
import { Text3D } from '@react-three/drei'
import helvetiker from '../assets/helvetiker_regular.typeface.json'

const Box = ({ item, mouseDown, mouseUp, draggingRef }) => {
    // console.log(boxes )
    const  meshRef = useRef()
    const bodyRef = useRef()

    const colliderRef = useRef(`cuboid`)
    const itemPosition = useRef(item.pos ? item.pos : [0,0,0])


    useEffect(() => {
        if(item.id !== draggingRef.current.item?.id) {
            itemPosition.current = item.pos
        }
    },[draggingRef, item])

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

    const typeOptions = {size: 20, height: 2}

    return (
            <RigidBody ref={bodyRef}  linearDamping={0} canSleep position={ item.pos } colliders={colliderRef.current} gravityScale={0}>
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

export default Box;
