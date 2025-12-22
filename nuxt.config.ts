// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  buildModules: [],
  extends: [],
  runtimeConfig: {
    huggingfaceApiKey: process.env.HUGGINGFACE_API_KEY,
    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY,
      supabaseStorageBucket: process.env.NUXT_PUBLIC_SUPABASE_STORAGE_BUCKET,
      otpResendDelay: process.env.NUXT_PUBLIC_OTP_RESEND_DELAY || '30'
    }
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxt/image'
  ],
  css: ['~/assets/css/tailwind.css'],
  image: {
    domains: ['lh3.googleusercontent.com']
  },
  app: {
    head: {
      title: 'Wa-Shop | Créez votre boutique WhatsApp gratuite',
      meta: [
        { name: 'description', content: 'La solution la plus simple pour les commerçants camerounais. Créez un catalogue produit et recevez vos commandes directement sur WhatsApp Business. Simple, rapide et gratuit.' },
        { property: 'og:title', content: 'Wa-Shop | Catalogue WhatsApp simple' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap' }
      ]
    }
  },
  vite: {
    server: {
      watch: {
        usePolling: true,
        interval: 500
      }
    }
  }
})
