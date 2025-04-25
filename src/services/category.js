import apiClient from "./apiAdmin"

export const getListCategory = (params) => {
  return apiClient.get("/api/product-management/categories", params)
}

export const checkExistSlug = (slug) => {
  return apiClient.get("/api/product-management/categories/check-exist-slug", { slug })
}

export const updateCategory = (id, data) => {
  return apiClient.put(`/api/product-management/categories/${id}`, data)
}

export const createCategory = (data) => {
  return apiClient.post('/api/product-management/categories', data)
}