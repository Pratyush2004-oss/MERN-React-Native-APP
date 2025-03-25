import {
  View,
  Text,
  Alert,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import styles from "@/assets/styleSheets/profile.styles";
import { Books } from "@/constants/types";
import { useRouter } from "expo-router";
import axios from "axios";
import { API_URL } from "@/constants/api";
import { useAuthStore } from "@/store/auth.store";
import ProfileHeader from "@/components/ProfileHeader";
import LogoutButton from "@/components/LogoutButton";
import Ionicons from "@expo/vector-icons/Ionicons";
import COLORS from "@/constants/colors";
import { Image } from "expo-image";
import Loader from "@/components/Loader";

export default function Profile() {
  const [books, setbooks] = useState<Books[]>([]);
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [refreshing, setrefreshing] = useState<boolean>(false);
  const [deleteBookLoader, setdeleteBookLoader] = useState<string | null>(null);
  const router = useRouter();
  const { token, user } = useAuthStore();

  // fetching the books of the user
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

  // sleep
  const sleep = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  // render book card
  const renderBookItem = ({ item }: { item: Books }) => {
    return (
      <View style={styles.bookItem}>
        <Image source={{ uri: item.image }} style={styles.bookImage} />
        <View style={styles.bookInfo}>
          <Text style={styles.bookTitle}>{item.title}</Text>
          <View style={styles.ratingContainer}>{renderStars(item.rating)}</View>
          <Text style={styles.bookCaption} numberOfLines={2}>
            {item.caption}
          </Text>
          <Text style={styles.bookDate}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
        {deleteBookLoader === item._id ? (
          <ActivityIndicator color={COLORS.primary} size="small" />
        ) : (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => confirmDelete(item._id)}
          >
            <Ionicons name="trash-outline" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // function for dialog for delting a book
  const confirmDelete = (bookId: string) => {
    Alert.alert(
      "Delete Book",
      "Are you sure you want to delete this recommendation?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteBook(bookId),
        },
      ]
    );
  };

  // ḍelete Book
  const deleteBook = async (bookId: string) => {
    setdeleteBookLoader(bookId);
    try {
      const response = await axios.delete(`${API_URL}/api/v1/books/${bookId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setbooks(books.filter((book) => book._id !== bookId));
      Alert.alert("Success", response.data.message);
    } catch (error: any) {
      Alert.alert("Error", error.response.data.message);
    } finally {
      setdeleteBookLoader(null);
    }
  };

  // render stars
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          size={15}
          color={i <= rating ? "#f4b400" : COLORS.textSecondary}
          style={{ marginRight: 2 }}
        />
      );
    }
    return stars;
  };

  // refreshing the list
  const handleRefresh = async () => {
    setrefreshing(true);
    await sleep(500);
    await fetchBooks();
    setrefreshing(false);
  };

  // if loading
  if (isLoading && !refreshing) {
    return <Loader size={30} />;
  }

  // render page
  return (
    <View style={styles.container}>
      <Text>Profile</Text>
      <ProfileHeader />
      <LogoutButton />

      {/* Recommedations */}
      <View style={styles.booksHeader}>
        <Text style={styles.bookTitle}>Your recommendations</Text>
        <Text style={styles.booksCount}>{books.length} books</Text>
      </View>

      {/* FlatList */}
      <FlatList
        data={books}
        keyExtractor={(item) => item._id}
        renderItem={renderBookItem}
        contentContainerStyle={styles.booksList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="book-outline"
              size={50}
              color={COLORS.textSecondary}
            />
            <Text style={styles.emptyText}>No recommendations yet</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push("/(tabs)/create")}
            >
              <Text>Add your first book</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}
