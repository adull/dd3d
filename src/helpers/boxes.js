import { v4 as uuidv4 } from 'uuid'
import { computeLayout } from './layout'

const createBoxes = ({ array, container }) => {
    console.log(container.pos)
    const height = container.pos[1]
    console.log({ height })
    const width = 500
    const padding = 40

    const layout = computeLayout({
        count: array.length,
        width,
        padding,
        height
    })
    
    return array.map((item, index) => {
        const p = layout[index]

        return {
            item,
            index,
            id: uuidv4(),
            type: container.name,
            currentCountainer: container.name,
            pos: [p.x, p.y, p.z],
        }
    })
}

export { createBoxes }