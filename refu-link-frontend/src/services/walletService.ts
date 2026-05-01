import api from "./api";

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

export const getBalance = async (): Promise<BalanceResponse> => {
  const { data } = await api.get<BalanceResponse>("/wallet/balance/");
  return data;
};

export const getTransactions = async (limit: number = 20): Promise<Transaction[]> => {
  const { data } = await api.get<TransactionListResponse>("/wallet/transactions/", {
    params: { limit },
  });
  return data.transactions;
};
