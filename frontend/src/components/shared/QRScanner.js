import React, { useEffect, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PropTypes from "prop-types";
import { Camera } from "expo-camera";

QRScanner.propTypes = {
  visible: PropTypes.bool.isRequired,
  onScan:  PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default function QRScanner({ visible, onScan, onClose }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (visible) {
      setScanned(false);
      Camera.requestCameraPermissionsAsync().then(({ status }) => {
        setHasPermission(status === "granted");
      });
    }
  }, [visible]);

  const handleBarCodeScanned = ({ data }) => {
    if (scanned) return;
    setScanned(true);
    onScan(data);
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Scan Ambassador QR Code</Text>
          <Text style={styles.subtitle}>
            Point your camera at the Ambassador's QR code
          </Text>
        </View>

        {hasPermission === null && (
          <Text style={styles.info}>Requesting camera permission…</Text>
        )}

        {hasPermission === false && (
          <Text style={styles.error}>
            Camera access denied. Please enable it in Settings.
          </Text>
        )}

        {hasPermission === true && (
          <Camera
            style={styles.camera}
            onBarCodeScanned={handleBarCodeScanned}
            barCodeScannerSettings={{ barCodeTypes: ["qr"] }}
          >
            <View style={styles.overlay}>
              <View style={styles.scanFrame} />
            </View>
          </Camera>
        )}

        <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
  },
  header: {
    paddingTop: 64,
    paddingHorizontal: 24,
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    color: "#FF6600",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    color: "#52525B",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
  },
  camera: {
    width: "100%",
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  scanFrame: {
    width: 240,
    height: 240,
    borderWidth: 2,
    borderColor: "#FF6600",
    borderRadius: 12,
    backgroundColor: "transparent",
  },
  info: {
    color: "#52525B",
    marginTop: 40,
    fontSize: 14,
  },
  error: {
    color: "#EF4444",
    marginTop: 40,
    textAlign: "center",
    paddingHorizontal: 24,
    fontSize: 14,
    lineHeight: 22,
  },
  cancelBtn: {
    marginTop: 24,
    marginBottom: 48,
    paddingHorizontal: 40,
    paddingVertical: 16,
    backgroundColor: "#111",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#222",
  },
  cancelText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 15,
    letterSpacing: 0.3,
  },
});