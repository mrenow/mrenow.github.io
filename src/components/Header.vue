<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import HelloWorld from './components/HelloWorld.vue'
import Auth from './components/Auth.vue'
import NewBlog from './components/NewBlog.vue'
import Lights from './components/lights_out/Lights.vue'

import { ref, computed } from 'vue'

const routesMap = {
    '': HelloWorld,
    auth: Auth,
    'new-blog': NewBlog,
    lights: Lights
}

const currentPath = ref(window.location.pathname)

</script>

<template />
