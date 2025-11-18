import { createBoxes } from '../helpers/boxes'

const createWord = () => 'test'

// all the game definition stuff goes in here. this is for init logic

const containers = [
    { name: `characters`, pos: [0,500,0], color: `white`},
    { name: `operators`, pos: [0,0,0], color: `white` },
    { name: `solutions`, pos: [0,-500,0], color: `white`}
] 

const characters = createBoxes({
    array: createWord().split(''),
    container: containers.find(item => item.name === `characters`)
})
const operators = createBoxes({
    array: '+-/x'.split(''),
    container: containers.find(item => item.name === `operators`)
})

export { containers, characters, operators }