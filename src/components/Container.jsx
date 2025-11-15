import { forwardRef } from 'react'

const Container = forwardRef(({ pos, name }, ref) => {
    console.log(ref)
    return (
        <mesh ref={ref} name={`container--${name}`} position={pos}>
            <boxGeometry args={[1000,100,15]}/>
            <meshStandardMaterial color="orange" />
        </mesh>
    );
})

export default Container;
