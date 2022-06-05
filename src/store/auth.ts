import { defineStore } from 'pinia'
import { Ref, ref } from 'vue'
import { supabase } from '../supabase'
const useAuth = defineStore('Auth', () => {
    const authenticated = ref() 
    const error = ref({})
    const user = ref({})
    const session = ref({})
    
    const profile = ref({
        id : null,
        handle : null
    }) as Ref<{id:string, handle: string}>

    async function logIn (userEmail = null, password = null, persist = null) {
        // Check if logged in
        if (authenticated.value) {
            return
        }
        // Check localStorage for username and password
        userEmail = userEmail ?? localStorage.getItem('userEmail')
        password = password ?? localStorage.getItem('password')
        if (userEmail === undefined || password === undefined) {
            authenticated.value = false
            return
        }
        const { user: u, session: s, error: e } = await supabase.auth.signIn({ email: userEmail, password })
        if (e) {
            authenticated.value = false
            error.value = e
            user.value = null
            session.value = null
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
    

},
{persist : true})