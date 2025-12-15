<template>
  <main class="mx-auto max-w-7xl px-6 py-12">
    <section>
      <h1 class="text-3xl font-bold">{{ content.title }}</h1>
      <p class="mt-3 text-gray-700">{{ content.lead }}</p>
      <p class="mt-2 text-gray-600">{{ content.subtitle }}</p>
      <div class="mt-6 flex flex-wrap gap-3">
        <span v-for="b in content.benefits" :key="b" class="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-sm text-green-700">
          <span class="material-icons text-sm">check_circle</span>{{ b }}
        </span>
      </div>
    </section>

    <section class="mt-10 grid gap-6 md:grid-cols-2">
      <div v-for="f in content.features" :key="f.title" class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div class="flex items-center gap-3">
          <span v-if="f.icon" class="material-icons text-primary">{{ f.icon }}</span>
          <div class="text-lg font-semibold">{{ f.title }}</div>
        </div>
        <div class="mt-2 text-gray-600">{{ f.description }}</div>
      </div>
    </section>

    <section class="mt-12 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
      <div class="grid gap-6 sm:grid-cols-3">
        <div v-for="k in content.kpis" :key="k.label" class="text-center">
          <div class="text-3xl font-extrabold">{{ k.value }}</div>
          <div class="mt-1 text-sm text-gray-600">{{ k.label }}</div>
        </div>
      </div>
    </section>

    <div class="mt-10">
      <NuxtLink to="/auth/register" class="rounded-lg bg-primary px-5 py-2 font-semibold text-white">Start for Free</NuxtLink>
    </div>
  </main>
</template>

<script setup>
import { getIndustryContent } from '~/data/industry.js'
const route = useRoute()
const slug = computed(() => String(route.params.category || ''))
const content = computed(() => getIndustryContent(slug.value) || { title: slug.value, lead: 'Industry', subtitle: '', benefits: [], features: [], kpis: [] })
useHead({ title: `${content.value.title} | Wa-Shop Cameroun`, meta: [{ name: 'description', content: content.value.subtitle }] })
</script>
