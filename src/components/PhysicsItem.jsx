import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

import { Text3D } from '@react-three/drei'
import { RigidBody } from "@react-three/rapier"
import helvetica from '../assets/helvetiker_regular.typeface.json'
import { SPRING_D, SPRING_K} from '../const'


const PhysicsItem = ({ id, val, getTarget, position, dragging, onDragStart, onDragEnd }) => {
    // console.log(position)
    const initPos = [...position]
    initPos[2] = 10
    const body = useRef()

    useFrame(({mouse, camera, viewport}) => {
        if (!body.current) return;

        if (dragging.current === id) {
          // convert cursor to world space
          const x = (mouse.x * viewport.width) / 2;
          const y = (mouse.y * viewport.height) / 2;
    
          body.current.setTranslation({ x, y, z: 0 }, true);
          body.current.setLinvel({ x: 0, y: 0, z: 0 });
          return;
        }

        // const target = getTarget(id);
        // const pos = body.current.translation();
        // const vel = body.current.linvel();

        // const fx = (target[0] - pos.x) * SPRING_K - vel.x * SPRING_D;
        // const fy = (target[1] - pos.y) * SPRING_K - vel.y * SPRING_D;

        // body.current.applyImpulse({ x: fx, y: fy, z: 0 }, true);

    })
    return (
        <RigidBody
            ref={body}
            gravityScale={0}
            type="dynamic"
            colliders="cuboid"
            onPointerDown={(e) => {
                e.stopPropagation()
                dragging.current = id
                // onDragStart(id)
                console.log(id)
            }}
            onPointerUp={(e) => {
                // const pt = e.target
                console.log(e)
                dragging.current = null
            }}
        >
            
            <mesh position={initPos}>
                <boxGeometry args={[40, 40, 10]} />
                <meshStandardMaterial color="skyblue" />
            </mesh>
            <Text3D font={helvetica} position={[0,0,10]} size={12} height={2}>
                {val}
            </Text3D>

        </RigidBody>
    )
}

export default PhysicsItem