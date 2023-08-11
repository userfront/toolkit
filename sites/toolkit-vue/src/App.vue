<script setup>
import HelloWorld from './components/HelloWorld.vue'
import "../../../packages/toolkit-react/dist/userfront-web-components.es.js"

Userfront.init("wbm95g4b");
</script>

<template>
  <h1>Userfront Web Components: Vue</h1>
  <hr />
  <h2>Signup</h2>
  <userfront-signup-form tenant-id="wbm95g4b"></userfront-signup-form>
  <hr />
  <h2>Login</h2>
  <userfront-login-form tenant-id="wbm95g4b"></userfront-login-form>
  <hr />
  <h2>Password reset</h2>
  <userfront-password-reset-form tenant-id="wbm95g4b"></userfront-password-reset-form>
  <hr />
  <h2>Logout</h2>
  <userfront-logout-button></userfront-logout-button>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
