import apiClient from "./apiAdmin";

export const createPresignedUploadProductUrl = (id, data) => {
  return apiClient.post(`/api/product-management/products/${id}/presigned-upload`, data);
}

export const createPresignedUploadProductItemUrl = (id, data) => {
  return apiClient.post(`/api/product-management/products/product-items/${id}/presigned-upload`, data);
}