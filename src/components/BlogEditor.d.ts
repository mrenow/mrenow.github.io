import { DeepReadonly, Ref, UnwrapNestedRefs } from "vue";

export interface BlogEditorInterface {
    
    changePost?: (newTitle:string) => Promise<void>,
    save?:  () => Promise<boolean>,
    saveable?: Readonly<boolean>,
    isSaving?: Readonly<boolean>,
    textMutated?: Readonly<number>,
    title?: Readonly<string>,
    content?: Readonly<string>,
    resources?: Readonly<readonly string[]>
}