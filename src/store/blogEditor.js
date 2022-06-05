import { defineStore } from 'pinia'
import { loadPost } from '../scripts/network'
/*
Intialize: title

Mutate/expose: doAutosave,

expose: isSaving, textMutated, content, resources 
*/

// represents all the data needed for a blog post 
export const useBlogEditor = defineStore('BlogEditor', {
    state: () => ({
        title: '',
        content: '',
        resources: [],
        textMutated: 0,
        saveable: false
    }),

    actions:{
        async swapTitle(title){
            try {
                ({ content, resources } = await loadPost(title))
            } catch (err) {
                console.log(err)
                if (err.message === NO_POST_ERR) {
                    content = ''
                } else {
                    throw err
                }
            }

        },

    }

})