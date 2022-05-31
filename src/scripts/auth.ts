import { supabase } from '../supabase'
import { reactive, ref } from 'vue'
import { bindLoadingFlag } from './helpers'

const _initAuthData = {
    authenticated: false,
    error: null,
    user: null,
    session: null
}

export const authData :{
    authenticated: boolean,
    error: object,
    user: object,
    session: object
} = reactive({ ..._initAuthData })

const _initProfileData = {
    id: null,
    handle: null
}

export const profileData : {
    id? : string;
    handle?: string;
} = reactive({ ..._initProfileData })

export const authLoading = ref(true)
export async function logIn (userEmail = null, password = null, persist = null) {
    // Check if logged in
    if (authData.authenticated) {
        return
    }
    // Check localStorage for username and password
    userEmail = userEmail ?? localStorage.getItem('userEmail')
    password = password ?? localStorage.getItem('password')
    if (userEmail === undefined || password === undefined) {
        authData.authenticated = false
        return
    }
    const { user, session, error } = await supabase.auth.signIn({ email: userEmail, password })
    if (error) {
        Object.assign(authData, { authenticated: false, error })
        return
    }
    // On success
    Object.assign(profileData, (await supabase.from('user_data').select('*').eq('id', user.id)).data[0])
    Object.assign(authData, { authenticated: true, user, session })
    // Store credentials indefinitely until logout

    console.log('Logged in')
    if (persist) {
        localStorage.setItem('userEmail', userEmail)
        localStorage.setItem('password', password)
        console.log('Details saved locally')
    }
}

export async function logOut () {
    localStorage.setItem('userEmail', undefined)
    localStorage.setItem('password', undefined)
    console.log('logging out...')
    await supabase.auth.signOut()
    Object.assign(authData, _initAuthData)
    Object.assign(profileData, _initProfileData)
    console.log(_initAuthData, _initProfileData)

    console.log('logged out.')
}
// attempt login using remembered information

await bindLoadingFlag(logIn(), authLoading)
console.log(authData)

console.log(profileData)
// logOut()
