import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Alert } from "react-native";
import { useRouter } from "expo-router";

const BASE_URL = "https://mern-react-native-app.onrender.com";

interface AuthStore {
  user: any;
  error: string | null;
  isLoading: boolean;
  token: string | null;
  registerUser: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  error: null,
  isLoading: false,
  token: null,

  registerUser: async (username, email, password) => {
    try {
      set({ isLoading: true, error:null });
      const response = await axios.post(
        `${BASE_URL}/api/v1/auth/signup`,
        { username, email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      AsyncStorage.setItem("token", response.data.token);
      AsyncStorage.setItem("user", JSON.stringify(response.data.user));
      set({
        user: response.data.user,
        error: null,
        token: response.data.token,
      });
      Alert.alert(response.data.message);
    } catch (error: any) {
      Alert.alert("Error", error.response.data.message);
      set({ error: error.response.data.message, user: null });
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (email, password) => {},

  logout: async () => {},
}));
