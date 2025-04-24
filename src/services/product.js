import apiClient from "./apiAdmin";

export const getListProduct = (params) => {
  return apiClient.get("/api/product-management/products", params);
}

export const getProductDetail = (id) => {
  return apiClient.get(`/api/product-management/products/${id}`);
}

export const getListProductItem = (productId) => {
  return apiClient.get(`/api/product-management/products/product-items/${productId}`);
}

export const updateBasicProductAsync = (id, data) => {
  return apiClient.put(`/api/product-management/products/${id}`, data);
}

export const updateProductVariantAsync = (id, data) => {
  return apiClient.put(`/api/product-management/products/variants/${id}`, data)
}

export const getListCategory = (params) => {
  return apiClient.get("/api/product-management/categories", params)
}