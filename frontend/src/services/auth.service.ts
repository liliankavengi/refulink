import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "@refulink_access";
const REFRESH_KEY = "@refulink_refresh";
 
interface VerifyRINResponse {
  tokens?: {
    access: string;
    refresh: string;
  };
  user?: any;
  [key: string]: any;
}

interface RegisterIdentityResponse {
  [key: string]: any;
}

export async function verifyRIN(identifier: string): Promise<VerifyRINResponse> {
  const { data } = await api.post<VerifyRINResponse>("/identity/verify-rin/", { 
    identifier 
  });
  
  if (data.tokens) {
    // Store tokens using AsyncStorage directly (consistent with your interceptor)
    await AsyncStorage.setItem("access_token", data.tokens.access);
    await AsyncStorage.setItem("refresh_token", data.tokens.refresh);
  }
  
  return data;
}

export async function registerIdentity(
  stellarPublicKey: string | null = null
): Promise<RegisterIdentityResponse> {
  const body = stellarPublicKey ? { stellar_public_key: stellarPublicKey } : {};
  const { data } = await api.post<RegisterIdentityResponse>(
    "/identity/register-identity/", 
    body
  );
  return data;
}

export async function getStoredToken(): Promise<string | null> {
  return AsyncStorage.getItem("access_token");
}

export async function clearTokens(): Promise<void> {
  await AsyncStorage.multiRemove(["access_token", "refresh_token"]);
}

export async function isLoggedIn(): Promise<boolean> {
  const token = await getStoredToken();
  return !!token;
}