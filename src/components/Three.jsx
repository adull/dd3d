import { useRef, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Physics } from '@react-three/rapier'

import { getSavedCamPos } from '../helpers'

import BoxComponent from './BoxComponent'
import CameraHelperButtons from './CameraHelperButtons'


const Three = () => {
    const [height, setHeight] = useState(0)
    const camRef = useRef(null)
    const gridRef = useRef(null)
    const controlsRef = useRef(null)

    const domRef = useRef(null)
    
    const domId = `canvasContainer`

    const savedCamPos = getSavedCamPos()
    console.log({ savedCamPos})
    const cp = JSON.parse(getSavedCamPos())
    
    const cameraPos = [cp.x,cp.y,cp.z]

    useEffect(() => {
        const el = domRef.current
        const parent = el

        const parentHeight = parent.clientHeight
        const parentChildren = Array.from(parent.childNodes)

        const domIndex = Array.from(parentChildren).findIndex(item => item.id === domId)
        let nonCanvasHeight = 0
        parentChildren.forEach((item, index) => {
            if(index !== domIndex) {
                nonCanvasHeight += item.clientHeight
            }
        })
        
        setHeight(parentHeight - nonCanvasHeight)
    }, [])

    return (
        <div className="w-full h-full" ref={domRef}>
            <Canvas className="h-full" style={{height}}>
                <PerspectiveCamera makeDefault position={cameraPos} ref={camRef}/>
                <directionalLight color="white" position={[0, 0, 5]} />
                <directionalLight color="white" position={[0, 5, 0]} />
                <Physics gravity={[0, -90.81, 0]}>
                    <BoxComponent gravity={true} />
                    <BoxComponent gravity={false} initPos={[0,-5,0]} />
                    <BoxComponent gravity={false} initPos={[20,0,0]} />
                </Physics>
                
                <OrbitControls ref={controlsRef} makeDefault />
                <gridHelper
                    ref={gridRef}
                    args={[10000, 100, '#000000', '#cccccc']}
                    position={[0, 0, 0]}
                    rotation={[0, -Math.PI / 2, 0]}
                    />
            </Canvas>
            <CameraHelperButtons enabled={['getCurrentCamPos', 'updateSavedCamPos']} camRef={camRef} />
        </div>
    );
    }

export default Three;
