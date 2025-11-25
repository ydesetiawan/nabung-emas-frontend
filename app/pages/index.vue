<script setup lang="ts">
import PortfolioCard from '~/components/dashboard/PortfolioCard.vue'
import QuickStats from '~/components/dashboard/QuickStats.vue'
import PocketList from '~/components/dashboard/PocketList.vue'
import RecentTransactions from '~/components/dashboard/RecentTransactions.vue'
import AddTransactionSheet from '~/components/transactions/AddTransactionSheet.vue'

const { t } = useI18n()
const router = useRouter()
const showAddTx = ref(false)
</script>

<template>
  <div>
    <!-- Header -->
    <header class="sticky top-0 z-40 bg-background/95 backdrop-blur-sm safe-top">
      <div class="flex items-center justify-between px-4 h-14">
        <div>
          <p class="text-xs text-muted-foreground">{{ t.dashboard.welcomeBack }}</p>
          <h1 class="text-lg font-semibold">{{ t.dashboard.goldSavings }}</h1>
        </div>
        <div class="flex items-center gap-1">
          <Button variant="ghost" size="icon" class="h-9 w-9">
            <Icon name="lucide:bell" class="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" class="h-9 w-9" @click="router.push('/profile')">
            <Icon name="lucide:settings" class="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>

    <!-- Content -->
    <div class="px-4 py-4 space-y-6">
      <PortfolioCard />
      <QuickStats />
      <PocketList />
      <RecentTransactions />
    </div>

    <!-- FAB -->
    <FAB @click="showAddTx = true" :label="t.dashboard.addTransaction" />

    <!-- Add Transaction Sheet -->
    <AddTransactionSheet :open="showAddTx" @update:open="showAddTx = $event" />
  </div>
</template>
