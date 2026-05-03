import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PropTypes from "prop-types";
import { useLanguage } from "../context/LanguageContext";
import { getTrustScore, requestLoan } from "../services/trustService";
import LoanAmountSlider from "../components/shared/LoanAmountSlider";

const CREDIT_TIERS = [
  { min: 81, label: "Gold", color: "#F59E0B", limit: 30000 },
  { min: 61, label: "Silver", color: "#A1A1AA", limit: 15000 },
  { min: 31, label: "Bronze", color: "#C2855A", limit: 5000 },
  { min: 0, label: "None", color: "#3F3F46", limit: 0 },
];

const MIN_LOAN_AMOUNT = 500;

function getTier(score) {
  return CREDIT_TIERS.find((tier) => score >= tier.min) ?? CREDIT_TIERS[3];
}

function roundDownToStep(amount) {
  return Math.floor(amount / MIN_LOAN_AMOUNT) * MIN_LOAN_AMOUNT;
}

const IMPROVE_TIPS = [
  { icon: "🤝", tip: "Get vouched by an Ambassador (+50 pts)" },
  { icon: "💸", tip: "Use the wallet regularly (+1 pt / KES 1,000)" },
];

function ScoreRing({ score }) {
  const tier = getTier(score);

  return (
    <View style={{ alignItems: "center", paddingTop: 36, paddingBottom: 28, paddingHorizontal: 24 }}>
      <View
        style={{
          width: 152,
          height: 152,
          borderRadius: 76,
          borderWidth: 6,
          borderColor: tier.color,
          backgroundColor: "#111",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "#FFF", fontSize: 52, fontWeight: "900", letterSpacing: -2 }}>
          {score}
        </Text>
        <Text style={{ color: "#52525B", fontSize: 12, marginTop: 2 }}>/ 100</Text>
      </View>
      <Text
        style={{
          color: tier.color,
          fontSize: 13,
          fontWeight: "700",
          marginTop: 18,
          letterSpacing: 2,
          textTransform: "uppercase",
        }}
      >
        {tier.label} Tier
      </Text>
    </View>
  );
}

ScoreRing.propTypes = {
  score: PropTypes.number.isRequired,
};

function ScoreBreakdown({ breakdown }) {
  if (!breakdown) return null;

  const items = [
    { label: "Vouch Bonus", value: breakdown.vouch_points ?? 0 },
    { label: "Tx Volume", value: breakdown.volume_points ?? 0 },
  ];

  return (
    <View
      style={{
        backgroundColor: "#111",
        borderWidth: 1,
        borderColor: "#222",
        borderRadius: 16,
        marginHorizontal: 16,
        padding: 16,
        marginBottom: 16,
      }}
    >
      <Text
        style={{
          color: "#52525B",
          fontSize: 10,
          fontWeight: "700",
          letterSpacing: 2.5,
          textTransform: "uppercase",
          marginBottom: 14,
        }}
      >
        Score Breakdown
      </Text>

      {items.map(({ label, value }) => (
        <View key={label} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
          <Text style={{ color: "#A1A1AA", fontSize: 14 }}>{label}</Text>
          <Text style={{ color: "#FFF", fontSize: 14, fontWeight: "600" }}>+{value}</Text>
        </View>
      ))}
    </View>
  );
}

ScoreBreakdown.propTypes = {
  breakdown: PropTypes.shape({
    vouch_points: PropTypes.number,
    volume_points: PropTypes.number,
    age_points: PropTypes.number,
    verified_bonus: PropTypes.number,
  }),
};

ScoreBreakdown.defaultProps = {
  breakdown: null,
};

async function fetchTrustData(setTrustData, setSelectedAmount, setLoading, setRefreshing) {
  try {
    const data = await getTrustScore();
    setTrustData(data);

    const limit = data?.credit_limit_kes ?? 0;
    if (limit >= MIN_LOAN_AMOUNT) {
      setSelectedAmount(roundDownToStep(limit));
    } else {
      setSelectedAmount(null);
    }
  } catch {
    setTrustData(null);
    setSelectedAmount(null);
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
}

async function submitLoan(amount, t, onSuccess, setSubmitting) {
  setSubmitting(true);

  try {
    const result = await requestLoan(amount);
    Alert.alert(
      t("loanPending"),
      `KES ${amount.toLocaleString()}\n${t("repayBy")}: ${result.repay_by ?? "—"}`,
      [{ text: "OK", onPress: onSuccess }]
    );
  } catch (err) {
    Alert.alert("", err?.response?.data?.detail ?? t("networkError"));
  } finally {
    setSubmitting(false);
  }
}

export default function BorrowScreen() {
  const { t } = useLanguage();
  const [trustData, setTrustData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const loadTrust = useCallback(() => {
    fetchTrustData(setTrustData, setSelectedAmount, setLoading, setRefreshing);
  }, []);

  useEffect(() => {
    loadTrust();
  }, [loadTrust]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadTrust();
  }, [loadTrust]);

  const handleRequestLoan = () => {
    if (selectedAmount) {
      submitLoan(selectedAmount, t, loadTrust, setSubmitting);
    }
  };

  const score = trustData?.trust_score ?? 0;
  const limit = trustData?.credit_limit_kes ?? 0;
  const breakdown = trustData?.breakdown ?? null;
  const canBorrow = limit >= MIN_LOAN_AMOUNT;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF6600" />
        }
      >
        {loading ? (
          <ActivityIndicator color="#FF6600" size="large" style={{ marginTop: 80 }} />
        ) : (
          <>
            <ScoreRing score={score} />

            <View
              style={{
                backgroundColor: "#111",
                borderWidth: 1,
                borderColor: "#222",
                borderRadius: 16,
                marginHorizontal: 16,
                padding: 16,
                marginBottom: 16,
              }}
            >
              <Text
                style={{
                  color: "#52525B",
                  fontSize: 10,
                  fontWeight: "700",
                  letterSpacing: 2.5,
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                {t("creditLimit")}
              </Text>
              <Text style={{ color: limit > 0 ? "#FFF" : "#3F3F46", fontSize: 32, fontWeight: "900" }}>
                KES {limit.toLocaleString()}
              </Text>
              {limit === 0 && (
                <Text style={{ color: "#52525B", fontSize: 12, marginTop: 6 }}>
                  {t("noCredit")}
                </Text>
              )}
              {limit > 0 && limit < MIN_LOAN_AMOUNT && (
                <Text style={{ color: "#A1A1AA", fontSize: 12, marginTop: 6 }}>
                  Your limit is below the minimum borrow amount of KES {MIN_LOAN_AMOUNT.toLocaleString()}.
                </Text>
              )}
            </View>

            <ScoreBreakdown breakdown={breakdown} />

            {canBorrow && (
              <>
                <LoanAmountSlider
                  limit={limit}
                  value={selectedAmount}
                  onChange={setSelectedAmount}
                />

                <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: selectedAmount ? "#FF6600" : "#111",
                      borderWidth: 1,
                      borderColor: selectedAmount ? "#FF6600" : "#222",
                      borderRadius: 16,
                      paddingVertical: 18,
                      alignItems: "center",
                    }}
                    disabled={!selectedAmount || submitting}
                    onPress={handleRequestLoan}
                  >
                    {submitting ? (
                      <ActivityIndicator color={selectedAmount ? "#000" : "#52525B"} />
                    ) : (
                      <Text
                        style={{
                          color: selectedAmount ? "#000" : "#52525B",
                          fontWeight: "700",
                          fontSize: 15,
                        }}
                      >
                        {t("requestLoan")}
                        {selectedAmount ? ` — KES ${selectedAmount.toLocaleString()}` : ""}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            )}

            <View
              style={{
                backgroundColor: "#111",
                borderWidth: 1,
                borderColor: "#222",
                borderRadius: 16,
                marginHorizontal: 16,
                marginBottom: 32,
                padding: 16,
              }}
            >
              <Text
                style={{
                  color: "#52525B",
                  fontSize: 10,
                  fontWeight: "700",
                  letterSpacing: 2.5,
                  textTransform: "uppercase",
                  marginBottom: 14,
                }}
              >
                How to Improve Your Score
              </Text>

              {IMPROVE_TIPS.map(({ icon, tip }) => (
                <View key={tip} style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 10, gap: 10 }}>
                  <Text style={{ fontSize: 14 }}>{icon}</Text>
                  <Text style={{ color: "#A1A1AA", fontSize: 13, flex: 1, lineHeight: 20 }}>{tip}</Text>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}