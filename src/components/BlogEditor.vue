
<script setup lang="ts">
import { time } from 'console';
import { type } from 'os';
import { ref, toRef, onMounted, readonly, reactive } from 'vue'
import { bindLoadingFlag, storage } from '../scripts/helpers'
import { loadPost, NoPostException, submitPost } from '../scripts/network'
/* state management:
use a blogeditor textarea component: this way no bindings need to be done.
We can ensure state integrity by ensuring the invariants:

A state is [saveble] if its [content] has been loaded from the currently active [title]
textMutated !== 0 if the content are has been edited on a saveable state


Intialize: title

Mutate/expose: doAutosave,

expose: isSaving, textMutated, content, resources 

*/


interface editDataType {
    title: string,
    content: string,
    resources: string[],
    saveable: boolean,
    textMutated: 0,
    modified: Date,
}

// disable the page while this loads
const blogEditData = reactive({
        title: '',
        content: '',
        resources: [],
        saveable: false,
        textMutated: 0,
        modified: new Date()
        })
const isSaving = ref(false)
const editArea = ref(null)

loadblogEditData()

async function loadblogEditData(){
    // Want to check if the database contents are newer than the last commit.
    let oldData
    try{
        oldData = storage.blogEditData as editDataType
    } catch(err){
        storage.blogEditData = undefined
    }
    console.log('oldData', oldData)
    if (!oldData) return
    if (oldData.title !== ''){
        const serverData = await loadPost(oldData.title)
        if (serverData){
            console.log(serverData.modified, oldData.modified)
            if(serverData.modified > oldData.modified){
            Object.assign(blogEditData, serverData)
            console.log('rejected', serverData)
            return
            }      
        }  
    }
    Object.assign(blogEditData, oldData)
    console.log('accepted', oldData)
}


// invalidate save state whenever the title is changed
// clean and load 
async function changePost(newTitle: string){
    if (newTitle === blogEditData.title) return
    const oldSaveable = blogEditData.saveable
    blogEditData.saveable = false
    // load post
    try{
        let data : {title:string, content: string, resources: string[], modified: Date}
        data = (await loadPost(newTitle)) ?? {title: '', content: '', resources: [], modified: new Date()}
        await overwriteText(data.content)
        blogEditData.title = newTitle
        blogEditData.saveable = true
        storeData()
    } catch (err) {
        console.error('Something went wrong when loading the post:', err)
        blogEditData.saveable = oldSaveable
    }
}


async function overwriteText(text: string){
    console.log(blogEditData.textMutated)
    if (blogEditData.textMutated !== 0 && confirm("Save unsaved changes?") && !(await save())) throw new Error('Save Failure')
    insertText(text, 0, editArea.value.value.length)
    blogEditData.textMutated = 0
}

async function save(){
    console.log('saving...')
    try{
        const accountedMutations = blogEditData.textMutated
        const data = await bindLoadingFlag(submitPost(blogEditData.title, blogEditData.content), isSaving)
        console.log('saved.')
        blogEditData.textMutated -= accountedMutations
        blogEditData.modified = new Date()
        return true
    } catch (err) {
        console.log('save failed.')
        console.log(err)
        return false
    }
}


function insertText (text: string, start: number = null, end: number = null) {
    editArea.value.focus()
    console.log(editArea.value.focus)
    if (start !== null) editArea.value.selectionStart = start
    if (end !== null) editArea.value.selectionEnd = end
    document.execCommand('insertText', false, text)
    storeData()
}

const exposeVars = {
    changePost,
    save,
    isSaving: readonly(isSaving),
    saveable: readonly(toRef(blogEditData, 'saveable')),
    textMutated: readonly(toRef(blogEditData, 'textMutated')),
    title: readonly(toRef(blogEditData, 'title')),
    content: readonly(toRef(blogEditData, 'content')),
    resources: readonly(toRef(blogEditData, 'resources'))
}
function storeData(){
    storage.blogEditData = blogEditData
}

defineExpose(exposeVars)


onMounted(() =>
    // Custom text editor behaviour
    editArea.value.addEventListener('keydown', function (e) {

        if (blogEditData.saveable) blogEditData.textMutated += 1

        let insertString: string
        if (e.key === 'Tab') {
            e.preventDefault()
            insertString = '  '
        } else if (e.key === 'Enter') {
            e.preventDefault()
            const lineStart = this.value.lastIndexOf('\n', this.selectionStart - 1) // -1 case works perfectly
            let spaceWidth = this.value.slice(lineStart + 1, this.selectionStart).search(/[^ ]/)
            if (spaceWidth === -1) { // No character is found, so we take all the spaces up to selectionStart
                spaceWidth = this.selectionStart - lineStart - 1
            }
            insertString = '\n' + ' '.repeat(spaceWidth)
        } else {
            return
        }
        insertText(insertString)
    // this.dispatchEvent(new InputEvent("input", {inputType:"insertText", data: insertString, view:e.window}))
    // this.selectionStart =
    // this.selectionEnd = start + insertString.length;
    }))

</script>
<template>
    <textarea id="edit-area" class="flex-child-fill"
        ref="editArea"
        v-model="blogEditData.content"
        @keydown="storeData">
        
    </textarea>
</template>


<style>
#edit-area{
    max-height: 100%;
    box-sizing: border-box;
}
</style>