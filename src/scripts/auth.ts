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

bindLoadingFlag(logIn(), authLoading).then(() => {
    console.log(authData)
    console.log(profileData)
})
// logOut()
