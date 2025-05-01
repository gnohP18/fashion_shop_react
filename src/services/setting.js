import apiClient from "./apiAdmin";

export const getBasicInfoSetting = () => {
  return apiClient.get("/api/settings/basic-info");
}

export const updateBasicInfoSetting = (data) => {
  return apiClient.put("/api/settings/basic-info", data);
}

export const getStatisticSetting = () => {
  return apiClient.get("/api/settings/statistic");
}

export const updateStatisticSetting = (data) => {
  return apiClient.put("/api/settings/statistic", data);
}