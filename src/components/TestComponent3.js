
import { watch, ref, computed, onMounted, onUpdated, h} from 'vue'
import { loadTitles } from '../scripts/network'
import { consolelog }from  '../scripts/helpers'
import Markdown from 'vue3-markdown-it'
import MarkdownHTML from 'markdown-it-html'
import MarkdownLatex from 'markdown-it-texmath'
import Katex from 'katex'

export default{
    name : "TestComponent3",
    props: {  source: {
        type: String,
        default: ''
      }},
    setup(props) {
        // Component which exposes a title from a search field.


        console.log("Rerendered")
        // watch(() => props.source, ()=> consolelog("reran", props.source))

        onMounted(() => console.log("Mounted"))
        onUpdated(() => console.log("Updated"))
        return () => h('div',  {innerHTML:props.prop} )
    }
};