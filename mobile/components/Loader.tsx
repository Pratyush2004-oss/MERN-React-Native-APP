import { View, Text, ActivityIndicator } from "react-native";
import React from "react";
import COLORS from "@/constants/colors";

export default function Loader({size='large'}:{size:'small' | 'large' | number}) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.background,
      }}
    >
      <ActivityIndicator size={size} color={COLORS.primary} />
    </View>
  );
}
