import { defineStore } from 'pinia'
import { useToast } from '~/composables/useToast'

export const useCartStore = defineStore('cart', {
  state: () => ({ 
    items: [] as Array<{ 
      id: string; 
      productId?: string;
      variantId?: string;
      options?: Record<string, any>;
      name: string; 
      price: number; 
      quantity: number; 
      image?: string 
    }>,
    cartStoreSlug: '' as string, // The store slug the items belong to
    currentSlug: '' as string // The store slug currently being viewed
  }),
  getters: {
    count: (s) => s.items.reduce((a, i) => a + (i.quantity || 1), 0),
    total: (s) => s.items.reduce((a, i) => a + (i.price || 0) * (i.quantity || 1), 0),
    hasConflict: (s) => s.items.length > 0 && s.cartStoreSlug !== s.currentSlug
  },
  actions: {
    // Returns true if added, false if conflict
    add(item: { id: string; productId?: string; variantId?: string; options?: Record<string, any>; name: string; price: number; image?: string }): boolean {
      console.log('Cart add:', item)
      
      // Check for conflict
      if (this.hasConflict) {
        return false
      }

      try {
        // If empty, set the cart owner to current view
        if (this.items.length === 0) {
            this.cartStoreSlug = this.currentSlug
        }

        const x = this.items.find((i) => i.id === item.id)
        if (x) x.quantity += 1
        else this.items.push({ ...item, quantity: 1 })
        this.persist()
        try {
            const toast = useToast()
            toast.success(`${item.name} ajouté au panier`)
        } catch (err) { console.error('Toast error:', err) }
        return true
      } catch (e) {
        console.error('Cart add error:', e)
        try {
            const toast = useToast()
            toast.error('Erreur lors de l\'ajout au panier')
        } catch (err) { console.error('Toast error in catch:', err) }
        return false
      }
    },
    clearAndAdd(item: { id: string; productId?: string; variantId?: string; options?: Record<string, any>; name: string; price: number; image?: string }) {
        this.items = []
        this.cartStoreSlug = this.currentSlug
        this.add(item)
    },
    clear() {
      this.items = []
      this.cartStoreSlug = ''
      this.persist()
    },
    remove(id: string) {
      try {
        this.items = this.items.filter((i) => i.id !== id)
        if (this.items.length === 0) {
            this.cartStoreSlug = ''
        }
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
        if (this.items.length === 0) {
            this.cartStoreSlug = ''
        }
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
        // Load global cart
        const raw = localStorage.getItem('wa_shop_cart')
        if (raw) {
            const data = JSON.parse(raw)
            this.items = data.items || []
            this.cartStoreSlug = data.cartStoreSlug || ''
            
            // Legacy migration: if reading old format (array), treat as current store
            if (Array.isArray(data)) {
                this.items = data
                this.cartStoreSlug = slug
            }
        } else {
            // Fallback: try legacy per-store key if global is missing? 
            // Better to start fresh or migrate? 
            // Let's check legacy key just in case
            const legacy = localStorage.getItem(`cart:${slug}`)
            if (legacy) {
                this.items = JSON.parse(legacy)
                this.cartStoreSlug = slug
                // Migrate to global
                this.persist()
                localStorage.removeItem(`cart:${slug}`)
            } else {
                this.items = []
                this.cartStoreSlug = ''
            }
        }
      } catch (e) { 
        console.error('Cart load error:', e)
        this.items = [] 
        this.cartStoreSlug = ''
      }
    },
    persist() {
      try {
        const data = {
            items: this.items,
            cartStoreSlug: this.cartStoreSlug
        }
        localStorage.setItem('wa_shop_cart', JSON.stringify(data))
      } catch (e) {
        console.error('Cart persist error:', e)
        const toast = useToast()
        toast.error('Erreur sauvegarde panier: stockage plein ?')
      }
    }
  }
})
