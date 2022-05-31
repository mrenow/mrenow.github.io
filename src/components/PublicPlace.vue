<template>
  <div class="card">
    <div class="title">
      <h1>Public Place</h1>
    </div>
    <div class="text-content">
      <!-- adjusted to be fixed width -->
      <h1>Hello Stranger!</h1>
      <p>
        This is the Public Place. For Public People. Hellooo the public! Please gaze at my various credentials or whatever.
      </p>
    </div>
    <div class="text-content">
      <h1> About Me</h1>
      <img
        class="side-img"
        src="resources/fetus.png"
      >
      <p>
        I dont feel particularly inclined to write about boring stuff right now. So youre going to have to settle for a nice picture of me:
      </p>
      <div>
        <div class="link-list">
          <ul>
            <li>
              <router-link to="blog/blog1.html">
                <div class="block-link">
                  <p>Resume BROKEN PLEASE FIX ME</p>
                </div>
              </router-link>
            </li>
            <li>
              <router-link to="blog/blog1.html">
                <div class="block-link">
                  <p>GitHub BROKEN PLEASE FIX ME</p>
                </div>
              </router-link>
            </li>
            <li>
              <router-link to="blog/blog1.html">
                <div class="block-link">
                  <p>Linkedin BROKEN PLEASE FIX ME</p>
                </div>
              </router-link>
            </li>
            <li>
              <router-link to="index.html">
                <div class="block-link">
                  <p>Escape From The Public</p>
                </div>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
