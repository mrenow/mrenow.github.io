<template>
  <h1>This is the main page yay!</h1>

  <div class="card">
    <div class="text-content">
      <!-- adjusted to be fixed width -->
      <h2>What stuff exists here</h2>
      <p>
        This site has a small web app I made for myself to write posts. Perhaps once the organization gets musty enough a system will grow naturally, just like mould on a sandwich.
      </p>
    </div>
    <div class="content-column">
      <div class="content-row">
        <div class="flex-child-fill square mid-margin">
          <router-link to="/blog-edit">
            <img
              class="img-btn"
              src="resources/blog_button.png"
            >
          </router-link>
        </div>
        <div class="flex-child-fill square mid-margin">
          <router-link to="/public-place">
            <img
              class="img-btn"
              src="resources/public_button.png"
            >
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
