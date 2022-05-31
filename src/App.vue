<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup

// import Lights from './components/lights_out/Lights.vue'
import { test1, test2 } from './scripts/test1'

import { ref, computed } from 'vue'
const routesMap = {

}

const currentPath = ref(window.location.pathname)

window.addEventListener('hashchange', () => {
    currentPath.value = window.location.pathname
})

console.log(currentPath.value.slice(1))

const currentView = computed(() => {
    return routesMap[currentPath.value.slice(1)]
})

</script>

<template>
  <div class="content-area">
    <nav class="content-bar">
      <a href="/">Home</a>
      <a href="/public-place">Public Place</a>
      <a href="/blogs">Blogs</a>
      <a href="/auth">Are you me?</a>
    </nav>
    <!--HelloWorld msg="Hello Vue 3 + Vite" /-->
    <component :is="currentView" />
  </div>
</template>

<style>
/*
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */
</style>
