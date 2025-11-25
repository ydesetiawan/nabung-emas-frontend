<script setup lang="ts">
import { pockets, goldBrands, formatCurrency } from '~/utils/gold'
import { format } from 'date-fns'

const props = defineProps<{
  open: boolean
  defaultPocketId?: string
}>()

const emit = defineEmits(['update:open'])

const date = ref<Date>(new Date())
const pocketId = ref(props.defaultPocketId || "")
const brand = ref("")
const weight = ref("")
const pricePerGram = ref("")
const description = ref("")

const totalPrice = computed(() => {
  return parseFloat(weight.value || "0") * parseFloat(pricePerGram.value || "0")
})

const handleSubmit = () => {
  // In a real app, this would save to the database
  console.log({
    date: date.value,
    pocketId: pocketId.value,
    brand: brand.value,
    weight: parseFloat(weight.value),
    pricePerGram: parseFloat(pricePerGram.value),
    totalPrice: totalPrice.value,
    description: description.value,
  })
  emit('update:open', false)
  // Reset form
  date.value = new Date()
  pocketId.value = props.defaultPocketId || ""
  brand.value = ""
  weight.value = ""
  pricePerGram.value = ""
  description.value = ""
}

// Simple date picker using native input for now
const dateString = computed({
  get: () => format(date.value, 'yyyy-MM-dd'),
  set: (val) => date.value = new Date(val)
})
</script>

<template>
  <Sheet :open="open" @update:open="$emit('update:open', $event)">
    <div class="h-full flex flex-col">
      <div class="text-left pb-4">
        <h2 class="text-lg font-semibold">Add Transaction</h2>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4 overflow-y-auto pb-8 flex-1">
        <!-- Pocket Selection -->
        <div class="space-y-2">
          <Label>Pocket</Label>
          <select
            v-model="pocketId"
            class="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="" disabled>Select a pocket</option>
            <option v-for="pocket in pockets" :key="pocket.id" :value="pocket.id">
              {{ pocket.name }}
            </option>
          </select>
        </div>

        <!-- Date -->
        <div class="space-y-2">
          <Label>Transaction Date</Label>
          <input
            type="date"
            v-model="dateString"
            class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <!-- Brand -->
        <div class="space-y-2">
          <Label>Gold Brand</Label>
          <select
            v-model="brand"
            class="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="" disabled>Select brand</option>
            <option v-for="b in goldBrands" :key="b" :value="b">
              {{ b }}
            </option>
          </select>
        </div>

        <!-- Weight -->
        <div class="space-y-2">
          <Label>Weight (grams)</Label>
          <Input
            type="number"
            step="0.01"
            placeholder="0.00"
            v-model="weight"
          />
        </div>

        <!-- Price per gram -->
        <div class="space-y-2">
          <Label>Price per Gram (IDR)</Label>
          <Input
            type="number"
            step="1000"
            placeholder="0"
            v-model="pricePerGram"
          />
        </div>

        <!-- Total Price (calculated) -->
        <div class="p-4 bg-muted rounded-xl">
          <div class="flex items-center justify-between">
            <span class="text-sm text-muted-foreground">Total Price</span>
            <span class="text-xl font-bold">{{ formatCurrency(totalPrice) }}</span>
          </div>
        </div>

        <!-- Description -->
        <div class="space-y-2">
          <Label>Description (Optional)</Label>
          <Textarea
            placeholder="Add notes about this transaction..."
            v-model="description"
            rows="2"
          />
        </div>

        <!-- Receipt Upload -->
        <div class="space-y-2">
          <Label>Receipt Photo (Optional)</Label>
          <button
            type="button"
            class="w-full h-24 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-2 text-muted-foreground hover:bg-muted/50 transition-colors"
          >
            <Icon name="lucide:image-plus" class="h-6 w-6" />
            <span class="text-sm">Upload receipt image</span>
          </button>
        </div>

        <!-- Submit Button -->
        <Button
          type="submit"
          class="w-full h-12 text-base"
          :disabled="!pocketId || !brand || !weight || !pricePerGram"
        >
          Save Transaction
        </Button>
      </form>
    </div>
  </Sheet>
</template>
