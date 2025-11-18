import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody } from '@react-three/rapier'
import { computeLayout } from '../helpers/layout'
import { canDrop } from '../helpers/drag'


const Container = ({ initPos, name, draggingRef, boxes, updateBoxes }) => {
    const  meshRef = useRef()
    const bodyRef = useRef()

    const layout = useRef([])
    const hoverPosition = useRef(-1)

    useFrame(() => {
        // if(meshRef.current) {
        //     meshRef.current.rotation.z += 0.01
        // }
    })

    const getIndex = (e) => {
        if(!draggingRef.current.isDragging) return
        const draggingType = draggingRef.current.item?.type
        
        const height = initPos[1]
        const layout = computeLayout({ count: boxes.length + 1, height})

        const x = e.point.x
        const xs = layout.map(item => item.x)
        
        let index = 0 
        for(let i = 0; i < xs.length; i ++) { 
            if(x > xs[i]) { 
                index++ 
            } else if(x < xs[i]) { 
                index = i
                 break 
            } 
            if (i === xs.length - 1) { 
                index = xs.length - 1 
                break 
            } 
        }



        if(hoverPosition.current !== index) {
            // console.log({ layout })
            hoverPosition.current = index
            layout.splice(index, 1)
            boxes.forEach((item, i) => {
                item.pos = [layout[i].x, layout[i].y, layout[i].z]
            })

            console.log(`update boxes `)
            draggingRef.current.indexToDrop = index
            draggingRef.current.droppingOn = name
            updateBoxes(boxes)
        }
    }



    return (
        
        <RigidBody ref={bodyRef} gravityScale={0} type="fixed" position={initPos} >
            <mesh ref={meshRef} name={`container--${name}`} onPointerDown={() => {}} onPointerMove={getIndex}>
                <boxGeometry args={[1000,100,15]}/>
                <meshStandardMaterial color="orange" />
            </mesh>
        </RigidBody>
    );
}

export default Container;
