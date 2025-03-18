import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import styles from "@/assets/styleSheets/signup.styles";
import Ionicons from "@expo/vector-icons/Ionicons";
import COLORS from "@/constants/colors";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/store/auth.store";
export default function Signup() {
  const [username, setusername] = useState<string>("");
  const [email, setemail] = useState<string>("");
  const [password, setpassword] = useState<string>("");
  const [showPassword, setshowPassword] = useState<boolean>(false);
  const { error, isLoading, registerUser } = useAuthStore();
  const router = useRouter();
  const handleSignUp = async () => {
    await registerUser({ username, email, password });
  };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>BookWorm</Text>
            <Text style={styles.subtitle}>Share your Favourite reads</Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* User name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  style={styles.inputIcon}
                  name="person-outline"
                  size={20}
                  color={COLORS.primary}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor={COLORS.placeholderText}
                  value={username}
                  onChangeText={(text) => setusername(text)}
                />
              </View>
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  style={styles.inputIcon}
                  name="mail-outline"
                  size={20}
                  color={COLORS.primary}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor={COLORS.placeholderText}
                  value={email}
                  onChangeText={(text) => setemail(text)}
                  keyboardType="email-address"
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="key-outline"
                  size={20}
                  color={COLORS.primary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor={COLORS.placeholderText}
                  value={password}
                  onChangeText={(text) => setpassword(text)}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setshowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color={COLORS.primary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Buttton */}
            <TouchableOpacity
              onPress={handleSignUp}
              style={styles.button}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.buttonText}>Sign Up</Text>
              )}
            </TouchableOpacity>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account?</Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.link}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
