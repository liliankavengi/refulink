import storage from "../utils/storage";
import api from "./api";

const TOKEN_KEY = "@refulink_access";
const REFRESH_KEY = "@refulink_refresh";

interface VerifyRINResponse {
  tokens?: {
    access: string;
    refresh: string;
  };
  [key: string]: any;
}

interface RegisterIdentityResponse {
  [key: string]: any;
}

export async function verifyRIN(identifier: string): Promise<VerifyRINResponse> {
  const { data } = await api.post<VerifyRINResponse>("/identity/verify-rin/", { identifier });
  if (data.tokens) {
    await storage.setItem(TOKEN_KEY, data.tokens.access);
    await storage.setItem(REFRESH_KEY, data.tokens.refresh);
  }
  return data;
}

export async function registerIdentity(stellarPublicKey: string | null = null): Promise<RegisterIdentityResponse> {
  const body = stellarPublicKey ? { stellar_public_key: stellarPublicKey } : {};
  const { data } = await api.post<RegisterIdentityResponse>("/identity/register-identity/", body);
  return data;
}

export async function getStoredToken(): Promise<string | null> {
  return storage.getItem(TOKEN_KEY);
}

export async function clearTokens(): Promise<void> {
  await storage.multiRemove([TOKEN_KEY, REFRESH_KEY]);
}

export async function isLoggedIn(): Promise<boolean> {
  const token = await getStoredToken();
  return !!token;
}