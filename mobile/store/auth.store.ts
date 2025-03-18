import {create} from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://localhost:3000/api/v1";

interface AuthStore {
  user: any;
  error: string | null;
  isLoading: boolean;
  token: string | null;
  registerUser: ({
    username,
    email,
    password,
  }: {
    username: string;
    email: string;
    password: string;
  }) => Promise<void>;
  login: ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  error: null,
  isLoading: false,
  token: null,

  registerUser: async ({ username, email, password }) => {
    try {
      set({ isLoading: true });
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Something went wrong");
      console.log("Success");
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      await AsyncStorage.setItem("token", data.token);

      set({ user: data.user, token: data.token, error: null });
    } catch (error: any) {
      set({ error: error.message, user: null });
    } finally {
      set({ isLoading: false });
    }
  },

  login: async ({ email, password }) => {},

  logout: async () => {},
}));
