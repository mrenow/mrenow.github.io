<script setup lang="ts">
import { ref, computed, watch, onMounted, readonly, onUpdated, Ref } from 'vue'
import { authData, authLoading } from '../scripts/auth'
import BlogArea from '../components/BlogArea.vue'
import BlogSearch from '../components/BlogSearch.vue'
import BlogEditor from '../components/BlogEditor.vue'
import { BlogEditorInterface } from '../components/BlogEditor'

// Something to do with firefox compatibility and textbox.
// // http://stackoverflow.com/a/9851769/529024
// const isFirefox = typeof InstallTrigger !== 'undefined';

// _contentText is unsafe
/*
    By binding a settable _contentText we bypass the textarea's default methods of setting which leads to all
    kinds of unspeakable evils

*/




const editor: Ref<BlogEditorInterface> = ref({
  content: '',
  title: '',
})


const showEdit = ref(true)
const doAutosave = ref(false)

/* When is Loading, want to:
 * - prevent textarea mutation
 * - Show sign of loading
 */
const isLoading = ref(false)

const togglePreviewText = computed(() => showEdit.value ? 'Show Full Preview' : 'Show Editor')
const postChangedText = computed(() => editor.value.textMutated ? editor.value.textMutated + ' unsaved characters' : 'No title selected; changes will not be saved.')
const showSave = computed(() => !authLoading.value && authData.authenticated)

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

function autosave () {
    if (doAutosave.value && editor.value.textMutated) editor.value.save()
}


setInterval(() => autosave(), 20000)


</script>

<template>
  <form
    style="display:flex"
    @submit.prevent=""
  >
    <div class="content-column no-basis">
      <div class="content-row flex-wrap tight">
        <div>
          <h2>
            Editing "{{ editor.title }}"
          </h2>
        </div>
        <h2>
          <BlogSearch
            :disabled="isLoading"
            :on-submit="editor.changePost"
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
            <h2 :style="'font-style: ' + ((editor.textMutated === 0)?'normal':'italic')">
              <label for="markdown-input">Post Text</label>
            </h2>
            <p
              v-show="editor.textMutated > 0"
              style="flex-grow:1"
            >
              {{ postChangedText }}
            </p>
            <span v-if="showSave">
              <input
                type="submit"
                :value="editor.isSaving?'Saving...':'Save'"
                :disabled="editor.isSaving || !editor.saveable"
                @click="editor.save"
              >
            </span>
          </div>
          <BlogEditor ref="editor"/>
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
            :title="editor.title"
            :external-text="editor.content"
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
