<template>
  <div class="min-h-screen bg-background-light text-text-light">
    <MarketingHeader />

    <section class="relative pt-20 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
      <div class="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-gradient-to-r from-primary to-blue-500 opacity-20 blur-3xl animate-gradient-x animate-blob"></div>
      <div class="mx-auto max-w-7xl px-4 text-center">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold uppercase tracking-wide mb-6">
          <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          {{ t('home.officialPartner') }}
        </div>
        <h1 class="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight mb-6">
          {{ t('home.heroPrefix') }} <br class="hidden sm:block" />
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-600">{{ t('home.heroWhatsApp') }}</span>
        </h1>
        <p class="mx-auto max-w-2xl text-lg sm:text-xl text-gray-600 mb-10 leading-relaxed">
          {{ t('home.heroSubtitle') }}
        </p>
        <div class="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12">
          <NuxtLink to="/auth/register" class="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-xl font-bold shadow-lg hover:brightness-95 transition">
            {{ t('home.ctaStartFree') }}
          </NuxtLink>
          <div class="flex items-center gap-1 text-sm text-gray-500">
            <span class="flex text-yellow-400">
              <Star class="w-4 h-4" />
              <Star class="w-4 h-4" />
              <Star class="w-4 h-4" />
              <Star class="w-4 h-4" />
              <Star class="w-4 h-4" />
            </span>
            <span>{{ t('home.reviews') }}</span>
          </div>
        </div>

        <Reveal>
        <div class="relative max-w-sm mx-auto z-10 animate-float">
          <div class="absolute -inset-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-3xl blur opacity-30 animate-pulse"></div>
          <div class="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
            <NuxtImg src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1XoaXI7XiylmLsCTFOnRe7iBc73eacPih7DhcP6R1NN9bXy0Y1ok0U-an3PAcSpRBpjGlnnzqTaaojI7yMTa23a4MgZ6FapKMHQc0KW1e2nkN3rfA-xH09ZvUizk3OXw91EHh5mrwgA3IN7azf2-7js1EOzqVnypihLBIHUJIWJEwW0PR1nJqVgBKYMO2A53YU3OdnwJL9TjnKJg-3uxU16MJIFG0GvONyGpmuEkxoEMb9WPoUzAhMwFTDtNrUa-PaHrc8Spc1hk" alt="Mobile Mock" width="640" height="800" sizes="(max-width: 640px) 100vw, 640px" class="w-full h-auto object-cover opacity-90 hover:scale-105 transition-transform duration-500" />
            <div class="absolute inset-0 bg-black/5 flex flex-col items-center justify-center pointer-events-none">
              <div class="w-3/4 bg-white p-3 rounded-lg shadow-md mb-2 mr-8 transform -rotate-1">
                <div class="h-2 w-1/2 bg-gray-200 rounded mb-2"></div>
                <div class="h-2 w-3/4 bg-gray-200 rounded"></div>
              </div>
              <div class="w-3/4 bg-primary p-3 rounded-lg shadow-md ml-8 transform rotate-1">
                <div class="h-2 w-2/3 bg-white/80 rounded mb-2"></div>
                <div class="h-2 w-1/2 bg-white/60 rounded"></div>
              </div>
            </div>
          </div>
        </div>
        </Reveal>

        <div class="mt-16 pt-8 border-t border-gray-100">
          <p class="text-sm font-medium text-gray-500 mb-6 uppercase tracking-wider">{{ t('home.trustedBy') }}</p>
          <div class="flex flex-wrap justify-center items-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <span class="text-xl font-bold text-gray-400">Meta</span>
            <span class="text-xl font-bold text-gray-400">Stripe</span>
            <span class="text-xl font-bold text-gray-400">PayPal</span>
            <span class="text-xl font-bold text-gray-400">TechCrunch</span>
          </div>
        </div>
      </div>
    </section>

    <section class="py-20 bg-surface-light">
      <div class="mx-auto max-w-7xl px-4">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold sm:text-4xl">{{ t('home.sectionSimplifyTitle') }}</h2>
          <p class="mt-4 text-gray-600">{{ t('home.sectionSimplifyDesc') }}</p>
        </div>

        <div class="grid gap-12">
          <Reveal>
          <div class="group relative bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-gray-100 hover:shadow-xl transition-shadow flex flex-col md:flex-row items-center gap-12 overflow-hidden">
            <div class="flex-1 text-left z-10">
              <div class="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6">
                <Package class="w-6 h-6" />
              </div>
              <h3 class="text-2xl font-bold mb-4">{{ t('home.featureOrderFormTitle') }}</h3>
              <p class="text-gray-600 mb-6">{{ t('home.featureOrderFormDesc') }}</p>
              <NuxtLink to="/products" class="text-green-600 font-semibold hover:underline inline-flex items-center gap-1">{{ t('common.learnMore') }} <ArrowRight class="w-4 h-4" /></NuxtLink>
            </div>
            <div class="flex-1 w-full max-w-md relative z-10">
              <div class="relative bg-gray-900 rounded-[2.5rem] border-8 border-gray-900 shadow-2xl overflow-hidden aspect-[9/18] mx-auto">
                <div class="absolute inset-0 bg-white flex flex-col">
                  <div class="bg-primary p-4 text-white text-center font-bold">{{ t('home.featureOrderFormTitle') }}</div>
                  <div class="p-4 space-y-3">
                    <div class="flex items-center gap-2">
                      <div class="w-10 h-10 bg-gray-200 rounded-lg"></div>
                      <div class="flex-1">
                        <div class="h-3 w-20 bg-gray-200 rounded mb-1"></div>
                        <div class="h-2 w-12 bg-gray-100 rounded"></div>
                      </div>
                      <div class="w-16 h-8 bg-green-100 text-green-700 rounded text-xs flex items-center justify-center">Add +</div>
                    </div>
                    <div class="flex items-center gap-2">
                      <div class="w-10 h-10 bg-gray-200 rounded-lg"></div>
                      <div class="flex-1">
                        <div class="h-3 w-24 bg-gray-200 rounded mb-1"></div>
                        <div class="h-2 w-10 bg-gray-100 rounded"></div>
                      </div>
                      <div class="w-16 h-8 bg-green-100 text-green-700 rounded text-xs flex items-center justify-center">Add +</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </Reveal>

          <Reveal :delay="100">
          <div class="group relative bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-gray-100 hover:shadow-xl transition-shadow flex flex-col md:flex-row-reverse items-center gap-12 overflow-hidden">
            <div class="flex-1 text-left z-10">
              <div class="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6">
                <LayoutDashboard class="w-6 h-6" />
              </div>
              <h3 class="text-2xl font-bold mb-4">{{ t('home.featureOrderMgmtTitle') }}</h3>
              <p class="text-gray-600 mb-6">{{ t('home.featureOrderMgmtDesc') }}</p>
              <NuxtLink to="/products" class="text-green-600 font-semibold hover:underline inline-flex items-center gap-1">{{ t('common.learnMore') }} <ArrowRight class="w-4 h-4" /></NuxtLink>
            </div>
            <div class="flex-1 w-full max-w-md relative z-10">
              <div class="bg-surface-light rounded-xl shadow-lg p-6 border border-gray-200">
                <div class="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
                  <span class="font-bold text-sm">{{ t('preview.order') }}</span>
                  <span class="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">{{ t('preview.pending') }}</span>
                </div>
                <div class="space-y-3">
                  <div class="h-2 bg-gray-200 rounded w-3/4"></div>
                  <div class="h-2 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div class="mt-4 flex gap-2">
                  <button class="flex-1 bg-primary text-white text-xs py-2 rounded">{{ t('preview.accept') }}</button>
                  <button class="flex-1 bg-gray-200 text-gray-700 text-xs py-2 rounded">{{ t('preview.decline') }}</button>
                </div>
              </div>
            </div>
          </div>
          </Reveal>

          <Reveal :delay="200">
          
          </Reveal>
        </div>
      </div>
    </section>

    <section class="py-20 gradient-green">
      <div class="mx-auto max-w-7xl px-4">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold sm:text-4xl">{{ t('home.websiteTitle') }}</h2>
          <p class="mt-4 text-gray-600">{{ t('home.websiteDesc') }}</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          <div class="bg-purple-50 rounded-2xl p-6 md:p-8 hover:bg-purple-100 transition-colors">
            <h3 class="text-xl font-bold mb-2">{{ t('home.cardCatalogsTitle') }}</h3>
            <p class="text-sm text-gray-600 mb-6">{{ t('home.cardCatalogsDesc') }}</p>
            <div class="bg-white rounded-xl shadow-lg p-4 h-64 flex flex-col justify-center items-center">
              <div class="grid grid-cols-2 gap-2 w-full">
                <div class="bg-gray-100 h-24 rounded-lg"></div>
                <div class="bg-gray-100 h-24 rounded-lg"></div>
              </div>
            </div>
          </div>
          <div class="bg-pink-50 rounded-2xl p-6 md:p-8 hover:bg-pink-100 transition-colors">
            <h3 class="text-xl font-bold mb-2">{{ t('home.cardDomainTitle') }}</h3>
            <p class="text-sm text-gray-600 mb-6">{{ t('home.cardDomainDesc') }}</p>
              <div class="bg-white rounded-xl shadow-lg p-4 h-64 flex justify-center items-center">
              <div class="bg-gray-100 px-4 py-2 rounded-lg flex items-center gap-2 w-3/4">
                <Lock class="w-4 h-4 text-gray-400" />
                <span class="text-gray-800 font-mono text-sm">my-store.com</span>
              </div>
              </div>
          </div>
          <div class="bg-orange-50 rounded-2xl p-6 md:p-8 hover:bg-orange-100 transition-colors">
            <h3 class="text-xl font-bold mb-2">{{ t('home.cardLinkBioTitle') }}</h3>
            <p class="text-sm text-gray-600 mb-6">{{ t('home.cardLinkBioDesc') }}</p>
            <div class="bg-white rounded-xl shadow-lg p-4 h-64 flex justify-center items-center overflow-hidden">
              <div class="w-32 bg-gray-900 rounded-[20px] p-2 h-full border-4 border-gray-900">
                <div class="bg-white w-full h-full rounded-[14px] flex flex-col items-center pt-4 px-2 space-y-2">
                  <div class="w-8 h-8 rounded-full bg-gray-300"></div>
                  <div class="w-full h-8 bg-primary/20 rounded-md"></div>
                  <div class="w-full h-8 bg-primary/20 rounded-md"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-green-50 rounded-2xl p-6 md:p-8 hover:bg-green-100 transition-colors">
            <h3 class="text-xl font-bold mb-2">{{ t('home.cardSeoTitle') }}</h3>
            <p class="text-sm text-gray-600 mb-6">{{ t('home.cardSeoDesc') }}</p>
            <div class="bg-white rounded-xl shadow-lg p-4 h-64 flex justify-center items-center">
              <div class="w-full space-y-3">
                <div class="h-4 bg-green-700 w-1/3 rounded"></div>
                <div class="h-3 bg-green-500 w-1/2 rounded"></div>
                <div class="h-2 bg-gray-200 w-full rounded"></div>
                <div class="h-2 bg-gray-200 w-5/6 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <MarketingFooter />
  </div>
</template>

<script setup>
import { Star, Package, LayoutDashboard, ArrowRight, Lock } from 'lucide-vue-next'
import { useI18n } from '~/composables/i18n'
const { t, locale, setLocale } = useI18n()
useHead({
  title: `${t('home.title')} | ${t('home.description')}`,
  meta: [
    { name: 'description', content: t('home.description') },
    { property: 'og:title', content: `${t('home.title')} | ${t('home.sectionSimplifyTitle')}` }
  ]
})
</script>

<style>
.gradient-green {
  background: linear-gradient(135deg, #dcfce7 0%, #ffffff 100%);
}
</style>
