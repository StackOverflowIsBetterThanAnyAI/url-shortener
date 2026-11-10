import { randomInt } from 'node:crypto'

const ALPHABET =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

export const generateKey = () => {
    let key = ''
    for (let i = 0; i < 6; i++) {
        key += ALPHABET[randomInt(ALPHABET.length)]
    }
    return key
}
