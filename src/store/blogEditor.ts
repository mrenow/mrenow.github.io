import { defineStore } from 'pinia'
import { loadPost, NoPostException} from '../scripts/network'
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
        // invalidate save state whenever the title is changed
        // clean and load 
        async changePost(newTitle: string){
            if (newTitle === this.title) return
            const oldSaveable = this.saveable
            this.saveable = false
            // load post
            try{
                let data : {content: string, resources: string[]}
                try {
                    data = await loadPost(newTitle)
                } catch (err) {
                    console.log(err)
                    if (err instanceof NoPostException) data = {content: '', resources: []}
                    else throw err
                }
                await overwriteText(data.content)
                title.value = newTitle
                saveable.value = true
            } catch (err) {
                console.error('Something went wrong when loading the post:', err)
                saveable.value = oldSaveable
            }
}


    }

})