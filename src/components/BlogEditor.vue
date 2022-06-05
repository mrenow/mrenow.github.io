
<script setup lang="ts">
import { ref,  onMounted, readonly } from 'vue'
import { bindLoadingFlag } from '../scripts/helpers'
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

const SAVE_FAILURE = 'save failure'

const textMutated = ref(0)
const saveable = ref(false)
const isSaving = ref(false)

const title = ref('')
const editArea = ref(null)
// NEVER MUTATE EXPLICITLY. Leave it to the v-models to mutate these variables
const content = ref ('')
const resources = ref([] as string[])

// invalidate save state whenever the title is changed
// clean and load 
async function changePost(newTitle: string){
    if (newTitle === title.value) return
    const oldSaveable = saveable.value
    saveable.value = false
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


async function overwriteText(text: string){
    console.log(textMutated.value)
    if (textMutated.value !== 0 && confirm("Save unsaved changes?") && !(await save())) throw new Error('Save Failure')
    insertText(text, 0, editArea.value.value.length)
    textMutated.value = 0
}

async function save(){
    console.log('saving...')
    try{
        const accountedMutations = textMutated.value
        const data = await bindLoadingFlag(submitPost(title.value, content.value), isSaving)
        console.log('saved.')
        textMutated.value -= accountedMutations
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
}

const exposeVars = {
    changePost,
    save,
    saveable: readonly(saveable),
    isSaving: readonly(isSaving),
    textMutated: readonly(textMutated),
    title: readonly(title),
    content: readonly(content),
    resources: readonly(resources)
}

defineExpose(exposeVars)


onMounted(() =>
    // Custom text editor behaviour
    editArea.value.addEventListener('keydown', function (e) {

        if (saveable.value) textMutated.value += 1

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
    <textarea class="flex-child-fill"
        ref="editArea"
        v-model="content">
        
    </textarea>
</template>


<style>
</style>