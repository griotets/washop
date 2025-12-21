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
          <a href="#how-it-works" class="w-full sm:w-auto px-8 py-4 border border-gray-300 bg-white rounded-xl font-bold hover:bg-gray-50 transition">
            {{ t('home.ctaHowItWorks') }}
          </a>
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
              <div class="relative">
                <div class="pointer-events-none absolute -inset-6 bg-gradient-to-r from-green-400 to-blue-500 opacity-15 blur-2xl rounded-[3rem]"></div>
                <div class="relative bg-gray-900 rounded-[2.5rem] border-8 border-gray-900 shadow-2xl overflow-hidden aspect-[9/18] mx-auto">
                  <div class="absolute inset-0 bg-white flex flex-col">
                    <div class="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div class="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center">
                          <Package class="w-4 h-4 text-primary" />
                        </div>
                        <div class="text-sm font-bold leading-none">{{ t('home.demoHeader') }}</div>
                      </div>
                      <div class="relative">
                        <ShoppingBag class="w-5 h-5 text-gray-700" />
                        <div v-if="demoCartCount > 0" class="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">{{ demoCartCount }}</div>
                      </div>
                    </div>

                    <div class="p-4 space-y-3">
                      <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ t('home.demoPickTitle') }}</div>

                      <div class="rounded-2xl border border-gray-200 bg-white p-3 flex items-center gap-3 transition" :class="demoIsAdded(0) ? 'shadow-sm ring-2 ring-green-200' : ''">
                        <div class="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center">
                          <div class="w-6 h-6 rounded bg-gray-200"></div>
                        </div>
                        <div class="flex-1">
                          <div class="text-sm font-semibold">{{ t('home.demoProduct1Name') }}</div>
                          <div class="text-xs text-gray-500">{{ t('home.demoProduct1Price') }}</div>
                        </div>
                        <button class="h-9 px-3 rounded-xl text-xs font-bold flex items-center gap-2 transition" :class="demoIsAdded(0) ? 'bg-green-100 text-green-700' : 'bg-gray-900 text-white'">
                          <span>{{ demoIsAdded(0) ? t('home.demoAdded') : t('home.demoAdd') }}</span>
                          <span class="text-base leading-none" :class="demoIsAdded(0) ? '' : 'opacity-90'">{{ demoIsAdded(0) ? '✓' : '+' }}</span>
                        </button>
                      </div>

                      <div class="rounded-2xl border border-gray-200 bg-white p-3 flex items-center gap-3 transition" :class="demoIsAdded(1) ? 'shadow-sm ring-2 ring-green-200' : ''">
                        <div class="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center">
                          <div class="w-6 h-6 rounded bg-gray-200"></div>
                        </div>
                        <div class="flex-1">
                          <div class="text-sm font-semibold">{{ t('home.demoProduct2Name') }}</div>
                          <div class="text-xs text-gray-500">{{ t('home.demoProduct2Price') }}</div>
                        </div>
                        <button class="h-9 px-3 rounded-xl text-xs font-bold flex items-center gap-2 transition" :class="demoIsAdded(1) ? 'bg-green-100 text-green-700' : 'bg-gray-900 text-white'">
                          <span>{{ demoIsAdded(1) ? t('home.demoAdded') : t('home.demoAdd') }}</span>
                          <span class="text-base leading-none" :class="demoIsAdded(1) ? '' : 'opacity-90'">{{ demoIsAdded(1) ? '✓' : '+' }}</span>
                        </button>
                      </div>
                    </div>

                    <div class="mt-auto p-4">
                      <div class="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                        <div class="flex items-center justify-between mb-3">
                          <div class="text-sm font-bold">{{ t('home.demoTotal') }}</div>
                          <div class="text-sm font-extrabold">{{ demoTotalLabel }}</div>
                        </div>
                        <button class="w-full rounded-2xl py-3 text-sm font-extrabold text-white transition" :class="demoSendActive ? 'bg-primary shadow-lg shadow-primary/30' : 'bg-gray-300 cursor-not-allowed'">
                          {{ t('home.demoSendWhatsApp') }}
                        </button>
                      </div>
                    </div>

                    <div class="absolute left-4 right-4 bottom-28 transition-all duration-500" :class="demoSentToastVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'">
                      <div class="rounded-2xl bg-gray-900 text-white px-4 py-3 shadow-xl">
                        <div class="text-sm font-semibold">{{ t('home.demoSentToast') }}</div>
                        <div class="text-xs text-white/70">{{ t('home.demoSentToastSub') }}</div>
                      </div>
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
          <div class="group relative bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-gray-100 hover:shadow-xl transition-shadow flex flex-col md:flex-row items-center gap-12 overflow-hidden">
            <div class="flex-1 text-left z-10">
              <div class="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6">
                <MessageCircle class="w-6 h-6" />
              </div>
              <h3 class="text-2xl font-bold mb-4">{{ t('home.featureUpdatesTitle') }}</h3>
              <p class="text-gray-600 mb-6">{{ t('home.featureUpdatesDesc') }}</p>
              <NuxtLink to="/products" class="text-green-600 font-semibold hover:underline inline-flex items-center gap-1">{{ t('common.learnMore') }} <ArrowRight class="w-4 h-4" /></NuxtLink>
            </div>
            <div class="flex-1 w-full max-w-md relative z-10">
              <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div class="bg-gray-900 text-white px-4 py-3 text-sm font-semibold flex items-center justify-between">
                  <span>WhatsApp</span>
                  <span class="text-xs text-white/70">{{ t('home.updatesPreview') }}</span>
                </div>
                <div class="p-4 space-y-3">
                  <div class="flex justify-start">
                    <div class="max-w-[85%] bg-gray-100 rounded-2xl rounded-tl-md px-4 py-3">
                      <div class="text-sm font-medium">{{ t('home.chatCustomer') }}</div>
                      <div class="text-sm text-gray-700">{{ t('home.chatCustomerMsg') }}</div>
                    </div>
                  </div>
                  <div class="flex justify-end">
                    <div class="max-w-[85%] bg-primary text-white rounded-2xl rounded-tr-md px-4 py-3">
                      <div class="text-sm font-medium">{{ t('home.chatStore') }}</div>
                      <div class="text-sm text-white/90">{{ currentUpdateMessage }}</div>
                    </div>
                  </div>
                  <div class="flex justify-start">
                    <div class="max-w-[85%] bg-gray-100 rounded-2xl rounded-tl-md px-4 py-3">
                      <div class="text-sm text-gray-700">{{ t('home.chatCustomerOk') }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </Reveal>
        </div>
      </div>
    </section>

    <section id="how-it-works" class="py-20 bg-white">
      <div class="mx-auto max-w-7xl px-4">
        <div class="text-center mb-14">
          <h2 class="text-3xl font-bold sm:text-4xl">{{ t('home.howItWorksTitle') }}</h2>
          <p class="mt-4 text-gray-600">{{ t('home.howItWorksDesc') }}</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div class="space-y-4">
            <div class="flex gap-4 rounded-2xl border border-gray-200 p-5 bg-surface-light">
              <div class="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center font-bold">1</div>
              <div>
                <div class="font-bold">{{ t('home.step1Title') }}</div>
                <div class="text-gray-600">{{ t('home.step1Desc') }}</div>
              </div>
            </div>
            <div class="flex gap-4 rounded-2xl border border-gray-200 p-5 bg-surface-light">
              <div class="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center font-bold">2</div>
              <div>
                <div class="font-bold">{{ t('home.step2Title') }}</div>
                <div class="text-gray-600">{{ t('home.step2Desc') }}</div>
              </div>
            </div>
            <div class="flex gap-4 rounded-2xl border border-gray-200 p-5 bg-surface-light">
              <div class="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center font-bold">3</div>
              <div>
                <div class="font-bold">{{ t('home.step3Title') }}</div>
                <div class="text-gray-600">{{ t('home.step3Desc') }}</div>
              </div>
            </div>
            <div class="flex gap-4 rounded-2xl border border-gray-200 p-5 bg-surface-light">
              <div class="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center font-bold">4</div>
              <div>
                <div class="font-bold">{{ t('home.step4Title') }}</div>
                <div class="text-gray-600">{{ t('home.step4Desc') }}</div>
              </div>
            </div>
          </div>

          <div class="relative">
            <div class="absolute -inset-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-3xl blur opacity-20"></div>
            <div class="relative bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
              <div class="p-5 border-b border-gray-100 flex items-center justify-between">
                <div class="font-bold">{{ t('home.flowTitle') }}</div>
                <div class="text-xs text-gray-500">{{ t('home.flowSubtitle') }}</div>
              </div>
              <div class="p-5 space-y-3">
                <div class="flex items-center justify-between rounded-2xl border border-gray-200 p-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                      <ShoppingBag class="w-5 h-5 text-gray-700" />
                    </div>
                    <div>
                      <div class="font-semibold">{{ t('home.flowOrderTitle') }}</div>
                      <div class="text-sm text-gray-600">{{ t('home.flowOrderDesc') }}</div>
                    </div>
                  </div>
                  <div class="text-xs font-semibold px-2 py-1 rounded-full" :class="flowBadgeClass">{{ flowBadgeText }}</div>
                </div>

                <div class="grid grid-cols-3 gap-3">
                  <div class="rounded-2xl border border-gray-200 p-4 bg-surface-light">
                    <div class="flex items-center gap-2 mb-2">
                      <CheckCircle2 class="w-4 h-4 text-green-600" />
                      <div class="text-sm font-semibold">{{ t('home.flowConfirmTitle') }}</div>
                    </div>
                    <div class="text-xs text-gray-600">{{ t('home.flowConfirmDesc') }}</div>
                  </div>
                  <div class="rounded-2xl border border-gray-200 p-4 bg-surface-light">
                    <div class="flex items-center gap-2 mb-2">
                      <Truck class="w-4 h-4 text-green-600" />
                      <div class="text-sm font-semibold">{{ t('home.flowDeliveryTitle') }}</div>
                    </div>
                    <div class="text-xs text-gray-600">{{ t('home.flowDeliveryDesc') }}</div>
                  </div>
                  <div class="rounded-2xl border border-gray-200 p-4 bg-surface-light">
                    <div class="flex items-center gap-2 mb-2">
                      <MessageCircle class="w-4 h-4 text-green-600" />
                      <div class="text-sm font-semibold">{{ t('home.flowUpdatesTitle') }}</div>
                    </div>
                    <div class="text-xs text-gray-600">{{ t('home.flowUpdatesDesc') }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>


    <section class="py-20 bg-surface-light">
      <div class="mx-auto max-w-7xl px-4">
        <div class="relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-8 lg:p-12">
          <div class="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gradient-to-r from-green-400 to-blue-500 opacity-15 blur-3xl"></div>
          <div class="max-w-2xl">
            <h2 class="text-3xl font-extrabold sm:text-4xl">{{ t('home.endCtaTitle') }}</h2>
            <p class="mt-4 text-gray-600">{{ t('home.endCtaDesc') }}</p>
            <div class="mt-8 flex flex-col sm:flex-row gap-3">
              <NuxtLink to="/auth/register" class="px-8 py-4 bg-primary text-white rounded-xl font-bold shadow-lg hover:brightness-95 transition">
                {{ t('home.endCtaButton') }}
              </NuxtLink>
              <a href="#how-it-works" class="px-8 py-4 border border-gray-300 bg-white rounded-xl font-bold hover:bg-gray-50 transition">
                {{ t('home.ctaHowItWorks') }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <MarketingFooter />
  </div>
</template>

<script setup>
import { Star, Package, LayoutDashboard, ArrowRight, Palette, MessageCircle, ShoppingBag, CheckCircle2, Truck } from 'lucide-vue-next'
import { useI18n } from '~/composables/i18n'
const { t, locale, setLocale } = useI18n()

const orderDemoStep = ref(0)
const demoIsAdded = (idx) => orderDemoStep.value >= idx + 1
const demoCartCount = computed(() => {
  if (orderDemoStep.value === 0) return 0
  if (orderDemoStep.value === 1) return 1
  return 2
})
const demoTotalLabel = computed(() => {
  if (orderDemoStep.value === 0) return '0'
  if (orderDemoStep.value === 1) return t('home.demoTotal1')
  return t('home.demoTotal2')
})
const demoSendActive = computed(() => demoCartCount.value > 0)
const demoSentToastVisible = computed(() => orderDemoStep.value === 3)

const flowStep = ref(0)
const flowMessages = computed(() => ([
  t('home.updateMsg1'),
  t('home.updateMsg2'),
  t('home.updateMsg3')
]))
const currentUpdateMessage = computed(() => flowMessages.value[flowStep.value] || '')

const flowBadgeText = computed(() => {
  if (flowStep.value === 0) return t('home.flowBadgePending')
  if (flowStep.value === 1) return t('home.flowBadgeConfirmed')
  return t('home.flowBadgeDelivered')
})
const flowBadgeClass = computed(() => {
  if (flowStep.value === 0) return 'bg-yellow-100 text-yellow-800'
  if (flowStep.value === 1) return 'bg-blue-100 text-blue-800'
  return 'bg-green-100 text-green-800'
})

let flowTimer
let orderDemoTimer
onMounted(() => {
  orderDemoTimer = setInterval(() => {
    orderDemoStep.value = (orderDemoStep.value + 1) % 4
  }, 1600)
  flowTimer = setInterval(() => {
    flowStep.value = (flowStep.value + 1) % 3
  }, 2200)
})
onUnmounted(() => {
  if (flowTimer) clearInterval(flowTimer)
  if (orderDemoTimer) clearInterval(orderDemoTimer)
})

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
