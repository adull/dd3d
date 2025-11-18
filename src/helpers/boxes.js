import { v4 as uuidv4 } from 'uuid'
import { computeLayout } from './layout'

const createBoxes = ({ array, container }) => {
    const height = container.pos[1]
    const width = 500
    // const padding = 40

    const layout = computeLayout({
        count: array.length,
        width,
        padding: 40,
        height
    })
    
    return array.map((item, index) => {
        const p = layout[index]

        return {
            val: item,
            index,
            id: uuidv4(),
            type: container.name,
            mode: 'dropped',
            currentContainer: container.name,
            pos: [p.x, p.y, p.z],
        }
    })
}

export { createBoxes }