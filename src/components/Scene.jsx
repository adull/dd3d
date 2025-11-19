
import React, { useRef, useState, useMemo } from 'react'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Physics } from '@react-three/rapier'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

import {  drag } from '../helpers/drag'
import { computeLayout } from '../helpers/layout'
import { containers, characters, operators } from '../helpers/gameDef'
import Box from './Box'
import Container from './Container'
import { posArrToObj, getItemType } from '../helpers'
import { hardSet } from '../helpers/physics'

const Scene = ({ cameraPos, camRef }) => {
    const gridRef = useRef(null)
    const controlsRef = useRef(null)
    const draggingRef = useRef({ isDragging: false, item: null})
    const activeBodyRef = useRef(null)
    const activeMeshRef = useRef(null)
    const containersRef = useRef([])

    // const word = '1234'
    // const gameRef = useRef({
    //     characters: word,
    //     operators: '+-/x',
    //     solutions: ''
    // })

    // const boxes = [...characters, ...operators]
    const [boxes, setBoxes] = useState([...characters, ...operators])


    const onDragRotateCam = false

    containersRef.current = Array.from(containers, () => null)
    // console.log(containersRef.current)

    // const lowPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0,0,1), 30), [])
    const highPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0,0,1), -500), [])

    const grabItem = (bodyRef, meshRef, item) => {
        const dragging = boxes.find(box => box.id === item.id)
        console.log(dragging)
        dragging.type = 'dragging'
        draggingRef.current = { isDragging: true, isArranging: false, item, body: bodyRef, mesh: meshRef.current }
    }

    const drop = (bodyRef, meshRef, item) => {
        const { droppingOn, indexToDrop } = draggingRef.current
        
        const relevantBoxes = boxes.filter(box => box.currentContainer === droppingOn)
        console.log({containers, droppingOn})
        const height = containers.find(item => item.name === droppingOn).pos[1]
        const layout = computeLayout({count: relevantBoxes.length, height })
        let pos = layout[indexToDrop]
        if(!pos) pos = posArrToObj([0,height,30])
        console.log(pos )
        hardSet(bodyRef.current, pos)
        item.type = getItemType(item.val)
        item.currentContainer = droppingOn
        draggingRef.current = {isDragging: false, item: null }

        // bodyRef.current.setTranslation(pos)
        // console.log(draggingRef.current)
        // draggingRef.current.body = null
    }

    const updateBoxes = (newBoxes) => {
        const mapped = newBoxes.map(item => item.id)
        const oldBoxes = boxes.filter(box => !mapped.includes(box.id))
        const updatedBoxes = [...newBoxes, ...oldBoxes]
        console.log(`umm`)
        console.log({ updatedBoxes})
        setBoxes(updatedBoxes)
    }

    useFrame(({ scene, mouse, camera, raycaster, pointer, viewport}) => {
        const {isDragging, body, mesh,  isArranging } = draggingRef.current
        if(isDragging) {
            // dragLoop({ })
            if(body) {
                drag({ body, raycaster, plane: highPlane })
            }
        } else if(isArranging && body) {
            // console.log(mesh)
            // mesh.
            // body.setTranslation({})
            // const body = draggingRef.current.body
            // drag({ body, raycaster, plane: lowPlane })
            // console.log(body)
            // const layout = boxes
            // const test = body.current.translation()
            // console.log(boxe)
            // const myBoxes = 
            // test.z = 30
            // body.current.setTranslation()

            // body.current.setTranslation([0,0,-30])
            draggingRef.current = {...draggingRef.current, isDragging: false, isArranging: false }
        // body.trans
        }
    })

    return (
        <>
            <PerspectiveCamera makeDefault position={cameraPos} ref={camRef}/>
            <directionalLight color="white" position={[0, 0, 5]} />
            <directionalLight color="white" position={[5, 5, 0]} />
            <Physics >
                { containers.map((container, i) => (
                    <Container 
                    key={i} 
                    ref={containersRef[i]} 
                    draggingRef={draggingRef}
                    name={container.name} 
                    initPos={container.pos} 
                    boxes={boxes.filter(box => box.type === container.name)} 
                    updateBoxes={updateBoxes} />
                ))}
                <>
                    { boxes.map(item => { 
                        // console.log(instructionRef.current); 
                        return (
                            <Box 
                            key={item.id} 
                            item={item} 
                            mouseDown={grabItem} 
                            mouseUp={drop}
                            draggingRef={draggingRef} />
                        )
                    }) }
                </>
                
            </Physics>
            
            <OrbitControls enableRotate={onDragRotateCam} enablePan={onDragRotateCam} ref={controlsRef} makeDefault />
            <gridHelper
                ref={gridRef}
                args={[10000, 100, '#000000', '#cccccc']}
                position={[0, 0, 0]}
                rotation={[Math.PI/2,0,0]}
            />
        </>
    );
}

export default React.memo(Scene);
