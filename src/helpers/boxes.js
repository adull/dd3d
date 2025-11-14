import { v4 as uuidv4 } from 'uuid'

const createBoxes = ({ array, container }) => {
    const height = container.pos[0]
    const width = 500
    const x = width * -1 / 2
    const increment = (width) / (array.length - 1)
    return array.map((item, index) => {
        return {
            item,
            index,
            pos: [height, 0, x + (index * increment)],
            id: uuidv4(),
            type: container.name,
            currentContainer: container.name
        }
    })
}

export { createBoxes }