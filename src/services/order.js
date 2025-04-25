import apiClient from "./apiAdmin";

export const getListOrder = (params) => {
  return apiClient.get('/api/order-management', params);
}