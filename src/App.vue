<template>
  <div class="content-area">
    <nav class="content-bar">
      <router-link to="/">
        Home
      </router-link>
      <router-link to="/public-place">
        Public Place
      </router-link>
      <router-link to="/blogs">
        Blogs
      </router-link>
      <router-link to="/auth">
        Are you me?
      </router-link>
    </nav>
    <router-view />
  </div>
</template>
