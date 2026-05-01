import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";

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

/**
 * Sends KES tokens to a destination Stellar address via the backend relay.
 *
 * Architecture: the backend holds the signing key in the SENDER_SECRET_KEY env var
 * and submits the transaction to Horizon server-side.
 *
 * For production client-side signing, replace the api.post call with:
 *   1. Build unsigned XDR via stellar-base
 *   2. Sign with privateKey from SecureStore (expo-secure-store)
 *   3. Submit signed XDR directly to Horizon
 *   4. Call logTransaction() for the audit trail
 *
 * @param destinationAddress - 56-char Stellar G... address
 * @param amountKes - Positive KES amount
 * @returns SendTokenResponse
 * @throws Error if validation fails or API request fails
 */
export const sendToken = async (
  destinationAddress: string,
  amountKes: string | number
): Promise<SendTokenResponse> => {
  if (!destinationAddress || !amountKes) {
    throw new Error("Destination and amount are required.");
  }
  if (typeof destinationAddress !== "string" || !destinationAddress.startsWith("G") || destinationAddress.length !== 56) {
    throw new Error("Invalid Stellar address. Must be a 56-character G... key.");
  }
  if (parseFloat(String(amountKes)) <= 0) {
    throw new Error("Amount must be greater than zero.");
  }

  const token = await AsyncStorage.getItem("access_token");
  if (!token) throw new Error("Not authenticated. Please log in.");

  const { data } = await api.post<SendTokenResponse>("/wallet/send/", {
    destination_address: destinationAddress,
    amount_kes: parseFloat(String(amountKes)),
  });

  return {
    success: true,
    tx_hash: data.tx_hash,
    amount_kes: data.amount_kes,
    destination: data.destination,
  };
};

/**
 * Posts a transaction audit record to the backend.
 * Non-blocking — caller should fire-and-forget (don't await the error).
 * @param txHash - Transaction hash
 * @param direction - 'incoming' or 'outgoing'
 * @param amountKes - Transaction amount in KES
 * @param counterpartyAddress - Counterparty Stellar address
 * @param txStatus - Transaction status (default: 'completed')
 */
export const logTransaction = async (
  txHash: string,
  direction: "incoming" | "outgoing",
  amountKes: number,
  counterpartyAddress: string,
  txStatus: string = "completed"
): Promise<void> => {
  try {
    await api.post("/wallet/audit/", {
      tx_hash: txHash,
      direction,
      amount_kes: amountKes,
      counterparty_address: counterpartyAddress,
      status: txStatus,
    });
  } catch {
    // Audit failures must not surface to the user
  }
};
