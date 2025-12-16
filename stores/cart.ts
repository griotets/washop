import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({ 
    items: [] as Array<{ id: string; name: string; price: number; quantity: number; image?: string }>,
    currentSlug: ''
  }),
  getters: {
    count: (s) => s.items.reduce((a, i) => a + (i.quantity || 1), 0),
    total: (s) => s.items.reduce((a, i) => a + (i.price || 0) * (i.quantity || 1), 0)
  },
  actions: {
    add(item: { id: string; name: string; price: number; image?: string }) {
      const x = this.items.find((i) => i.id === item.id)
      if (x) x.quantity += 1
      else this.items.push({ ...item, quantity: 1 })
      this.persist()
    },
    remove(id: string) {
      this.items = this.items.filter((i) => i.id !== id)
      this.persist()
    },
    setQuantity(id: string, qty: number) {
      const x = this.items.find((i) => i.id === id)
      if (x) x.quantity = Math.max(0, qty)
      this.items = this.items.filter((i) => i.quantity > 0)
      this.persist()
    },
    load(slug: string) {
      this.currentSlug = slug
      try {
        const raw = localStorage.getItem(`cart:${slug}`)
        this.items = raw ? JSON.parse(raw) : []
      } catch { this.items = [] }
    },
    persist() {
      if (!this.currentSlug) return
      try {
        localStorage.setItem(`cart:${this.currentSlug}`, JSON.stringify(this.items))
      } catch {}
    }
  }
})
