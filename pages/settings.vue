<template>
  <div class="min-h-screen bg-gray-50">
    <SideMenu :isOpen="menuOpen" @toggle="handleToggle" />

    <div
      :class="[
        'transition-all duration-300 min-h-screen',
        menuOpen ? 'lg:ml-64' : 'lg:ml-20'
      ]"
    >
      <div class="p-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-6">Settings</h1>

        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 class="text-xl font-bold text-gray-800 mb-4">Account Settings</h2>
          <p class="text-gray-600">Manage your account settings here</p>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-bold text-gray-800 mb-4">Preferences</h2>
          <p class="text-gray-600">Customize your preferences</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const menuOpen = ref(true)

const handleToggle = (state) => {
  menuOpen.value = state
}
</script>

