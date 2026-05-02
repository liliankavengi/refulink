import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PropTypes from "prop-types";

import { sendToken } from "../../services/transferService";
import { getBalance, getTransactions } from "../../services/walletService";

// ── Balance Header ────────────────────────────────────────────────────────────

function BalanceHeader({ balance, address, loading }) {
  return (
    <View style={{ paddingHorizontal: 24, paddingTop: 32, paddingBottom: 28 }}>
      <Text style={{
        color: "#FF6600",
        fontSize: 10,
        fontWeight: "700",
        letterSpacing: 2.5,
        textTransform: "uppercase",
        marginBottom: 10,
      }}>
        Available Balance
      </Text>
      {loading ? (
        <ActivityIndicator color="#FF6600" size="large" style={{ alignSelf: "flex-start", marginVertical: 8 }} />
      ) : (
        <Text style={{ color: "#FFF", fontSize: 42, fontWeight: "900", letterSpacing: -1 }}>
          KES {Number.parseFloat(balance ?? 0).toFixed(2)}
        </Text>
      )}
      <Text style={{ color: "#52525B", fontSize: 11, marginTop: 10, fontFamily: "monospace" }} numberOfLines={1}>
        {address || "—"}
      </Text>
      <View style={{ height: 1, backgroundColor: "#1A1A1A", marginTop: 28 }} />
    </View>
  );
}

BalanceHeader.propTypes = {
  balance: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  address: PropTypes.string,
  loading: PropTypes.bool.isRequired,
};
BalanceHeader.defaultProps = { balance: null, address: "" };

// ── Action Bar ────────────────────────────────────────────────────────────────

const ACTIONS = [
  { key: "send",     label: "Send",    icon: "↑" },
  { key: "receive",  label: "Receive", icon: "↓" },
  { key: "scan",     label: "Scan QR", icon: "◈" },
  { key: "withdraw", label: "Withdraw",icon: "⊞" },
];

function ActionBar({ onPress }) {
  return (
    <View style={{ flexDirection: "row", paddingHorizontal: 16, gap: 8, marginBottom: 28 }}>
      {ACTIONS.map(({ key, label, icon }) => (
        <TouchableOpacity
          key={key}
          onPress={() => onPress(key)}
          activeOpacity={0.8}
          style={{
            flex: 1,
            backgroundColor: "#111",
            borderWidth: 1,
            borderColor: "#222",
            borderRadius: 14,
            paddingVertical: 16,
            alignItems: "center",
            gap: 6,
          }}
        >
          <Text style={{ color: "#FF6600", fontSize: 20, fontWeight: "700", lineHeight: 24 }}>{icon}</Text>
          <Text style={{ color: "#A1A1AA", fontSize: 10, fontWeight: "600", letterSpacing: 0.5 }}>{label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

ActionBar.propTypes = {
  onPress: PropTypes.func.isRequired,
};

// ── Transaction Item ──────────────────────────────────────────────────────────

function TransactionItem({ item }) {
  const isReceive = item.type === "receive";
  const shortAddress = item.counterparty
    ? `${item.counterparty.slice(0, 8)}…${item.counterparty.slice(-6)}`
    : "Unknown";
  const dateLabel = item.timestamp
    ? new Date(item.timestamp).toLocaleDateString()
    : "—";

  return (
    <View style={{
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 24,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: "#1A1A1A",
    }}>
      <View style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: isReceive ? "#0A2A0A" : "#2A0A0A",
        borderWidth: 1,
        borderColor: isReceive ? "#22C55E" : "#EF4444",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 14,
      }}>
        <Text style={{ color: isReceive ? "#22C55E" : "#EF4444", fontSize: 16, fontWeight: "700" }}>
          {isReceive ? "+" : "−"}
        </Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={{ color: "#FFF", fontSize: 13, fontWeight: "600", fontFamily: "monospace" }} numberOfLines={1}>
          {shortAddress}
        </Text>
        <Text style={{ color: "#52525B", fontSize: 11, marginTop: 3 }}>{dateLabel}</Text>
      </View>

      <View style={{ alignItems: "flex-end" }}>
        <Text style={{ color: isReceive ? "#22C55E" : "#EF4444", fontSize: 15, fontWeight: "700" }}>
          {isReceive ? "+" : "−"}KES {Number.parseFloat(item.amount_kes).toFixed(2)}
        </Text>
        <Text style={{ color: "#52525B", fontSize: 11, textTransform: "capitalize", marginTop: 3 }}>
          {item.status}
        </Text>
      </View>
    </View>
  );
}

TransactionItem.propTypes = {
  item: PropTypes.shape({
    type:        PropTypes.string,
    counterparty: PropTypes.string,
    timestamp:   PropTypes.string,
    amount_kes:  PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    status:      PropTypes.string,
  }).isRequired,
};

// ── Main Dashboard ────────────────────────────────────────────────────────────

export default function WalletDashboard({ navigation }) {
  const [balance, setBalance] = useState(null);
  const [address, setAddress] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loadingBalance, setLoadingBalance] = useState(true);
  const [loadingTx, setLoadingTx] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBalance = useCallback(async () => {
    try {
      const data = await getBalance();
      setBalance(data.kes_balance);
      setAddress(data.stellar_address);
    } catch {
      setBalance(0);
    } finally {
      setLoadingBalance(false);
    }
  }, []);

  const fetchTransactions = useCallback(async () => {
    try {
      const txs = await getTransactions();
      setTransactions(txs ?? []);
    } catch {
      setTransactions([]);
    } finally {
      setLoadingTx(false);
    }
  }, []);

  useEffect(() => {
    fetchBalance();
    fetchTransactions();
  }, [fetchBalance, fetchTransactions]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchBalance(), fetchTransactions()]);
    setRefreshing(false);
  }, [fetchBalance, fetchTransactions]);

  const handleAction = (key) => {
    if (key === "send") {
      Alert.prompt("Send KES", "Destination Stellar address:", (dest) => {
        if (!dest) return;
        Alert.prompt("Amount (KES)", "Amount to send:", async (amt) => {
          if (!amt) return;
          try {
            const result = await sendToken(dest.trim(), Number.parseFloat(amt));
            Alert.alert("Sent", `TX hash:\n${result.txHash}`);
            onRefresh();
          } catch (err) {
            Alert.alert("Transfer failed", err.message);
          }
        }, "plain-text");
      }, "plain-text");
      return;
    }
    if (key === "receive") {
      Alert.alert("Receive", `Your Stellar address:\n\n${address}`);
      return;
    }
    if (key === "scan") {
      navigation.navigate("Verify");
      return;
    }
    if (key === "withdraw") {
      Alert.alert("Withdraw", "M-Pesa withdrawal coming soon.");
    }
  };

  const ListHeader = (
    <>
      <BalanceHeader balance={balance} address={address} loading={loadingBalance} />
      <ActionBar onPress={handleAction} />
      <View style={{ paddingHorizontal: 24, marginBottom: 14 }}>
        <Text style={{
          color: "#52525B",
          fontSize: 10,
          fontWeight: "700",
          letterSpacing: 2.5,
          textTransform: "uppercase",
        }}>
          Recent Transactions
        </Text>
      </View>
      {loadingTx && (
        <ActivityIndicator color="#FF6600" style={{ marginVertical: 24 }} />
      )}
      {!loadingTx && transactions.length === 0 && (
        <Text style={{ color: "#3F3F46", fontSize: 14, textAlign: "center", paddingVertical: 40 }}>
          No transactions yet.
        </Text>
      )}
    </>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id || item.tx_hash}
        renderItem={({ item }) => <TransactionItem item={item} />}
        ListHeaderComponent={ListHeader}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF6600" />
        }
      />
    </SafeAreaView>
  );
}

WalletDashboard.propTypes = {
  navigation: PropTypes.shape({ navigate: PropTypes.func.isRequired }).isRequired,
};
