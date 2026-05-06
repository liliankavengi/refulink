/// <reference types="node" />
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TokenResponse {
  access: string;
  refresh: string;
}

const BASE_URL: string = process.env.EXPO_PUBLIC_API_URL || 'https://symmetrical-trout-7wv7pgvjwvj3r4rg-8000.app.github.dev/';

console.log('[RefuLink API] Base URL:', BASE_URL);

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT access token to every request
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401, attempt token refresh once
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config as AxiosRequestConfig & { _retry?: boolean };
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refresh = await AsyncStorage.getItem('refresh_token');
        const { data } = await axios.post<TokenResponse>(`${BASE_URL}/auth/token/refresh/`, {
          refresh,
        });
        await AsyncStorage.setItem('access_token', data.access);
        original.headers!.Authorization = `Bearer ${data.access}`;
        return api(original);
      } catch {
        await AsyncStorage.multiRemove(['access_token', 'refresh_token']);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
