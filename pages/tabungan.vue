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
        <h1 class="text-3xl font-bold text-gray-800 mb-6">Tabungan</h1>

        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 class="text-xl font-bold text-gray-800 mb-4">Tambah Tabungan</h2>

          <Input
              label="Jumlah (Rp)"
              type="number"
              placeholder="Masukkan jumlah tabungan"
              v-model="amount"
          />

          <Input
              label="Tanggal"
              type="date"
              v-model="date"
          />

          <Button @click="handleAddSavings">
            Tambah Tabungan
          </Button>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-bold text-gray-800 mb-4">Riwayat Tabungan</h2>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jumlah
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gram Emas
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-if="savings.length === 0">
                  <td colspan="3" class="px-6 py-4 text-center text-gray-500">
                    Belum ada data tabungan
                  </td>
                </tr>
                <tr v-for="(item, index) in savings" :key="index">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ item.date }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Rp {{ item.amount.toLocaleString('id-ID') }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ item.grams }} g
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import SideMenu from '~/components/SideMenu.vue'
import Input from '~/components/ui/Input.vue'
import Button from '~/components/ui/Button.vue'

const menuOpen = ref(true)
const amount = ref('')
const date = ref('')
const savings = ref([])

const handleToggle = (state) => {
  menuOpen.value = state
}

const handleAddSavings = () => {
  if (amount.value && date.value) {
    savings.value.push({
      date: date.value,
      amount: parseFloat(amount.value),
      grams: (parseFloat(amount.value) / 1000000).toFixed(2) // Example calculation
    })

    // Reset form
    amount.value = ''
    date.value = ''

    console.log('Tabungan berhasil ditambahkan')
  } else {
    alert('Mohon isi semua field')
  }
}
</script>

