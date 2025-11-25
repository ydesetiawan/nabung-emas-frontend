<script setup lang="ts">
import { pockets, getTypePocket, formatCurrency, formatWeight } from '~/utils/gold'
import { cn } from '~/utils/cn'

const colorMap: Record<string, string> = {
  blue: "bg-primary/10 text-primary",
  gold: "bg-accent/20 text-accent-foreground",
  pink: "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400",
  green: "bg-success/10 text-success",
}

const iconMap: Record<string, string> = {
  shield: 'lucide:shield',
  "trending-up": 'lucide:trending-up',
  heart: 'lucide:heart',
  "graduation-cap": 'lucide:graduation-cap',
}

const getIcon = (iconName: string) => iconMap[iconName] || 'lucide:shield'
</script>

<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <h3 class="font-semibold text-foreground">Your Pockets</h3>
      <NuxtLink to="/pockets">
        <Button variant="ghost" size="sm" class="text-primary h-8">
          See All
          <Icon name="lucide:chevron-right" class="h-4 w-4 ml-1" />
        </Button>
      </NuxtLink>
    </div>

    <div class="space-y-3">
      <NuxtLink
        v-for="pocket in pockets.slice(0, 3)"
        :key="pocket.id"
        :to="`/pockets/${pocket.id}`"
        class="block"
      >
        <Card class="p-4 hover:bg-muted/50 transition-colors active:scale-[0.98]">
          <div class="flex items-start gap-3">
            <div
              :class="cn(
                'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                getTypePocket(pocket.typePocketId)?.color ? colorMap[getTypePocket(pocket.typePocketId)!.color] : colorMap.blue
              )"
            >
              <Icon :name="getIcon(getTypePocket(pocket.typePocketId)?.icon || 'shield')" class="h-5 w-5" />
            </div>

            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <h4 class="font-medium text-foreground truncate">{{ pocket.name }}</h4>
                  <p class="text-xs text-muted-foreground">{{ getTypePocket(pocket.typePocketId)?.name }}</p>
                </div>
                <div class="text-right shrink-0">
                  <p class="font-semibold text-foreground">{{ formatWeight(pocket.aggregateTotalWeight) }}</p>
                  <p class="text-xs text-muted-foreground">{{ formatCurrency(pocket.aggregateTotalPrice) }}</p>
                </div>
              </div>

              <div v-if="pocket.targetWeight" class="mt-3">
                <div class="flex items-center justify-between text-xs mb-1">
                  <span class="text-muted-foreground">Progress</span>
                  <span class="font-medium">{{ ((pocket.aggregateTotalWeight / pocket.targetWeight) * 100).toFixed(0) }}%</span>
                </div>
                <Progress :value="(pocket.aggregateTotalWeight / pocket.targetWeight) * 100" class="h-1.5" />
              </div>
            </div>
          </div>
        </Card>
      </NuxtLink>

      <NuxtLink to="/pockets/new" class="block">
        <Card class="p-4 border-dashed hover:bg-muted/50 transition-colors flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground">
          <Icon name="lucide:plus" class="h-5 w-5" />
          <span class="text-sm font-medium">Create New Pocket</span>
        </Card>
      </NuxtLink>
    </div>
  </div>
</template>
