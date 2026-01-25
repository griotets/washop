<template>
  <div class="relative group" ref="container">
    <div class="relative">
      <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <MapPin class="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        v-model="query"
        @input="onInput"
        @focus="showResults = true"
        class="block w-full rounded-lg border-gray-300 pl-10 focus:border-primary focus:ring-primary sm:text-sm"
        :placeholder="placeholder || 'Rechercher un quartier, une rue...'"
        autocomplete="off"
      />
      <div v-if="loading" class="absolute inset-y-0 right-0 flex items-center pr-3">
        <Loader2 class="h-4 w-4 animate-spin text-gray-400" />
      </div>
      <button 
        v-else-if="query" 
        @click="clear" 
        class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
      >
        <X class="h-4 w-4" />
      </button>
    </div>

    <div
      v-if="showResults && results.length > 0"
      class="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
    >
      <div
        v-for="(result, index) in results"
        :key="index"
        @click="select(result)"
        class="relative cursor-pointer select-none py-2 pl-3 pr-9 hover:bg-gray-100 text-gray-900"
      >
        <div class="flex flex-col">
          <span class="font-medium block truncate">{{ formatMainText(result) }}</span>
          <span class="text-xs text-gray-500 block truncate">{{ formatSecondaryText(result) }}</span>
        </div>
      </div>
    </div>
    
    <div v-if="showResults && query.length > 2 && results.length === 0 && !loading" class="absolute z-50 mt-1 w-full rounded-md bg-white p-3 text-center text-sm text-gray-500 shadow-lg border">
      Aucun résultat trouvé au Cameroun
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { MapPin, Loader2, X } from 'lucide-vue-next'

const props = defineProps<{
  placeholder?: string
  initialValue?: string
}>()

const emit = defineEmits<{
  (e: 'select', address: { city: string; address: string; full: any }): void
}>()

const query = ref('')
const results = ref<any[]>([])
const loading = ref(false)
const showResults = ref(false)
const container = ref<HTMLElement | null>(null)
let debounceTimer: any = null

onMounted(() => {
  if (props.initialValue) query.value = props.initialValue
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

function handleClickOutside(e: MouseEvent) {
  if (container.value && !container.value.contains(e.target as Node)) {
    showResults.value = false
  }
}

function clear() {
  query.value = ''
  results.value = []
}

function onInput() {
  showResults.value = true
  if (debounceTimer) clearTimeout(debounceTimer)
  
  if (query.value.length < 3) {
    results.value = []
    return
  }

  debounceTimer = setTimeout(search, 400)
}

async function search() {
  loading.value = true
  try {
    const q = encodeURIComponent(query.value)
    // Limit to Cameroon (countrycodes=cm)
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${q}&countrycodes=cm&addressdetails=1&limit=5&accept-language=fr`, {
      headers: {
        'Accept-Language': 'fr'
      }
    })
    const data = await response.json()
    results.value = data
  } catch (e) {
    console.error('OSM Search error:', e)
  } finally {
    loading.value = false
  }
}

function formatMainText(item: any) {
  const a = item.address || {}
  // Prefer neighbourhood, suburb, or road
  return a.neighbourhood || a.suburb || a.road || a.city || a.town || a.village || item.name
}

function formatSecondaryText(item: any) {
  const a = item.address || {}
  const parts = []
  if (a.city && a.city !== formatMainText(item)) parts.push(a.city)
  else if (a.town && a.town !== formatMainText(item)) parts.push(a.town)
  else if (a.village && a.village !== formatMainText(item)) parts.push(a.village)
  
  if (a.state) parts.push(a.state)
  return parts.join(', ')
}

function select(item: any) {
  const a = item.address || {}
  
  // Logic to extract relevant fields
  // City: city > town > village > county
  const city = a.city || a.town || a.village || a.county || ''
  
  // Address: road, house_number, neighbourhood, suburb
  const parts = []
  if (a.house_number) parts.push(a.house_number)
  if (a.road) parts.push(a.road)
  if (a.neighbourhood) parts.push(a.neighbourhood)
  if (a.suburb) parts.push(a.suburb)
  
  // If we selected a specific POI that isn't one of above
  if (!parts.includes(item.name) && item.name !== city) {
     parts.unshift(item.name)
  }

  const address = parts.join(', ')
  
  emit('select', { city, address, full: item })
  query.value = item.display_name
  showResults.value = false
}
</script>