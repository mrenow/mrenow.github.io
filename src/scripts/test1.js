import { a, f } from './test2'
import { loadPost } from './network'
import { ref } from 'vue'

export function test1 () {
    console.log(Object.getPrototypeOf(ref('')))
    console.log(Object.getPrototypeOf(ref('')).value)
}
export async function test2 () {
    try {
        const text = await loadPost('')
        console.log(text)
    } catch (err) {
        console.log(err)
    }
}
