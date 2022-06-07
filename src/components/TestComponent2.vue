<script lang="ts">
import { watch, ref, computed, onMounted, onUpdated } from 'vue'
import { loadTitles } from '../scripts/network'
import { consolelog }from  '../scripts/helpers'
import Markdown from 'vue3-markdown-it'
import MarkdownHTML from 'markdown-it-html'
import MarkdownLatex from 'markdown-it-texmath'
import Katex from 'katex'
// Component which exposes a title from a search field.

const props = defineProps<{
    source: string
}>()
console.log("Rerendered")
watch(() => props.source, ()=> consolelog("reran", props.source))

onUpdated(() => console.log("Updated"))
onMounted(() => console.log("Mounted"))

</script>

<template>

    <Markdown
      :source="source"
      :html="true"
      :plugins="[
        {
          plugin: MarkdownHTML,
          options:{
            re: /<html>!([^]*?)<\/html>/
          }
        }
      ]"
    />
</template>
