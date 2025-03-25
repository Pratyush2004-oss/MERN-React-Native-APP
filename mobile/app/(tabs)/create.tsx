import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import styles from "@/assets/styleSheets/create.styles";
import Ionicons from "@expo/vector-icons/Ionicons";
import COLORS from "@/constants/colors";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system"
import { useAuthStore } from "@/store/auth.store";
import axios from "axios";
import { API_URL } from "@/constants/api";

export default function Create() {
  const [title, settitle] = useState<string>("");
  const [caption, setcaption] = useState<string>("");
  const [rating, setrating] = useState<number>(3);
  const [image, setimage] = useState<string | null>(null);
  const [isLoading, setisLoading] = useState(false);
  const router = useRouter();
  const { token } = useAuthStore();

  const pickImage = async () => {
    try {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission Denied",
            "We need camera roll permissions to make this work!"
          );
          return;
        }
      }

      // launch Image Library
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        quality: 0.5,
        aspect: [4, 3],
        base64: true,
      });

      if (!result.canceled) {
        setimage(result.assets[0].uri);
      }
    } catch (error: any) {
      Alert.alert("Error", "There was a problem in selecting the image.");
    }
  };

  const handleSubmit = async () => {
    try {
      setisLoading(true);

      if (!image) {
        Alert.alert("No Image Selected", "Please select an image first..");
        return;
      }

      if (!title || !caption || !rating) {
        Alert.alert("Error", "All fields are required");
        return;
      }

      // get the fileinfo 
      const fileInfo = await FileSystem.getInfoAsync(image);
      if(!fileInfo.exists){
        throw new Error("File does not exist")
      }

      // convert image uri to blob (required for formdata)
      // const blob = await new Promise<Blob>((resolve, reject) => {
      //   const xhr = new XMLHttpRequest();
      //   xhr.onload = () => resolve(xhr.response as Blob);
      //   xhr.onerror = () => reject(new TypeError("Network request failed"));
      //   xhr.responseType = "blob";
      //   xhr.open("GET", image, true);
      //   xhr.send(null);
      // });

      // Create form data
      const formData = new FormData();
      formData.append("title", title);
      formData.append("caption", caption);
      formData.append("image", {
        uri: image,
        name: "image.jpg",
        type: "image/jpeg",
      } as any);
      formData.append("rating", rating.toString());

      const response = await axios.post(`${API_URL}/api/v1/books`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      Alert.alert("Success", response.data.message);
      router.navigate("/(tabs)");
    } catch (error: any) {
      Alert.alert("Error", error.response.data.message);
      console.log(error.response.data.message);
    } finally {
      setisLoading(false);
    }
  };

  const renderRatingPicker = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => setrating(i)}
          style={styles.starButton}
        >
          <Ionicons
            name={i <= rating ? "star" : "star-outline"}
            size={32}
            color={i <= rating ? "#f4b400" : COLORS.textSecondary}
          />
        </TouchableOpacity>
      );
    }
    return <View style={styles.ratingContainer}>{stars}</View>;
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        style={styles.scrollViewStyle}
      >
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Add Book Recommendation</Text>
            <Text style={styles.subtitle}>
              Share your Favourite reads with other
            </Text>
          </View>

          <View style={styles.form}>
            {/* Book Title */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Book Title</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="book-outline"
                  size={20}
                  color={COLORS.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter book title"
                  value={title}
                  onChangeText={(text) => settitle(text)}
                  placeholderTextColor={COLORS.placeholderText}
                />
              </View>
            </View>

            {/* Rating */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Rating</Text>
              {renderRatingPicker()}
            </View>

            {/* Image */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Book Image</Text>
              <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
                {image ? (
                  <Image source={{ uri: image }} style={styles.previewImage} />
                ) : (
                  <View style={styles.placeholderContainer}>
                    <Ionicons
                      name="image-outline"
                      size={40}
                      color={COLORS.textSecondary}
                    />
                    <Text style={styles.placeholderText}>
                      Tap to select Image
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Caption */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Caption</Text>
              <TextInput
                value={caption}
                onChangeText={(text) => setcaption(text)}
                placeholderTextColor={COLORS.placeholderText}
                placeholder="Write your review or thoughts about this book..."
                style={styles.textArea}
                multiline
              />
            </View>

            {/* Submit */}
            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator />
              ) : (
                <>
                  <Ionicons
                    name="cloud-upload-outline"
                    size={20}
                    color={COLORS.white}
                    style={styles.buttonIcon}
                  />
                  <Text style={styles.buttonText}>Share</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
