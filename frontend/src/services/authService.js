import storage from "../utils/storage";
import api from "./api";

const TOKEN_KEY = "@refulink_access";
const REFRESH_KEY = "@refulink_refresh";

export async function verifyRIN(identifier) {
  const { data } = await api.post("/identity/verify/", { identifier });
  if (data.tokens) {
    await storage.setItem(TOKEN_KEY, data.tokens.access);
    await storage.setItem(REFRESH_KEY, data.tokens.refresh);
  }
  return data;
}

export async function registerIdentity(stellarPublicKey = null) {
  const body = stellarPublicKey ? { stellar_public_key: stellarPublicKey } : {};
  const { data } = await api.post("/identity/register-identity/", body);
  return data;
}

export async function getStoredToken() {
  return storage.getItem(TOKEN_KEY);
}

export async function clearTokens() {
  await storage.multiRemove([TOKEN_KEY, REFRESH_KEY]);
}

export async function isLoggedIn() {
  const token = await getStoredToken();
  return !!token;
}
