import React, { useMemo, useState } from "react";
import { PanResponder, Text, View } from "react-native";
import PropTypes from "prop-types";

const STEP = 500;
const THUMB_SIZE = 28;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function roundToStep(amount) {
  return Math.round(amount / STEP) * STEP;
}

export default function LoanAmountSlider({ limit, value, onChange }) {
  const [trackWidth, setTrackWidth] = useState(1);

  const currentValue = clamp(value ?? STEP, STEP, limit);
  const safeLimit = Math.max(limit, STEP);
  const fillWidth = trackWidth * (currentValue / safeLimit);
  const thumbLeft = clamp(
    fillWidth - THUMB_SIZE / 2,
    0,
    Math.max(trackWidth - THUMB_SIZE, 0)
  );

  const updateFromX = (x) => {
    if (limit < STEP || trackWidth <= 0) {
      return;
    }

    const safeX = clamp(x, 0, trackWidth);
    const rawAmount = (safeX / trackWidth) * limit;
    const snapped = clamp(roundToStep(rawAmount), STEP, limit);
    onChange(snapped);
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt) => updateFromX(evt.nativeEvent.locationX),
        onPanResponderMove: (evt) => updateFromX(evt.nativeEvent.locationX),
      }),
    [limit, trackWidth, onChange]
  );

  return (
    <View
      style={{
        backgroundColor: "#111",
        borderWidth: 1,
        borderColor: "#222",
        borderRadius: 16,
        marginHorizontal: 16,
        marginBottom: 16,
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
          marginBottom: 10,
        }}
      >
        Select Amount
      </Text>

      <Text style={{ color: "#FFF", fontSize: 28, fontWeight: "900" }}>
        KES {currentValue.toLocaleString()}
      </Text>
      <Text style={{ color: "#A1A1AA", fontSize: 12, marginTop: 4 }}>
        Drag the slider to choose a loan amount.
      </Text>

      <View
        onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)}
        {...panResponder.panHandlers}
        style={{
          height: 48,
          justifyContent: "center",
          marginTop: 18,
        }}
      >
        <View
          style={{
            height: 8,
            borderRadius: 999,
            backgroundColor: "#1F1F1F",
            overflow: "hidden",
          }}
        >
          <View
            style={{
              width: fillWidth,
              height: 8,
              borderRadius: 999,
              backgroundColor: "#FF6600",
            }}
          />
        </View>

        <View
          style={{
            position: "absolute",
            left: thumbLeft,
            top: 10,
            width: THUMB_SIZE,
            height: THUMB_SIZE,
            borderRadius: THUMB_SIZE / 2,
            backgroundColor: "#FFF",
            borderWidth: 4,
            borderColor: "#FF6600",
            elevation: 3,
          }}
        />
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ color: "#52525B", fontSize: 12 }}>
          Min KES {STEP.toLocaleString()}
        </Text>
        <Text style={{ color: "#52525B", fontSize: 12 }}>
          Max KES {limit.toLocaleString()}
        </Text>
      </View>
    </View>
  );
}

LoanAmountSlider.propTypes = {
  limit: PropTypes.number.isRequired,
  value: PropTypes.number,
  onChange: PropTypes.func.isRequired,
};

LoanAmountSlider.defaultProps = {
  value: null,
};