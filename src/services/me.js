import apiClient from "./apiAdmin"

export const getMe = () => {
  return apiClient.get('api/me')
}