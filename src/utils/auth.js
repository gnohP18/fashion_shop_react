import { STORAGE_AUTH_ACCESS_KEY, STORAGE_AUTH_REFRESH_KEY } from "../constants/authentication";

/**
 * Get Access token
 * @param {string} typeKey key
 * @returns token
 */
export const getAccessToken = (typeKey) => {
  return localStorage.getItem(typeKey ?? STORAGE_AUTH_ACCESS_KEY);
}

/**
 * Get Refresh token
 * @param {string} typeKey key
 * @returns token
 */
export const getRefreshToken = (typeKey) => {
  return localStorage.getItem(typeKey ?? STORAGE_AUTH_REFRESH_KEY);
}

/**
 * Set Access token
 * @param {string} token token
 * @param {string} typeKey key
 */
export const setAccessToken = (token, typeKey) => {
  localStorage.setItem(typeKey ?? STORAGE_AUTH_ACCESS_KEY, token);
}

/**
 * Set Refresh token
 * @param {string} token token
 * @param {string} typeKey key
 */
export const setRefreshToken = (token, typeKey) => {
  localStorage.setItem(typeKey ?? STORAGE_AUTH_REFRESH_KEY, token);
}