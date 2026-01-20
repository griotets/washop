import { useAdminStore } from '~/stores/admin'

export const useAdmin = () => {
  const adminStore = useAdminStore()

  const getProduct = async (id: string) => {
    const response = await $fetch<{ data: any }>(`/api/crud/products?id=${id}`)
    return response.data
  }

  const getCategories = async () => {
    if (!adminStore.selectedShopId) return []
    const response = await $fetch<{ data: any[] }>(`/api/crud/categories`, {
      query: { store_id: adminStore.selectedShopId }
    })
    return response.data || []
  }

  const getTags = async () => {
    if (!adminStore.selectedShopId) return []
    const response = await $fetch<{ data: any[] }>(`/api/crud/tags`, {
      query: { store_id: adminStore.selectedShopId }
    })
    return response.data || []
  }

  return {
    getProduct,
    getCategories,
    getTags
  }
}
