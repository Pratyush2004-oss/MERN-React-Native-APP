import { View, Text, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import styles from "@/assets/styleSheets/profile.styles";
import { Books } from "@/constants/types";
import { useRouter } from "expo-router";
import axios from "axios";
import { API_URL } from "@/constants/api";
import { useAuthStore } from "@/store/auth.store";
import ProfileHeader from "@/components/ProfileHeader";
import LogoutButton from "@/components/LogoutButton";

export default function Profile() {
  const [books, setbooks] = useState<Books[]>([]);
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [refreshing, setrefreshing] = useState<boolean>(false);
  const router = useRouter();
  const { token, user } = useAuthStore();

  const fetchBooks = async () => {
    try {
      setisLoading(true);
      const response = await axios.get(`${API_URL}/api/v1/books/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setbooks(response.data.books);
    } catch (error: any) {
      Alert.alert("Error", error.response.data.message);
    } finally {
      setisLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);
  return (
    <View style={styles.container}>
      <Text>Profile</Text>
      <ProfileHeader />
      <LogoutButton />
    </View>
  );
}
