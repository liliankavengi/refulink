import api from "./api";

export async function getTrustScore() {
  const { data } = await api.get("/trust/score/");
  return data;
}

export async function requestLoan(amountKes) {
  const { data } = await api.post("/trust/loan/", { amount_kes: amountKes });
  return data;
}

export async function getMpesaDepositDetails() {
  const { data } = await api.get("/mpesa/deposit-info/");
  return data;
}

export async function initiateMpesaWithdrawal(amountKes, phoneNumber) {
  const { data } = await api.post("/mpesa/withdraw/", {
    amount_kes: amountKes,
    phone_number: phoneNumber,
  });
  return data;
}
