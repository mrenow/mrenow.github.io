<script setup lang="ts">
import { ref, computed, watch, onMounted, readonly, onUpdated } from 'vue'
import { supabase } from '../supabase'

import { bindValidFlag, bindLoadingFlag } from '../scripts/helpers'
import { authData, authLoading } from '../scripts/auth'
import BlogArea from './BlogArea.vue'
import BlogSearch from './BlogSearch.vue'
import { BlogEditor } from '../scripts/blog'

// Something to do with firefox compatibility and textbox.
// // http://stackoverflow.com/a/9851769/529024
// const isFirefox = typeof InstallTrigger !== 'undefined';

// _contentText is unsafe
/*
    By binding a settable _contentText we bypass the textarea's default methods of setting which leads to all
    kinds of unspeakable evils

*/

let editor: BlogEditor = null
function getEditor () {
    return editor
}

const _contentText = ref('')
const contentText = readonly(_contentText)

// const _contentImages = reactive({image_})

const isSaving = ref(false)
const showEdit = ref(true)

const markdownInput = ref(null) // Loaded on mount
const textMutated = ref(0)
const doAutosave = ref(false)
const titleText = ref('')
const loadSuccess = ref(false)

/* When is Loading, want to:
 * - prevent textarea mutation
 * - Show sign of loading
 */
const isLoading = ref(false)

async function loadOrCreatePost (title) {
    // Save our work in background
    console.log('editor', editor)
    if (editor && editor.textMutated.value && confirm('Save changes?')) {
        editor.save()
    }
    // new editor
    editor = await bindLoadingFlag(BlogEditor.create(title, _contentText, markdownInput.value), isLoading)
    // bind refs
    console.log('autosave', doAutosave)
    titleText.value = editor.title
    editor.isSaving = isSaving
    editor.doAutosave = doAutosave
    editor.textMutated = textMutated
    loadSuccess.value = true
}

const togglePreviewText = computed(() => showEdit.value ? 'Show Full Preview' : 'Show Editor')
const postChangedText = computed(() => loadSuccess.value ? textMutated.value + ' unsaved characters' : 'No title selected; changes will not be saved.')
const showSave = computed(() => !authLoading.value && authData.authenticated)

/* watched properties */
// On content updated
watch(contentText, function (n, o) {
    // Ensure that random glitches dont delete all our work.
    if (o.length - n.length > 500 && !confirm('Post content contracted significantly. Confirm?')) {
        editor.insertText(o, 0, markdownInput.value.value.length)
    }
})

onMounted(() =>
    markdownInput.value.addEventListener('keydown', function (e) {
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
        editor.insertText(insertString)
    // this.dispatchEvent(new InputEvent("input", {inputType:"insertText", data: insertString, view:e.window}))
    // this.selectionStart =
    // this.selectionEnd = start + insertString.length;
    }))

// document.onpaste = async function (event) {
//     const items = event.clipboardData.items
//     console.log(JSON.stringify(items)) // might give you mime types
//     for (const index in items) {
//         const item = items[index]
//         if (item.kind === 'file') {
//             const { data, error } = await supabase.storage.from('post_images').upload('public/img1.png', item.getAsFile())
//             console.log(data, error)
//         }
//     }
// }

</script>

<template>
  <form
    style="display:flex"
    @submit.prevent=""
  >
    <div class="content-column no-basis">
      <div class="content-row tight">
        <div>
          <h2>
            Editing "{{ titleText }}"
          </h2>
        </div>
        <h2>
          <BlogSearch
            :disabled="isLoading"
            :on-submit="loadOrCreatePost"
            :button-text="isLoading?'Loading...':'Load'"
            not-exists-text="New"
          />
        </h2>

        <div class="content-column tight">
          <div>
            <input
              v-model="doAutosave"
              type="checkbox"
              name="toggle-autosave"
            >
            <label for="toggle-autosave">Autosave</label>
          </div>
        </div>
      </div>

      <div class="content-row">
        <div
          v-show="showEdit"
          class="content-column no-basis"
        >
          <!-- Text area to enter stuff-->
          <div class="content-bar">
            <h2 :style="'font-style: ' + ((textMutated === 0)?'normal':'italic')">
              <label for="markdown-input">Post Text</label>
            </h2>
            <p
              v-show="textMutated > 0"
              style="flex-grow:1"
            >
              {{ postChangedText }}
            </p>
            <span v-if="showSave">
              <input
                type="submit"
                :value="getEditor() && isSaving?'Saving...':'Save'"
                :disabled="isSaving || !loadSuccess"
                @click="getEditor().save()"
              >
            </span>
          </div>
          <textarea
            id="markdown-input"
            ref="markdownInput"
            v-model="_contentText"
            class="flex-child-fill"
            :disabled="false"
            @input="textMutated+=1"
          />
        </div>

        <!-- <div class='vert-spacer'></div> -->
        <div class="content-column no-basis">
          <div class="content-bar">
            <h2>
              Post Preview
            </h2>
            <span>
              <input
                type="submit"
                :value="togglePreviewText"
                @click="showEdit=!showEdit"
              >
            </span>
          </div>
          <BlogArea
            :title="titleText"
            :external-text="contentText"
          />
        </div>
      </div>
    </div>
  </form>
</template>

<style scoped>
.markdown{
    text-align: left;
}

textarea{
    box-sizing: border-box;
    flex: 1 0 auto;
    resize: none;
}
</style>
