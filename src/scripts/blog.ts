import { bindLoadingFlag } from './helpers'
import { Ref, ref, watch } from 'vue'
import { loadPost, submitPost, NO_POST_ERR } from './network'
// Instance of a blog editor representing a valid blog in memory.
export class BlogEditor {
    content: Ref<string>
    editArea: HTMLTextAreaElement
    title: string
    resources: string[] // urls to access pictures

    isSaving = ref(false)
    textMutated = ref(0)
    doAutosave = ref(false)
    autosaveTime_ = 10000

    constructor (title: string, contentRef: Ref<string>, editArea: HTMLTextAreaElement, initialContent: string, resources) {
        this.content = contentRef // bind refs
        this.title = title
        this.resources = resources
        this.editArea = editArea
        setInterval(() => this.#autosave(), this.autosaveTime_)
        watch(this.content, () => {
            console.log('editor:', this)
            this.textMutated.value += 1
        })
        this.insertText(initialContent, 0, this.editArea.value.length)

        // console.log("autosave", this.doAutosave)
    }

    insertText (text: string, start: number = null, end: number = null) {
        this.editArea.focus()
        if (start !== null) this.editArea.selectionStart = start
        if (end !== null) this.editArea.selectionEnd = end
        document.execCommand('insertText', false, text)
    }

    #autosave () {
        if (this.doAutosave.value && this.textMutated.value) this.save()
    }

    async save () {
        console.log('saving...')
        await bindLoadingFlag(submitPost(this.title, this.content.value), this.isSaving)

        console.log('saved.')
        this.textMutated.value = 0
    }

    static async create (title: string, contentRef: Ref<string>, editArea: HTMLTextAreaElement) {
        let content: string
        let resources: string[]
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
        console.log(title, contentRef, editArea, content)
        return new BlogEditor(title, contentRef, editArea, content, resources)
    }
}
