<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Side Menu -->
    <SideMenu :isOpen="menuOpen" @toggle="handleToggle" />

    <!-- Main Content -->
    <div
      :class="[
        'transition-all duration-300 min-h-screen',
        menuOpen ? 'lg:ml-64' : 'lg:ml-20'
      ]"
    >
      <div class="p-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Card 1 -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-gray-500 text-sm font-semibold mb-2">Total Tabungan</h3>
            <p class="text-3xl font-bold text-blue-600">Rp 0</p>
          </div>

          <!-- Card 2 -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-gray-500 text-sm font-semibold mb-2">Gram Emas</h3>
            <p class="text-3xl font-bold text-yellow-600">0 g</p>
          </div>

          <!-- Card 3 -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-gray-500 text-sm font-semibold mb-2">Harga Emas Hari Ini</h3>
            <p class="text-3xl font-bold text-green-600">Rp 0</p>
          </div>
        </div>

        <div class="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-bold text-gray-800 mb-4">Grafik Tabungan</h2>
          <p class="text-gray-600">Grafik akan ditampilkan di sini</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import SideMenu from '~/components/SideMenu.vue'

const { menuOpen, handleToggle } = useSideMenu()
</script>

