<script setup lang="ts">
import { transactions, pockets, formatCurrency, formatWeight } from '~/utils/gold'
import { formatDistanceToNow } from 'date-fns'

const brandColors: Record<string, string> = {
  Antam: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  UBS: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Pegadaian: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  "King Halim": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
}

const recentTx = computed(() => {
  return [...transactions].sort((a, b) => b.transactionDate.getTime() - a.transactionDate.getTime()).slice(0, 4)
})

const getPocketName = (id: string) => {
  return pockets.find((p) => p.id === id)?.name || "Unknown Pocket"
}
</script>

<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <h3 class="font-semibold text-foreground">Recent Transactions</h3>
      <NuxtLink to="/transactions">
        <Button variant="ghost" size="sm" class="text-primary h-8">
          See All
          <Icon name="lucide:chevron-right" class="h-4 w-4 ml-1" />
        </Button>
      </NuxtLink>
    </div>

    <Card class="divide-y divide-border">
      <NuxtLink
        v-for="tx in recentTx"
        :key="tx.id"
        :to="`/transactions/${tx.id}`"
        class="block"
      >
        <div class="p-4 hover:bg-muted/50 transition-colors">
          <div class="flex items-center justify-between gap-3">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <Badge variant="secondary" :class="brandColors[tx.brand] || 'bg-secondary'">
                  {{ tx.brand }}
                </Badge>
                <span class="text-xs text-muted-foreground">
                  {{ formatDistanceToNow(tx.transactionDate, { addSuffix: true }) }}
                </span>
              </div>
              <p class="text-sm text-muted-foreground truncate">{{ getPocketName(tx.pocketId) }}</p>
            </div>
            <div class="text-right shrink-0">
              <p class="font-semibold text-foreground">{{ formatWeight(tx.weight) }}</p>
              <p class="text-xs text-muted-foreground">{{ formatCurrency(tx.totalPrice) }}</p>
            </div>
          </div>
        </div>
      </NuxtLink>
    </Card>
  </div>
</template>
