<template>
  <main class="mx-auto max-w-2xl px-6 py-12">
    <div class="mb-8 flex items-center gap-4">
      <NuxtLink to="/admin/orders" class="flex h-10 w-10 items-center justify-center rounded-lg border bg-white hover:bg-gray-50">
        <ArrowLeft class="h-5 w-5 text-gray-600" />
      </NuxtLink>
      <h1 class="text-2xl font-bold">Créer une commande</h1>
    </div>

    <div class="rounded-xl border bg-white p-6">
      <p class="text-gray-600">Le formulaire de création de commande sera disponible bientôt.</p>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'
useHead({ title: 'Admin | Créer une commande' })
definePageMeta({ layout: 'admin' })
</script>
