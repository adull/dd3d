import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text3D } from '@react-three/drei'
import helvetiker from '../assets/helvetiker_regular.typeface.json'

const BoxComponent = ({ item, mouseDown, instructionRef }) => {
    const  meshRef = useRef()

    useFrame(() => {
        const inst = instructionRef.current[item.id]
        if (!inst?.sleep) {
            const [x, y, z] = inst.goTo
            const body = meshRef.current

            // console.log({ x, y ,z })

            body.setTranslation({ x, y, z }, true)

        }
    })

    const onMouseDown = () => {
        mouseDown(meshRef, item)
    }

    const typeOptions = {size: 20, height: 2}
    // console.log(item )

    return (
        <group ref={meshRef} onPointerDown={onMouseDown} position={item.pos}>
            <mesh >
                <boxGeometry args={[50,50,5]} />
                <meshStandardMaterial color="blue" />
            </mesh>
            <Text3D font={helvetiker} position={[10,0, 5]} {...typeOptions}>{item.val}</Text3D>
        </group>
    );
}

export default BoxComponent;
