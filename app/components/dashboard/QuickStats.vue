<script setup lang="ts">
import { calculatePortfolioStats, formatCurrency } from '~/utils/gold'

const stats = computed(() => calculatePortfolioStats())

const statItems = computed(() => [
  {
    icon: 'lucide:wallet',
    label: "Pockets",
    value: stats.value.pocketCount.toString(),
    color: "bg-primary/10 text-primary",
  },
  {
    icon: 'lucide:arrow-left-right',
    label: "Transactions",
    value: stats.value.transactionCount.toString(),
    color: "bg-accent/20 text-accent-foreground",
  },
  {
    icon: 'lucide:trending-up',
    label: "Market Price",
    value: formatCurrency(stats.value.currentPricePerGram).replace("Rp", "").trim(),
    suffix: "/g",
    color: "bg-success/10 text-success",
  },
])
</script>

<template>
  <div class="grid grid-cols-3 gap-3">
    <div
      v-for="item in statItems"
      :key="item.label"
      class="p-3 bg-card rounded-xl border border-border shadow-sm"
    >
      <div :class="`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center mb-2`">
        <Icon :name="item.icon" class="h-4 w-4" />
      </div>
      <p class="text-xs text-muted-foreground">{{ item.label }}</p>
      <p class="text-sm font-semibold truncate">
        {{ item.value }}
        <span v-if="item.suffix" class="text-xs font-normal text-muted-foreground">{{ item.suffix }}</span>
      </p>
    </div>
  </div>
</template>
