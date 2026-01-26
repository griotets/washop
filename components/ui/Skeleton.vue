<template>
  <div class="animate-pulse rounded bg-gray-200" :class="[className]"></div>
</template>

<script setup lang="ts">
defineProps<{
  className?: string
}>()
</script>
