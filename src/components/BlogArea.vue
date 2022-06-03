<script setup lang="ts">
// Blog post component. Source text can either be from a value or an external source
// Simply use the external source to load text.
import { Ref, ref, toRef, computed, readonly, watch, watchEffect } from 'vue'
import Markdown from 'vue3-markdown-it'
import MarkdownHTML from 'markdown-it-html'
import MarkdownLatex from 'markdown-it-texmath'
import Katex from 'katex'
import { bindValidFlag, bindLoadingFlag } from '../scripts/helpers'
import { loadPost } from '../scripts/network'

const props = defineProps<{
    title: string
    isLoading?: boolean
    externalText?: string
    externalResources?: string[]
}>()

const emit = defineEmits(['update:isLoading'])

const contentTextValid = ref(false)

let internalScriptsLoaded = false

const isLoadingValue = computed({
    get () {
        return props.isLoading
    },
    set (value: boolean) {
        console.log('isLoading', value)
        emit('update:isLoading', value)
    }
})
let contentText : Ref<string>
let resources: Ref<string[]>
if (props.externalText !== undefined) {
    console.log('taking from editor')
    contentText = toRef(props, 'externalText')
    resources = toRef(props, 'externalResources')
    watch(contentText, function () { internalScriptsLoaded = false })
    // contentText is non-static, use a watcher to invalidate scripts
} else {
    const _contentText = ref('')
    contentText = readonly(_contentText)
    resources = ref([] as string[])
    const updateContent = async () => {
        if (props.title === '') return;
        ({ content: _contentText.value, resources: resources.value } =
            await bindLoadingFlag(
                bindValidFlag(
                    loadPost(props.title),
                    contentTextValid),
                isLoadingValue))
        runInternalScripts()
    }
    updateContent()
    watch(() => props.title, updateContent)
}

// Computed properties
// Compute Markdown Preview

const blogPreviewInnerMarkdown=computed(()=>`# ${props.title}\n${contentText.value}`)

function runInternalScripts () {
    if (internalScriptsLoaded) return
    for (const n of document.querySelectorAll('#blog-preview script')) {
        const script = document.createElement('script')
        script.innerHTML = '{' + n.innerHTML + '}' // Scoping so that variables are destroyed.
        n.parentElement.appendChild(script)
        n.remove()
    }
    internalScriptsLoaded = true
}

</script>

<template>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/katex/dist/katex.min.css"
  >
  <Markdown
    id="blog-preview"
    class="card"
    :source="blogPreviewInnerMarkdown"
    :html="true"
    :plugins="[
      {plugin: MarkdownHTML,
       options:{
         re: /<!--!([^]*?)!-->/g
       }
      },
      {plugin: MarkdownLatex,
       options: {
         engine: Katex,
         delimiters: 'dollars',
         katexOptions: {
           macros: {}
         }
       }
      }
    ]"
    @focusin="runInternalScripts"
  />
</template>

<style>
@import url("https://cdn.jsdelivr.net/npm/katex/dist/katex.min.css");

code{
  border: 1px solid gray;
  border-radius: 0.4em;
  padding: 0.2em;
  background:rgb(233, 232, 232);
}

#blog-preview .code-editor{
  background: #272822;
  padding: 1em;
  overflow-x: auto;
  padding: 1em;
}

#blog-preview{
    overflow-y: scroll;
    word-wrap: break-word;
}

</style>
