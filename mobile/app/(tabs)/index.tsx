import {
  View,
  Text,
  FlatList,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { Books } from "@/constants/types";
import axios from "axios";
import { API_URL } from "@/constants/api";
import styles from "@/assets/styleSheets/home.styles";
import { Image } from "expo-image";
import Ionicons from "@expo/vector-icons/Ionicons";
import COLORS from "@/constants/colors";
import { formatPublishDate } from "@/lib/utils";
import Loader from "@/components/Loader";

export default function Home() {
  const { token } = useAuthStore();
  const [books, setbooks] = useState<Books[]>([]);
  const [isLoading, setisLoading] = useState<boolean>(true);
  const [refreshing, setrefreshing] = useState<boolean>(false);
  const [page, setpage] = useState<number>(1);
  const [hasMore, sethasMore] = useState<boolean>(true);

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const fetchBooks = async (pageNum = 1, refresh = false) => {
    try {
      if (refresh) setrefreshing(true);
      else if (pageNum === 1) setisLoading(true);

      const response = await axios.get(
        `${API_URL}/api/v1/books?page=${pageNum}&limit=3`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const uniqueBoooks =
        refresh || pageNum === 1
          ? response.data.books
          : Array.from(
              new Set(
                [...books, ...response.data.books].map((book) => book._id)
              )
            ).map((id) =>
              [...books, ...response.data.books].find((book) => book._id === id)
            );
      setbooks(uniqueBoooks);

      sethasMore(pageNum < response.data.totalPages);
      setpage(pageNum);
    } catch (error: any) {
      console.log(error);
      Alert.alert("Error", error.response.data.message);
    } finally {
      if (refresh) {
        sleep(800);
        setrefreshing(false);
      }
      else setisLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (hasMore && !isLoading && !refreshing) {
      await fetchBooks(page + 1);
    }
  };
  useEffect(() => {
    fetchBooks();
  }, []);

  const renderItem = ({ item }: { item: Books }) => (
    <View key={item._id} style={styles.bookCard}>
      <View style={styles.bookHeader}>
        <View style={styles.userInfo}>
          <Image
            source={{ uri: item.user.profileImage }}
            style={styles.avatar}
          />
          <Text style={styles.username}>{item.user.username}</Text>
        </View>
      </View>

      <View style={styles.bookImageContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.bookImage}
          contentFit="cover"
        />
      </View>

      {/* Details */}
      <View style={styles.bookDetails}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <View style={styles.ratingContainer}>
          {renderRatingStars(item.rating)}
        </View>
        <Text style={styles.caption}>{item.caption}</Text>
        <Text style={styles.date}>
          Shared on : {formatPublishDate(item.createdAt)}
        </Text>
      </View>
    </View>
  );

  const renderRatingStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < rating; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          size={16}
          color={i <= rating ? "#f4b400" : COLORS.textSecondary}
          style={{ marginRight: 2 }}
        />
      );
    }
    return stars;
  };

  if (isLoading) {
    return <Loader size={"large"} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchBooks(1, true)}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>BookWorm</Text>
            <Text style={styles.headerSubtitle}>
              Discover great reads from the community
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="book-outline"
              size={60}
              color={COLORS.textSecondary}
            />
            <Text style={styles.emptyText}>No recommendations yet</Text>
            <Text style={styles.emptySubtext}>
              Be the first to share a book!
            </Text>
          </View>
        }
        ListFooterComponent={
          hasMore && books.length > 0 ? (
            <ActivityIndicator
              size="small"
              style={styles.footerLoader}
              color={COLORS.primary}
            />
          ) : null
        }
      />
    </View>
  );
}
