import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Alert } from "react-native";
import { API_URL } from "@/constants/api";

const BASE_URL = API_URL;

interface AuthStore {
  user: any;
  error: string | null;
  isLoading: boolean;
  token: string | null;
  registerUser: (
    username: string | null,
    email: string | null,
    password: string | null
  ) => Promise<void>;
  login: (email: string | null, password: string | null) => Promise<void>;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  error: null,
  isLoading: false,
  token: null,

  registerUser: async (username, email, password) => {
    try {
      set({ isLoading: true, error: null });
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

  login: async (email, password) => {
    try {
      set({ isLoading: true });
      const response = await axios.post(`${BASE_URL}/api/v1/auth/login`, {
        email,
        password,
      });
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
    } finally {
      set({ isLoading: false });
    }
  },

  checkAuth: async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userJSON = await AsyncStorage.getItem("user");

      const user = userJSON ? JSON.parse(userJSON) : null;
      set({ user, token });
    } catch (error) {
      console.log(error);
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    set({ user: null, token: null });
  },
}));
