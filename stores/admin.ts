import { defineStore } from 'pinia'

export const useAdminStore = defineStore('admin', {
  state: () => ({
    selectedShopId: '' as string,
    onboarding: {
      email: '' as string,
      emailVerified: false as boolean,
      emailCode: '' as string,
      industry: '' as string,
      goals: [] as string[],
      subscribed: false as boolean
    },
    subscription: null as any,
    productCount: 0
  }),
  getters: {
    hasShopSelected: (s) => !!s.selectedShopId,
    isOnboardingComplete: (s) => !!s.onboarding.industry && s.onboarding.goals.length > 0,
    isFreePlan: (s) => !s.subscription || s.subscription.plan_id === 'free',
    planName: (s) => s.subscription?.plan?.name || 'Gratuit',
    maxProducts: (s) => s.subscription?.plan?.max_products || 20, // Default to 20 for free
    maxStores: (s) => s.subscription?.plan?.max_stores || 1, // Default to 1 for free
    canAddProduct(): boolean {
      const max = this.maxProducts
      if (max === -1) return true // Unlimited
      return this.productCount < max
    },
    canAddStore(): boolean {
      // We need store count. For now assume checking in component or add storeCount to state
      return true // implemented in component for now
    }
  },
  actions: {
    async fetchSubscription(supabase: any) {
      if (!this.selectedShopId) return
      
      // Get shop to get enterprise_id
      const { data: shop } = await supabase.from('stores').select('enterprise_id').eq('id', this.selectedShopId).single()
      if (!shop?.enterprise_id) return

      // Get subscription
      const { data: sub } = await supabase.from('subscriptions')
        .select('*, plan:subscription_plans(*)')
        .eq('enterprise_id', shop.enterprise_id)
        .maybeSingle()
      
      this.subscription = sub

      // Get product count
      const { count } = await supabase.from('products')
        .select('*', { count: 'exact', head: true })
        .eq('store_id', this.selectedShopId)
      
      this.productCount = count || 0
    },
    setEmail(email: string) { this.onboarding.email = email },
    setEmailCode(code: string) { this.onboarding.emailCode = code },
    verifyEmail() { this.onboarding.emailVerified = true },
    setIndustry(industry: string) { this.onboarding.industry = industry },
    toggleGoal(goal: string) {
      const i = this.onboarding.goals.indexOf(goal)
      if (i >= 0) this.onboarding.goals.splice(i, 1)
      else this.onboarding.goals.push(goal)
    },
    setSubscribed(v: boolean) { this.onboarding.subscribed = v },
    selectShop(id: string) { this.selectedShopId = id; this.persist() },
    reset() { this.selectedShopId = ''; this.onboarding = { email: '', emailVerified: false, emailCode: '', industry: '', goals: [], subscribed: false } },
    persist() {
      try { localStorage.setItem('admin:onboarding', JSON.stringify(this.onboarding)) } catch {}
      try { localStorage.setItem('admin:selectedShopId', this.selectedShopId) } catch {}
    },
    load() {
      try {
        const raw = localStorage.getItem('admin:onboarding')
        this.onboarding = raw ? JSON.parse(raw) : this.onboarding
      } catch {}
      try {
        const s = localStorage.getItem('admin:selectedShopId') || ''
        this.selectedShopId = s
      } catch {}
    }
  }
})
