
import React, { useRef, useState, useMemo } from 'react'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Physics } from '@react-three/rapier'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

import { dragLoop, ezDrag } from '../helpers/drag'
import { computeLayout } from '../helpers/layout'
import { containers, characters, operators } from '../helpers/gameDef'
import BoxComponent from './BoxComponent'
import Container from './Container'

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

    const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0,0,1), -500), [])

    const grabItem = (bodyRef, meshRef, item) => {
        const dragging = boxes.find(box => box.id === item.id)
        console.log(dragging)
        dragging.type = 'dragging'
        draggingRef.current = { isDragging: true, isArranging: false, item, body: bodyRef.current, mesh: meshRef.current }
    }

    const drop = (bodyRef, meshRef, item) => {
        // console.log(`drop`)
        draggingRef.current = {isDragging: false, isArranging: true, item: null, body: null, mesh: null}
        draggingRef.current.body = null
    }

    const updateFn = ({ containerName, oldIndex, newIndex }) => {
        
    }

    const updateBoxes = (newBoxes) => {
        // console.log(pBoxes)
        const mapped = newBoxes.map(item => item.id)
        // console.log(mapped)
        const oldBoxes = boxes.filter(box => !mapped.includes(box.id))
        // console.log([...newBoxes, ...oldBoxes ])
        // setBoxes([...newBoxes, ...oldBoxes])
        const lol = [...newBoxes, ...oldBoxes]
        // console.log({lol})
        // console.log({ boxes})
        setBoxes(lol)
    }

    useFrame(({ scene, mouse, camera, raycaster, pointer, viewport}) => {
        if(draggingRef.current.isDragging) {
            // dragLoop({ })
            const body = draggingRef.current.body
            if(body) {
                ezDrag({ body, raycaster, plane })
            }
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
                    boxes={boxes.filter(item => item.type === container.name)} 
                    updateBoxes={updateBoxes} />
                ))}
                <>
                    { boxes.map(item => { 
                        // console.log(instructionRef.current); 
                        return (
                            <BoxComponent 
                            key={item.id} 
                            item={item} 
                            mouseDown={grabItem} 
                            mouseUp={drop}
                            goTo={null}/>
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
