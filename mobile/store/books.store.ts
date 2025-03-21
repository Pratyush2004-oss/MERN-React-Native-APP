import { Alert } from "react-native";
import { create } from "zustand";
import axios from "axios";
import { useAuthStore } from "./auth.store";
import { API_URL } from "@/constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = API_URL;
interface BookStore {
  isLoading: boolean;
  error: string | null;
  createBook: (
    title: string | null,
    caption: string | null,
    imageBase64: string | null,
    rating: number,
    image: string | null
  ) => Promise<boolean>;
}

export const useBookStore = create<BookStore>((set) => ({
  isLoading: false,
  error: null,
  createBook: async (title, caption, imageBase64, rating, image) => {
    try {
      set({ isLoading: true, error: null });
      if (!title || !caption || !imageBase64 || !rating || !image) {
        Alert.alert("Error", "All fields are required");
        return false;
      }
      const token = await AsyncStorage.getItem("token");

      // get file extension
      const uriParts = image?.split(".");
      const fileType = uriParts[uriParts.length - 1];
      const imageType = fileType
        ? `image/${fileType.toLowerCase()}`
        : "image/jpeg";

      const imageDataUri = `data:${imageType};base64,${imageBase64}`;
      console.log("imageDataUri : ", fileType);

      const response = await axios.post(
        `${BASE_URL}/api/v1/books`,
        {
          title,
          caption,
          image: imageDataUri,
          rating: rating.toString(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // console.log(response);
      Alert.alert("Success", response.data.message);
      set({ error: null });

      return true;
    } catch (error: any) {
      console.log(error);
      set({ error: error });
      Alert.alert("Error", error.response.data.message);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
}));
