import api from "./api";

export interface VouchStatusResponse {
  verification_status: "unverified" | "pending" | "vouched";
  stellar_public_key: string;
  hashed_rin: string;
  vouched_by?: string;
  vouched_at?: string;
}

export interface RegisterIdentityPayload {
  stellar_public_key: string;
}

export interface RegisterIdentityResponse {
  detail: string;
  verification_status: string;
}

export interface VouchPayload {
  ambassador_public_key: string;
}

export interface VouchResponse {
  detail: string;
  verification_status: string;
}

export const getVouchStatus = async (): Promise<VouchStatusResponse> => {
  const { data } = await api.get<VouchStatusResponse>("/identity/vouch-status/");
  return data;
};

export const registerIdentity = async (
  stellarPublicKey: string
): Promise<RegisterIdentityResponse> => {
  const { data } = await api.post<RegisterIdentityResponse>("/identity/register-identity/", {
    stellar_public_key: stellarPublicKey,
  });
  return data;
};

export const requestVouch = async (
  ambassadorPublicKey: string
): Promise<VouchResponse> => {
  const { data } = await api.post<VouchResponse>("/identity/request-vouch/", {
    ambassador_public_key: ambassadorPublicKey,
  });
  return data;
};
