import { createApp } from 'vue'

import { createRouter, createWebHashHistory } from 'vue-router'
import Markdown from 'vue3-markdown-it'

import './assets/css/matStyle.css'
import 'highlight.js/styles/monokai.css'
import App from './App.vue'
import Auth from './components/Auth.vue'
import NewBlog from './components/NewBlog.vue'
import ViewBlog from './components/ViewBlog.vue'
import HomePage from './components/HomePage.vue'
import PublicPlace from './components/PublicPlace.vue'
import NotFound from './components/NotFound.vue'

// 2. Define some routes
// Each route should map to a component.
// We'll talk about nested routes later.

const defaultText = 'I am a failure.'
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

// 5. Create and mount the root instance.
const app = createApp(App)
// Make sure to _use_ the router instance to make the
// whole app router-aware.
app.use(router)
app.use(Markdown)
app.mount('#app')
