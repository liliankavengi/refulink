/**
 * Shared TypeScript interfaces for the RefuLink frontend.
 * These types mirror the Django REST Framework serializer shapes
 * so the frontend stays in sync with the backend API contract.
 */

// ── Identity / Auth ──────────────────────────────────────────────────────────

export interface VerifyRINPayload {
  identifier: string;
}

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

export interface RegisterIdentityPayload {
  stellar_public_key?: string;
}

export interface RegisterIdentityResponse {
  detail: string;
  stellar_public_key: string;
  verification_status: string;
  stellar_private_key?: string;
  private_key_warning?: string;
}

// ── Vouch / Verification ─────────────────────────────────────────────────────

export interface VouchStatusResponse {
  verification_status: "unverified" | "pending" | "vouched";
  stellar_public_key: string;
  hashed_rin: string;
  vouched_by?: string;
  vouched_at?: string;
}

export interface VouchPayload {
  ambassador_public_key: string;
}

export interface VouchResponse {
  detail: string;
  verification_status: string;
}

// ── Wallet ───────────────────────────────────────────────────────────────────

export interface BalanceResponse {
  kes_balance: number;
  stellar_address: string;
}

export interface Transaction {
  tx_hash: string;
  amount_kes: number;
  direction: "incoming" | "outgoing";
  counterparty_address: string;
  timestamp: string;
  status: string;
}

export interface TransactionListResponse {
  transactions: Transaction[];
}

export interface SendTokenPayload {
  destination_address: string;
  amount_kes: number;
}

export interface SendTokenResponse {
  success: boolean;
  tx_hash: string;
  amount_kes: number;
  destination: string;
}

export interface AuditLogPayload {
  tx_hash: string;
  direction: "incoming" | "outgoing";
  amount_kes: number;
  counterparty_address: string;
  status?: string;
}

// ── Trust / Loans ────────────────────────────────────────────────────────────

export interface TrustScoreResponse {
  trust_score: number;
  credit_limit_kes: number;
  vouches: number;
  transactions_count: number;
}

export interface LoanRequestPayload {
  amount_kes: number;
}

export interface LoanRequestResponse {
  detail: string;
  amount_kes: number;
  repay_by: string;
  loan_id: number;
}

// ── Session ──────────────────────────────────────────────────────────────────

export interface UserSession {
  accessToken: string;
  refreshToken: string;
  fullName: string;
  idNumber: string;
  stellarPublicKey?: string;
  verificationStatus?: string;
}

// ── Navigation ───────────────────────────────────────────────────────────────

export type RootStackParamList = {
  Onboarding: undefined;
  Identification: undefined;
  Biometric: undefined;
  Login: undefined;
  Dashboard: undefined;
  History: undefined;
  Profile: undefined;
  SendConfirm: {
    recipient: string;
    amount: string;
    recipientName?: string;
  };
  SendSuccess: {
    amount: string;
    recipientName: string;
    txHash?: string;
  };
  Scan: undefined;
  Vault: undefined;
  RequestLoan: undefined;
};
