<script setup lang="ts">
// Blog post component. Source text can either be from a value or an external source
// Simply use the external source to load text.
import { Ref, ref, toRef, computed, readonly, watch, watchEffect, reactive } from 'vue'

import { bindValidFlag, bindLoadingFlag, range , consolelog} from '../scripts/helpers'
import { loadPost } from '../scripts/network'
import { diffArrays } from 'diff'
import Markdown from './Markdown.vue'

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
let nextKey = 1

const markdownList = reactive([{data: "", key: 0}] as {data: string, key:number}[])
updateMarkdown()
watch(()=>[contentText.value, props.title], updateMarkdown)
function updateMarkdown(){
  const start = performance.now()
  const newList = [`# ${props.title}`].concat(contentText.value.split(/\s*\n\s*\n/))
  let idx = 0
  for (const {count, added, removed, value} of diffArrays(markdownList.map(({data})=>data), newList)){
    if ( added ){
      markdownList.splice(idx, 0, ...value.map( x=>({data: x, key: nextKey++})))
      idx+=count
      continue
    }
    if ( removed ){
      markdownList.splice(idx, count)
      continue
    }    
    idx += count
  }
}





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
  <div id="blog-preview" class="card" 
      @focusin="runInternalScripts">
    <!--Need this as a separate component file due to awful v-for update shenanagans. I still do not understand-->
    <Markdown v-for="item in markdownList" :source="item.data" :key="item.key" />
  </div>
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
