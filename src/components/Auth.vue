<script setup>
import { ref } from 'vue'
import { logIn, logOut, authData, profileData } from '../scripts/auth'
import { bindLoadingFlag } from '../scripts/helpers'
// Two states, loading and email
// loading is so we can wait for the async component to load before displaying
// Then run an async task to create the login handler using supabase.auth.signin with an input object {email} it returns an error.

const email = ref('')
const password = ref('')

const loading = ref(false)
// http://localhost:3000/#access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNjUzNDA5Mzg4LCJzdWIiOiIyZTVmZjU4MC0wMTdhLTQ2ODMtYThlZi05YmIzMGQ0YzAwN2IiLCJlbWFpbCI6Im90aGVyLmV6aHVpQGdtYWlsLmNvbSIsInBob25lIjoiIiwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiZW1haWwiLCJwcm92aWRlcnMiOlsiZW1haWwiXX0sInVzZXJfbWV0YWRhdGEiOnt9LCJyb2xlIjoiYXV0aGVudGljYXRlZCJ9.XTN_GJymG97oR4mnKppoQKRlvQQfbnzMLcNufvqSu6s&expires_in=3600&refresh_token=JgOxXbMkJcpe51faCs2O8Q&token_type=bearer&type=recovery
// const { error, data } = await supabase.auth.api
//   .updateUser("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNjUzNDA5Mzg4LCJzdWIiOiIyZTVmZjU4MC0wMTdhLTQ2ODMtYThlZi05YmIzMGQ0YzAwN2IiLCJlbWFpbCI6Im90aGVyLmV6aHVpQGdtYWlsLmNvbSIsInBob25lIjoiIiwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiZW1haWwiLCJwcm92aWRlcnMiOlsiZW1haWwiXX0sInVzZXJfbWV0YWRhdGEiOnt9LCJyb2xlIjoiYXV0aGVudGljYXRlZCJ9.XTN_GJymG97oR4mnKppoQKRlvQQfbnzMLcNufvqSu6s", { password : "HOMEh8*"})
async function handleLogin () {
    try {
        console.log('logging...')
        await bindLoadingFlag(logIn(email.value, password.value, true), loading)
    } catch (error) {
        alert(error.error_description || error.error_message)
    }
}
async function handleLogout () {
    try {
        console.log('logging...')
        await bindLoadingFlag(logOut(), loading)
    } catch (error) {
        alert(error.error_description || error.error_message)
    }
}
// const { data, error } = await supabase.auth.api
//   .resetPasswordForEmail('user@email.com')

</script>

<template>
  <div class="nugget-container">
    <form
      class="card tight"
      @submit.prevent="handleLogin"
    >
      <!-- v-model does two way binding between the email attribute tand the input value. -->
      <div v-if="authData.authenticated">
        <h1>Welcome, {{ profileData.handle }} </h1>
        <button
          :disabled="loading"
          :onclick="handleLogout"
        >
          {{ loading? 'Bye...' : 'Log Out' }}
        </button>
      </div>

      <table v-else>
        <tr>
          <td>
            <label for="email">Email:</label>
          </td>
          <td>
            <input
              v-model="email"
              class="inputField"
              type="email"
              name="email"
            >
          </td>
        </tr>
        <tr>
          <td>
            <label for="password">Password:</label>
          </td>
          <td>
            <input
              v-model="password"
              class="inputField"
              type="password"
              name="password"
            >
          </td>
        </tr>
        <tr>
          <input
            type="submit"
            :value="loading? 'loading' : 'Log In'"
            :disabled="loading"
          >
        </tr>
      </table>
    </form>
  </div>
</template>
