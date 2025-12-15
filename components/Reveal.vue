<template>
  <component :is="as" ref="el" :class="classes" :style="style"><slot /></component>
</template>

<script setup>
const props = defineProps({
  as: { type: String, default: 'div' },
  delay: { type: Number, default: 0 }
})
const el = ref(null)
const shown = ref(false)
const classes = computed(() => ({ 'animate-fade-in': true, 'is-visible': shown.value }))
const style = computed(() => ({ transitionDelay: `${props.delay}ms` }))
onMounted(() => {
  const target = el.value
  if (!target) { shown.value = true; return }
  const io = new IntersectionObserver(([entry]) => {
    if (entry && entry.isIntersecting) { shown.value = true; io.disconnect() }
  }, { threshold: 0.15 })
  io.observe(target)
})
</script>
