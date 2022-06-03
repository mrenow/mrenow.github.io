<script setup lang="ts">
import { ref } from 'vue'
import BlogSearch from '../components/BlogSearch.vue'
import BlogArea from '../components/BlogArea.vue'

const blogTitle = ref('')
const isLoading = ref(false)

function setBlogTitle (title:string) {
    console.log(title)
    blogTitle.value = title
}
</script>

<template>
  <div class="content-column">
    <br>
    <div class="content-row tight ">
      <div>
        <BlogSearch
          :button-text="isLoading?'Loading':'Load'"
          :disabled="isLoading"
          :on-submit="setBlogTitle"
        />
      </div>
      <router-link to="/blog-edit">
        Edit
      </router-link>
    </div>
    <br>
    <BlogArea
      v-model:is-loading="isLoading"
      :title="blogTitle"
    />
  </div>
</template>
