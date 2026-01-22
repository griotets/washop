<template>
  <footer class="border-t bg-white">
    <div class="mx-auto max-w-6xl px-6 py-10">
      <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div class="text-xl font-bold">Wa-Shop</div>
          <p class="mt-2 text-gray-600">{{ t('footer.tagline') }}</p>
        </div>
        <div>
          <div class="font-semibold">{{ t('footer.company') }}</div>
          <ul class="mt-2 space-y-2 text-gray-600">
            <li><NuxtLink to="/about_us">{{ t('footer.about') }}</NuxtLink></li>
            <li><a href="mailto:contact@wa-shop.cm">{{ t('footer.contact') }}</a></li>
          </ul>
        </div>
        <div>
          <div class="font-semibold">{{ t('footer.products') }}</div>
          <ul class="mt-2 space-y-2 text-gray-600">
            <li><NuxtLink to="/products">{{ t('footer.features') }}</NuxtLink></li>
            <li><NuxtLink to="/pricing">{{ t('footer.pricing') }}</NuxtLink></li>
          </ul>
        </div>
        <div>
          <div class="font-semibold">{{ t('footer.legal') }}</div>
          <ul class="mt-2 space-y-2 text-gray-600">
            <li><NuxtLink to="/cgu">{{ t('footer.terms') }}</NuxtLink></li>
            <li><NuxtLink to="/privacy">{{ t('footer.privacy') }}</NuxtLink></li>
            <li><NuxtLink to="/legal">{{ t('legal.title') }}</NuxtLink></li>
          </ul>
        </div>
      </div>
      <div class="mt-8 text-sm text-gray-500">{{ t('footer.poweredBy') }}</div>
    </div>
  </footer>
</template>

<script setup>
import { useI18n } from '~/composables/i18n'
const { t } = useI18n()
</script>
