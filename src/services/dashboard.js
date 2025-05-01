import apiClient from "./apiAdmin";

export const getTopSeller = (params) => {
  return apiClient.get('/api/dashboard/top-seller', params);
}

export const getSalesRevenue = (params) => {
  return apiClient.get('/api/dashboard/sales-revenue', params);
}