import { View, Text } from "react-native";
import React from "react";
import { useAuthStore } from "@/store/auth.store";
import styles from "@/assets/styleSheets/profile.styles";
import { Image } from "expo-image";
import { formatMemberSince } from "@/lib/utils";

export default function ProfileHeader() {
  const { user } = useAuthStore();
  return user && (
    <View style={styles.profileHeader}>
      <Image source={{ uri: user?.profileImage }} style={styles.profileImage} />
      <View style={styles.profileInfo}>
        <Text style={styles.username}>{user?.username}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <Text>🗓️ Joined {formatMemberSince(user?.createdAt)}</Text>
      </View>
    </View>
  );
}
