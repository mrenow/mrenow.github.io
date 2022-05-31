import { ref } from 'vue'

console.log(ref('')['get value'])

export let a = 1
export function f () {
    a += 1
}
console.log('test1:', a)
f()
console.log('test2:', a)
