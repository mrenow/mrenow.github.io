import { start } from "repl"
import { json } from "stream/consumers"

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

export const storage = new Proxy({} as {[key: string]: any}, {
    get(target, prop){
        const typeString = JSON.parse(localStorage['storage__types___' + (prop as string)])
        return restoreTypes(JSON.parse(localStorage[prop as string]), typeString)
    },
    set(target, prop, value){
        let types = {}
        for (const key in value) {
            types[key] = Object.prototype.toString.call(value[key]).slice(8,-1)
            types[key] = "Object"
        }
        localStorage['storage__types___' + (prop as string)] = JSON.stringify(getTypeString(value))
        localStorage[prop as string] = JSON.stringify(value)  
        return true
    }
})
function getTypeString(obj:any): string | {[key:string]:any}{
    const type = Object.prototype.toString.call(obj).slice(8,-1)
    let types: any
    if (type === 'Object'){
        types = {}
    } else if (type === 'Array') {
        types = []
    } else {
        return type
    }
    for (const key in obj as {[key:string]:any}){
        types[key] = getTypeString(obj[key])
    }
    return types
}
function restoreTypes(objJson: any | {[key:string]:any}, typeString: any | {[key:string]:any}){
    if (typeof typeString === 'string'){
        console.log(typeString, objJson, typeString)
        return new window[typeString as string](objJson)
    }
    let obj: any
    for (const key in typeString){
        if (key.match(/\d+/)){
            obj = []
        }else{
            obj = {}
        }
        break
    }
    for (const key in objJson as {[key:string]:any}){
        obj[key] = restoreTypes(objJson[key], typeString[key])
    }
    return obj
}