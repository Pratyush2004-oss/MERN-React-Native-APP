import { Alert } from "react-native";
import { create } from "zustand";
import axios from "axios";
import { useAuthStore } from "./auth.store";
import { API_URL } from "@/constants/api";

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
      const token = useAuthStore().token;

      // get file extension
      const uriParts = image?.split(".");
      const fileType = uriParts ? uriParts[uriParts.length - 1] : null;
      const imageType = fileType
        ? `image/${fileType.toLowerCase()}`
        : "image/jpeg";

      const imageDataUri = `data:${imageType};base64,${imageBase64}`;

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

      console.log(response.data);
      Alert.alert("Success", response.data.message);

      return true;
    } catch (error: any) {
      console.log(error.response);
      Alert.alert("Error", error.response.data.message);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
}));
