import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import StatusBadge from "../../components/shared/StatusBadge";
import QRScanner from "../../components/shared/QRScanner";
import { getVouchStatus, requestVouch } from "../../services/verificationService";

const STATUS_DESCRIPTIONS = {
  UNVERIFIED: "Your identity has not yet been verified on the Stellar network.",
  PENDING:    "Your vouch request is pending. The Ambassador must sign on-chain.",
  VOUCHED:    "Your identity is verified and recorded on the Stellar blockchain.",
};

InfoRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

function InfoRow({ label, value }) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{
        color: "#52525B",
        fontSize: 10,
        fontWeight: "700",
        letterSpacing: 2,
        textTransform: "uppercase",
        marginBottom: 4,
      }}>
        {label}
      </Text>
      <Text style={{ color: "#FFF", fontSize: 13, fontFamily: "monospace" }}>{value}</Text>
    </View>
  );
}

function truncate(str, maxLen) {
  if (!str) return "";
  if (str.length <= maxLen) return str;
  return `${str.slice(0, maxLen / 2)}…${str.slice(-maxLen / 2)}`;
}

export default function VerificationDashboard() {
  const [identity, setIdentity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [vouching, setVouching] = useState(false);

  const fetchStatus = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getVouchStatus();
      setIdentity(data);
    } catch {
      Alert.alert("Error", "Could not load verification status.");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(fetchStatus);

  const handleQRScan = async (ambassadorPublicKey) => {
    setScanning(false);
    if (!ambassadorPublicKey.startsWith("G") || ambassadorPublicKey.length !== 56) {
      Alert.alert("Invalid QR", "This QR code does not contain a valid Ambassador key.");
      return;
    }
    try {
      setVouching(true);
      await requestVouch(ambassadorPublicKey);
      Alert.alert(
        "Request Submitted",
        "Your vouch request has been sent. The Ambassador will review and sign the agreement."
      );
      await fetchStatus();
    } catch (err) {
      Alert.alert("Error", err.response?.data?.detail || "Failed to submit vouch request.");
    } finally {
      setVouching(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#000", alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color="#FF6600" size="large" />
      </SafeAreaView>
    );
  }

  const currentStatus = identity?.verification_status ?? "UNVERIFIED";
  const isVouched = currentStatus === "VOUCHED";
  const isPending = currentStatus === "PENDING";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 32, paddingBottom: 40 }}>

        <Text style={{ color: "#FFF", fontSize: 28, fontWeight: "900", marginBottom: 4 }}>
          Verification
        </Text>
        <Text style={{ color: "#52525B", fontSize: 13, marginBottom: 28 }}>
          RefuLink Social Vouching System
        </Text>

        {/* Status Card */}
        <View style={{
          backgroundColor: "#111",
          borderWidth: 1,
          borderColor: "#FF6600",
          borderRadius: 16,
          padding: 20,
          marginBottom: 16,
        }}>
          <Text style={{
            color: "#52525B",
            fontSize: 10,
            fontWeight: "700",
            letterSpacing: 2.5,
            textTransform: "uppercase",
            marginBottom: 14,
          }}>
            Current Status
          </Text>
          <StatusBadge status={currentStatus} />
          <Text style={{ color: "#A1A1AA", fontSize: 13, marginTop: 14, lineHeight: 20 }}>
            {STATUS_DESCRIPTIONS[currentStatus]}
          </Text>
        </View>

        {/* Identity Details */}
        {identity?.hashed_rin && (
          <View style={{
            backgroundColor: "#111",
            borderWidth: 1,
            borderColor: "#222",
            borderRadius: 16,
            padding: 20,
            marginBottom: 16,
          }}>
            <Text style={{
              color: "#52525B",
              fontSize: 10,
              fontWeight: "700",
              letterSpacing: 2.5,
              textTransform: "uppercase",
              marginBottom: 16,
            }}>
              Identity Details
            </Text>
            <InfoRow label="Reference Hash" value={truncate(identity.hashed_rin, 24)} />
            <InfoRow label="Stellar Address" value={truncate(identity.stellar_public_key, 24)} />
            {identity.vouched_by && (
              <InfoRow label="Vouched By" value={truncate(identity.vouched_by, 24)} />
            )}
            {identity.vouched_at && (
              <InfoRow label="Vouched At" value={new Date(identity.vouched_at).toLocaleDateString()} />
            )}
          </View>
        )}

        {/* Action Button */}
        {!isVouched && (
          <TouchableOpacity
            onPress={() => setScanning(true)}
            disabled={isPending || vouching}
            style={{
              backgroundColor: isPending || vouching ? "#1A0A00" : "#FF6600",
              borderWidth: 1,
              borderColor: "#FF6600",
              borderRadius: 16,
              paddingVertical: 18,
              alignItems: "center",
            }}
          >
            {vouching ? (
              <ActivityIndicator color="#FF6600" />
            ) : (
              <Text style={{
                color: isPending ? "#FF6600" : "#000",
                fontWeight: "700",
                fontSize: 15,
              }}>
                {isPending ? "Awaiting Ambassador Signature" : "Scan Ambassador QR Code"}
              </Text>
            )}
          </TouchableOpacity>
        )}

        {isVouched && (
          <View style={{
            backgroundColor: "#052E16",
            borderWidth: 1,
            borderColor: "#22C55E",
            borderRadius: 16,
            paddingVertical: 18,
            alignItems: "center",
          }}>
            <Text style={{ color: "#22C55E", fontWeight: "700", fontSize: 15 }}>
              Identity Verified on Stellar
            </Text>
          </View>
        )}

        <QRScanner visible={scanning} onScan={handleQRScan} onClose={() => setScanning(false)} />
      </ScrollView>
    </SafeAreaView>
  );
}
