import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";

// ── Types ────────────────────────────────────────────────────────────────────

export interface VerifyRINResponse {
  verified: boolean;
  message: string;
  user_info?: {
    full_name: string;
    id_number: string;
  };
  tokens?: {
    access: string;
    refresh: string;
  };
}

export interface RegisterIdentityResponse {
  detail: string;
  stellar_public_key: string;
  verification_status: string;
  stellar_private_key?: string;
  private_key_warning?: string;
}

export interface UserSession {
  accessToken: string;
  refreshToken: string;
  fullName: string;
  idNumber: string;
  stellarPublicKey?: string;
  verificationStatus?: string;
}

// ── Keys ─────────────────────────────────────────────────────────────────────

const KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  FULL_NAME: "user_full_name",
  ID_NUMBER: "user_id_number",
  STELLAR_PUBLIC_KEY: "stellar_public_key",
  VERIFICATION_STATUS: "verification_status",
} as const;

// ── API Functions ────────────────────────────────────────────────────────────

/**
 * Verifies a RIN / Alien ID via the backend's IPRS integration.
 * On success, stores JWT tokens and user info for subsequent authenticated calls.
 */
export const verifyRIN = async (identifier: string): Promise<VerifyRINResponse> => {
  const { data } = await api.post<VerifyRINResponse>("/identity/verify/", {
    identifier,
  });

  if (data.verified && data.tokens) {
    await AsyncStorage.multiSet([
      [KEYS.ACCESS_TOKEN, data.tokens.access],
      [KEYS.REFRESH_TOKEN, data.tokens.refresh],
      [KEYS.FULL_NAME, data.user_info?.full_name || ""],
      [KEYS.ID_NUMBER, data.user_info?.id_number || ""],
    ]);
  }

  return data;
};

/**
 * Registers a Stellar identity for the authenticated user.
 * If no key is supplied, the server generates one and returns it ONCE.
 */
export const registerIdentity = async (
  stellarPublicKey?: string
): Promise<RegisterIdentityResponse> => {
  const body: Record<string, string> = {};
  if (stellarPublicKey) {
    body.stellar_public_key = stellarPublicKey;
  }

  const { data } = await api.post<RegisterIdentityResponse>(
    "/identity/register-identity/",
    body
  );

  // Persist the stellar address & status
  await AsyncStorage.multiSet([
    [KEYS.STELLAR_PUBLIC_KEY, data.stellar_public_key],
    [KEYS.VERIFICATION_STATUS, data.verification_status],
  ]);

  return data;
};

// ── Session Helpers ──────────────────────────────────────────────────────────

/** Returns the current user session from local storage, or null if not logged in. */
export const getSession = async (): Promise<UserSession | null> => {
  const values = await AsyncStorage.multiGet([
    KEYS.ACCESS_TOKEN,
    KEYS.REFRESH_TOKEN,
    KEYS.FULL_NAME,
    KEYS.ID_NUMBER,
    KEYS.STELLAR_PUBLIC_KEY,
    KEYS.VERIFICATION_STATUS,
  ]);

  const map = Object.fromEntries(values) as Record<string, string | null>;

  if (!map[KEYS.ACCESS_TOKEN]) return null;

  return {
    accessToken: map[KEYS.ACCESS_TOKEN]!,
    refreshToken: map[KEYS.REFRESH_TOKEN] || "",
    fullName: map[KEYS.FULL_NAME] || "",
    idNumber: map[KEYS.ID_NUMBER] || "",
    stellarPublicKey: map[KEYS.STELLAR_PUBLIC_KEY] || undefined,
    verificationStatus: map[KEYS.VERIFICATION_STATUS] || undefined,
  };
};

/** Returns true if a valid access token exists in storage. */
export const isAuthenticated = async (): Promise<boolean> => {
  const token = await AsyncStorage.getItem(KEYS.ACCESS_TOKEN);
  return !!token;
};

/** Clears all session data (logout). */
export const clearSession = async (): Promise<void> => {
  await AsyncStorage.multiRemove(Object.values(KEYS));
};
