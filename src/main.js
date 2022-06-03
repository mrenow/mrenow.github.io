import { createApp } from 'vue'

import { createRouter, createWebHashHistory } from 'vue-router'
import { createPinia } from 'pinia'
import Markdown from 'vue3-markdown-it'


import './assets/css/matStyle.css'
import 'highlight.js/styles/monokai.css'
import App from './App.vue'

import NewBlog from './views/NewBlog.vue'
import ViewBlog from './views/ViewBlog.vue'
import Auth from './views/Auth.vue'
import HomePage from './views/HomePage.vue'
import PublicPlace from './views/PublicPlace.vue'
import NotFound from './views/NotFound.vue'

// 2. Define some routes
// Each route should map to a component.
// We'll talk about nested routes later.

const routes = [
    { path: '/', component: HomePage },
    { path: '/auth', component: Auth },
    { path: '/blogs', component: ViewBlog },
    { path: '/public-place', component: PublicPlace },
    { path: '/blog-edit', component: NewBlog },
    { path: '/:pathMatch(.*)*', component: NotFound }
]

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = createRouter({
    // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
    history: createWebHashHistory(),
    routes // short for `routes: routes`
})
const pinia = createPinia()

const app = createApp(App)
    .use(router)
    .use(pinia)
    .use(Markdown)
    .mount('#app')
