<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-4xl font-bold text-gray-800 mb-4">Welcome to Nabung Emas</h1>
      <p class="text-gray-600 mb-8">Aplikasi untuk menabung emas</p>
      <div class="space-x-4">
        <Button @click="navigateToLogin">
          Login
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import Button from '~/components/ui/Button.vue'

const navigateToLogin = () => {
  navigateTo('/login')
}
</script>

