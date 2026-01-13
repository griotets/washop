import { defineStore } from 'pinia'
import { useToast } from '~/composables/useToast'

export const useCartStore = defineStore('cart', {
  state: () => ({ 
    items: [] as Array<{ 
      id: string; // composite key: productId|variantId|optionsSig
      productId?: string;
      variantId?: string;
      options?: Record<string, any>;
      name: string; 
      price: number; 
      quantity: number; 
      image?: string 
    }>,
    currentSlug: ''
  }),
  getters: {
    count: (s) => s.items.reduce((a, i) => a + (i.quantity || 1), 0),
    total: (s) => s.items.reduce((a, i) => a + (i.price || 0) * (i.quantity || 1), 0)
  },
  actions: {
    add(item: { id: string; productId?: string; variantId?: string; options?: Record<string, any>; name: string; price: number; image?: string }) {
      console.log('Cart add:', item)
      try {
        const x = this.items.find((i) => i.id === item.id)
        if (x) x.quantity += 1
        else this.items.push({ ...item, quantity: 1 })
        this.persist()
        try {
            const toast = useToast()
            toast.success(`${item.name} ajouté au panier`)
        } catch (err) { console.error('Toast error:', err) }
      } catch (e) {
        console.error('Cart add error:', e)
        try {
            const toast = useToast()
            toast.error('Erreur lors de l\'ajout au panier')
        } catch (err) { console.error('Toast error in catch:', err) }
      }
    },
    remove(id: string) {
      try {
        this.items = this.items.filter((i) => i.id !== id)
        this.persist()
      } catch (e) {
        console.error('Cart remove error:', e)
        const toast = useToast()
        toast.error('Erreur lors de la suppression')
      }
    },
    setQuantity(id: string, qty: number) {
      try {
        const x = this.items.find((i) => i.id === id)
        if (x) x.quantity = Math.max(0, qty)
        this.items = this.items.filter((i) => i.quantity > 0)
        this.persist()
      } catch (e) {
        console.error('Cart update error:', e)
        const toast = useToast()
        toast.error('Erreur lors de la mise à jour')
      }
    },
    load(slug: string) {
      this.currentSlug = slug
      try {
        const raw = localStorage.getItem(`cart:${slug}`)
        this.items = raw ? JSON.parse(raw) : []
      } catch (e) { 
        console.error('Cart load error:', e)
        this.items = [] 
        // Silent fail on load usually better, or toast?
        // User asked for error display.
        // const toast = useToast()
        // toast.error('Erreur chargement panier')
      }
    },
    persist() {
      if (!this.currentSlug) return
      try {
        localStorage.setItem(`cart:${this.currentSlug}`, JSON.stringify(this.items))
      } catch (e) {
        console.error('Cart persist error:', e)
        const toast = useToast()
        toast.error('Erreur sauvegarde panier: stockage plein ?')
      }
    }
  }
})
