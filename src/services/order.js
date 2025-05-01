import apiClient from "./apiAdmin";

export const getListOrder = (params) => {
  return apiClient.get('/api/order-management', params);
}

export const getDetailOrder = (id) => {
  return apiClient.get(`/api/order-management/${id}`);
}

export const checkExistPhone = (params) => {
  return apiClient.get('api/user-management/check-user-phone', params)
}

export const loadUserByPhone = (params) => {
  return apiClient.get('api/user-management/get-user-order', params)
}

export const getProductOptions = () => {
  return apiClient.get('api/order-management/get-product-options')
}

export const createOrderByAdmin = (data) => {
  return apiClient.post('api/order-management/create-by-admin', data);
}