<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
      <h2 class="text-2xl font-bold text-center mb-6 text-gray-800">Login</h2>

      <Input
          label="Username"
          type="text"
          placeholder="Enter your username"
          v-model="username"
      />

      <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          v-model="password"
      />

      <Button @click="handleLogin">
        Login
      </Button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Input from '~/components/ui/Input.vue'
import Button from '~/components/ui/Button.vue'

const username = ref('')
const password = ref('')

const handleLogin = () => {
  console.log('Username:', username.value)
  console.log('Password:', password.value)
  // Add your login logic here
}
</script>
