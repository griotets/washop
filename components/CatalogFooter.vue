<template>
  <footer class="border-t bg-white mt-auto">
    <div class="mx-auto max-w-6xl px-4 py-8">
      <div class="flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="text-sm text-gray-600">
          <div>{{ t('footer.poweredBy') }}</div>
          <div class="mt-2"><NuxtLink to="/resources" class="text-gray-600 hover:text-primary">{{ t('footer.terms') }}</NuxtLink></div>
        </div>

        <!-- Social Links -->
        <div v-if="hasSocialLinks" class="flex items-center gap-4">
          <a v-if="social.whatsapp" :href="social.whatsapp" target="_blank" rel="noopener" class="text-gray-400 hover:text-green-500 transition-colors" title="WhatsApp">
            <MessageCircle class="h-6 w-6" />
          </a>
          <a v-if="social.facebook" :href="social.facebook" target="_blank" rel="noopener" class="text-gray-400 hover:text-blue-600 transition-colors" title="Facebook">
            <Facebook class="h-6 w-6" />
          </a>
          <a v-if="social.instagram" :href="social.instagram" target="_blank" rel="noopener" class="text-gray-400 hover:text-pink-600 transition-colors" title="Instagram">
            <Instagram class="h-6 w-6" />
          </a>
          <a v-if="social.telegram" :href="social.telegram" target="_blank" rel="noopener" class="text-gray-400 hover:text-blue-400 transition-colors" title="Telegram">
            <Send class="h-6 w-6" />
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { MessageCircle, Facebook, Instagram, Send } from 'lucide-vue-next'
import { computed } from 'vue'
import { useI18n } from '~/composables/i18n'

const props = withDefaults(defineProps<{
  social?: {
    whatsapp?: string
    facebook?: string
    instagram?: string
    telegram?: string
  }
}>(), {
  social: () => ({
    whatsapp: '',
    facebook: '',
    instagram: '',
    telegram: ''
  })
})

const hasSocialLinks = computed(() => {
  return props.social?.whatsapp || props.social?.facebook || props.social?.instagram || props.social?.telegram
})

const { t } = useI18n()
</script>
