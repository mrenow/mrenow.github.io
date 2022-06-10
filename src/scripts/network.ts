import { authData, profileData } from './auth'
import { supabase } from '../supabase'

const requestLocks = {
    loadPost: 0,
    loadTitles: 0,
    submitPost: 0
}
const LOCK_TIME = 5000
const REQ_MAXIMUM = {
    loadPost: 10,
    loadTitles: 10,
    submitPost: 3
}

export class NoPostException extends Error{
    constructor(name){
        super(`No post with given name ${name} exists`)
    }
}

export const TOO_MANY_REQS_ERR = 'Requests are too frequent!'

function requestLock (requestId) {
    if (requestLocks[requestId] < REQ_MAXIMUM[requestId]) {
        requestLocks[requestId] += 1
        setTimeout(() => { requestLocks[requestId] -= 1 }, 5000)
    } else {
        throw Error(TOO_MANY_REQS_ERR)
    }
}

export async function loadPost (titleText: string) {
    requestLock('loadPost')
    // Load post from database
    const { data, error }  = await supabase
        .from('posts')
        .select('content, modified')
        .eq('title', titleText)
    if (error) throw error
    if (data.length === 0) return null
    return {
        title: titleText,
        content: data[0].content as string,
        resources: [] as string[],
        modified: new Date(data[0].modified as string)
    }
}

export async function loadTitles () {
    requestLock('loadTitles')
    const { data, error } = await supabase
        .from('posts')
        .select('title')
    if (error) throw error
    return data.map(({ title }) => title)
}

export async function submitPost (title: string, content: string) {
    requestLock('submitPost')
    if (!authData.authenticated) {
        console.error('Cant submit, not authenticated')
        return
    }
    const { error, data } = await supabase
        .from('posts')
        .upsert({
            title: title,
            content: content,
            owner: profileData.id,
            modified: new Date().toISOString()
        })
    if (error) throw error
    console.log(data)
    return data
}
