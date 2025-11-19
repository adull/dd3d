import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody } from '@react-three/rapier'
import { computeLayout } from '../helpers/layout'
import { canDrop } from '../helpers/drag'
import { isOperator, getItemType } from '../helpers'


const Container = ({ initPos, name, draggingRef, boxes, updateBoxes }) => {
    const  meshRef = useRef()
    const bodyRef = useRef()
    console.log(boxes)

    const layout = useRef([])
    const hoverPosition = useRef(-1)

    useEffect(() => {
        console.log(`container gets reset`)
    }, [])

    useFrame(() => {
        // if(meshRef.current) {
        //     meshRef.current.rotation.z += 0.01
        // }
    })

    const getIndex = (e) => {
        if(!draggingRef.current.isDragging) {
            // hoverPosition.current = -1
            return
        }
        console.log(`this parts ok`)
        // console.log(draggingRef.current)
        const { item } = draggingRef.current
        const itemType = getItemType(item.val)
        if(!canDrop(itemType, name )) return
        
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
