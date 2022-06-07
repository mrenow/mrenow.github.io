import { start } from "repl"

export function bindValidFlag <T> (promise: Promise<T>, obj: object, property = 'value') {
    obj[property] = false
    promise.then(function () { obj[property] = true })
    promise.catch(function () { obj[property] = false })
    return promise
}

export function bindLoadingFlag <T> (promise: Promise<T>, obj: object, property = 'value') {
    obj[property] = true
    promise.then(function () { obj[property] = false })
    promise.catch(function () { obj[property] = false })
    return promise
}

export const range = (start, stop, step=1) => Array.from({length: (stop-start)/step}, (_,i) => start + i*step)

export const consolelog = (...x)=>{console.log(...x); return undefined}