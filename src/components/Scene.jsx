
import React, { useRef, useEffect, useMemo } from 'react'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Physics } from '@react-three/rapier'

// import { dragLoop } from '../helpers/drag'
import { computeLayout } from '../helpers/layout'
// import { createBoxes } from '../helpers/boxes'
import { containerDims } from '../helpers/container'
import BoxComponent from './BoxComponent'
import PhysicsItem from './PhysicsItem'
import Container from './Container'

const Scene = ({ cameraPos, camRef }) => {
    const gridRef = useRef(null)
    const controlsRef = useRef(null)

    const dragging = useRef(-1)
    const controls = false
    const game = useRef({
        characters: [..."1234"],
        operators:[..."+-/x"],
        solutions: []
    })

    const containers = [
        { name: "characters", size: containerDims, pos: [0,500,0]},
        { name: "operators", size: containerDims, pos: [0,0,0]},
        { name: "solutions", size: containerDims, pos: [0,-500,0]}
    ]
    const containersRef = useRef([])

    const ids = useMemo(() => {
        let counter = 1
        const make = (val, container) => ({
            id: counter++,
            val,
            container
        })

        return [
            ...game.current.characters.map(c => make(c, "characters")),
            ...game.current.operators.map(o => make(o, "operators"))

        ]
    }, [])

    

    console.log({ ids})

    const targets = useRef({})

    const createLayout = (name, containers) => {
        return computeLayout({
            count: ids.filter(i => i.container === name).length, 
            y: containers.find(item => item.name === name).pos[1]
        })
    }

    const recomputeTargets = () => {
        const charLayout = createLayout("characters", containers)
        const opLayout = createLayout("operators", containers)
        const solLayout = createLayout("solutions", containers)

        let ci = 0, oi = 0, si = 0;
        // console.log({ charLayout, opLayout, solLayout})
        ids.forEach(item => {
            if(item.container === "characters")  targets.current[item.id] = charLayout[ci++]
            else if(item.container === "operators")  targets.current[item.id] = opLayout[oi++]
            else if(item.container === "solutions")  targets.current[item.id] = solLayout[si++]
        })
    }
    const assignContainerRef = index => el => {
        containersRef.current[index] = el || null
    }

    recomputeTargets()

    const getTarget = (id) => targets.current[id]

    const getContainer = (name) => containers.find(item => item.name === name)
    const onDragStart = (id) => {}

    const onDragEnd = ({ id, cursorPos }) => {
        const item = ids.find(i => i.id = id) 
        const cursorY = cursorPos.y

        containersRef.current.forEach(c => {
            console.log(c)
        })

        item.container = 'solutions'

        recomputeTargets()


    }
    console.log({ targets })

    useEffect(() => {
        console.log(containersRef.current)
    }, [containersRef])

    return (
        <>
            <PerspectiveCamera makeDefault position={cameraPos} ref={camRef}/>
            <directionalLight color="white" position={[0, 0, 5]} />
            <directionalLight color="white" position={[5, 5, 0]} />
            <Physics >
                { containers.map((container, i) => (
                    <Container key={i} ref={assignContainerRef(i)} name={container.name} pos={container.pos} />
                ))}

                { ids.map(item => (
                    <PhysicsItem 
                        key={item.id}
                        id={item.id}
                        val={item.val}
                        position={targets.current[item.id]}
                        getTarget={getTarget}
                        dragging={dragging}
                        onDragStart={onDragStart}
                        oinDragEnd={onDragEnd}
                    />
                ))}
                
            </Physics>
            
            <OrbitControls enableRotate={controls} enablePan={controls} ref={controlsRef} makeDefault />
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
