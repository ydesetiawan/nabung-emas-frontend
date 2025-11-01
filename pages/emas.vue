<template>
  <div class="min-h-screen bg-gray-50">
    <SideMenu :isOpen="menuOpen" @toggle="handleToggle"/>

    <div
      :class="[
        'transition-all duration-300 min-h-screen',
        menuOpen ? 'lg:ml-64' : 'lg:ml-20'
      ]"
    >
      <div class="p-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-6">Harga Emas</h1>

        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-bold text-gray-800 mb-4">Informasi Harga Emas Hari Ini</h2>
          <p class="text-gray-600">Konten halaman emas akan ditampilkan di sini</p>
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