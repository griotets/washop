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
    }
  }),
  getters: {
    hasShopSelected: (s) => !!s.selectedShopId,
    isOnboardingComplete: (s) => !!s.onboarding.industry && s.onboarding.goals.length > 0
  },
  actions: {
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
    selectShop(id: string) { this.selectedShopId = id },
    reset() { this.selectedShopId = ''; this.onboarding = { email: '', emailVerified: false, emailCode: '', industry: '', goals: [], subscribed: false } },
    persist() {
      try { localStorage.setItem('admin:onboarding', JSON.stringify(this.onboarding)) } catch {}
    },
    load() {
      try {
        const raw = localStorage.getItem('admin:onboarding')
        this.onboarding = raw ? JSON.parse(raw) : this.onboarding
      } catch {}
    }
  }
})
