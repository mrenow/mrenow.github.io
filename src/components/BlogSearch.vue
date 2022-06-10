<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { bindLoadingFlag } from '../scripts/helpers';
import { loadTitles } from '../scripts/network'
// Component which exposes a title from a search field.

const props = defineProps<{
    disabled: boolean
    buttonText?: string
    notExistsText? : string
    onSubmit?:(title:string) => void
}>()
const isLoading = ref(false)
const allTitles = ref([])
const title = ref('')
const titleNotExists = computed(() => !allTitles.value.includes(title.value))

async function updateTitles () {
    allTitles.value = await bindLoadingFlag(loadTitles(), isLoading)
}
// const exposeVars = {
//     isLoading
// }

// defineExpose(exposeVars)
onMounted(updateTitles) // Perform in pinia later
</script>

<template>
  <label for="markdown-input">
    Select Blog:
  </label>
  <input
    id="markdown-input"
    v-model="title"
    type="search"
    list="title-list"
    style="width:20em"
  >
  <datalist id="title-list">
    <option
      v-for="t in allTitles"
      :key="t"
      :value="t"
    />
  </datalist>
  <input
    type="submit"
    :value="titleNotExists && notExistsText? notExistsText : buttonText"
    :disabled="disabled"
    style="width:7em"
    @click="props.onSubmit(title)"
  >
</template>
