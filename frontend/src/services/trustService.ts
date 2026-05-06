import api from "./api";

// ── Types ────────────────────────────────────────────────────────────────────

export interface TrustScoreResponse {
  trust_score: number;
  credit_limit_kes: number;
  vouches: number;
  transactions_count: number;
}

export interface LoanRequestResponse {
  detail: string;
  amount_kes: number;
  repay_by: string;
  loan_id: number;
}

// ── API Functions ────────────────────────────────────────────────────────────

/**
 * Fetches the authenticated user's trust score and credit limit.
 */
export const getTrustScore = async (): Promise<TrustScoreResponse> => {
  const { data } = await api.get<TrustScoreResponse>("/trust/score/");
  return data;
};

/**
 * Requests a loan against the user's trust score.
 * Backend validates amount against the credit limit.
 */
export const requestLoan = async (
  amountKes: number
): Promise<LoanRequestResponse> => {
  const { data } = await api.post<LoanRequestResponse>("/trust/loan/", {
    amount_kes: amountKes,
  });
  return data;
};
