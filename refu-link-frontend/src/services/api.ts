/// <reference types="node" />
import axios, { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TokenResponse {
  access: string;
  refresh: string;
}

const BASE_URL: string = process.env.EXPO_PUBLIC_API_URL || 'https://symmetrical-trout-7wv7pgvjwvj3r4rg-8000.app.github.dev/api';

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT access token to every request
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    const token = await AsyncStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: unknown) => {
    return Promise.reject(error);
  }
);

// On 401, attempt token refresh once
api.interceptors.response.use(
  (response: any) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error) || !error.config) {
      return Promise.reject(error);
    }

    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      
      try {
        const refresh = await AsyncStorage.getItem('refresh_token');
        
        if (!refresh) {
          return Promise.reject(error);
        }

        const { data } = await axios.post<TokenResponse>(
          `${BASE_URL}/auth/token/refresh/`,
          { refresh }
        );
        
        await AsyncStorage.setItem('access_token', data.access);
        
        // Update the failed request's header
        if (original.headers) {
          original.headers.Authorization = `Bearer ${data.access}`;
        }
        
        // If you want to also update the refresh token if it's returned
        if (data.refresh) {
          await AsyncStorage.setItem('refresh_token', data.refresh);
        }
        
        return api(original);
      } catch (refreshError) {
        // Clear tokens on refresh failure
        await AsyncStorage.multiRemove(['access_token', 'refresh_token']);
        
        // Optionally dispatch an event or use a callback to handle unauthorized state
        // You could import and use your auth context here, or emit an event
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('auth:logout'));
        }
        
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Optional: Add a helper function to set tokens after login
export async function setTokens(tokens: TokenResponse): Promise<void> {
  await AsyncStorage.setItem('access_token', tokens.access);
  await AsyncStorage.setItem('refresh_token', tokens.refresh);
}

// Optional: Add a helper function to clear tokens
export async function clearTokens(): Promise<void> {
  await AsyncStorage.multiRemove(['access_token', 'refresh_token']);
}

// Optional: Add a helper to get the current access token
export async function getAccessToken(): Promise<string | null> {
  return AsyncStorage.getItem('access_token');
}

export default api;