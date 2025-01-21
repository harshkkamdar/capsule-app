import { View, Text, FlatList, TouchableOpacity, Alert, Dimensions, Animated, ActivityIndicator } from "react-native"
import React, { useEffect, useState, useRef } from "react"
import { collection, query, orderBy, getDocs, deleteDoc, doc, where } from "firebase/firestore"
import { db, storage, auth } from "../../lib/firebase"
import { router } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import ImageSlider from "../../components/posts/ImageSlider"
import { ref, deleteObject } from "firebase/storage"
import { useFonts } from "expo-font"
import Header from "../../components/shared/Header"
import { SearchBar, type SearchParams } from "../../components/posts/SearchBar"
import { useFocusEffect } from '@react-navigation/native'

interface Post {
  id: string
  userId: string
  mediaUrls: { url: string; type: "image" | "video" }[]
  description: string
  datetime: Date
  location?: string
  tags: string[]
  people?: string[]
}

export default function MemoriesScreen() {
  const [posts, setPosts] = useState<Post[]>([])
  const screenWidth = Dimensions.get("window").width
  const fadeAnim = useRef(new Animated.Value(0)).current
  const [searchParams, setSearchParams] = useState<SearchParams>({
    text: "",
    tags: [],
  })
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
  const [refreshing, setRefreshing] = useState(false)

  const [fontsLoaded] = useFonts({
    "Rubik-Regular": require("./../../../assets/fonts/Rubik-Regular.ttf"),
    "Rubik-Medium": require("./../../../assets/fonts/Rubik-Medium.ttf"),
    "Rubik-Bold": require("./../../../assets/fonts/Rubik-Bold.ttf"),
  })

  useEffect(() => {
    fetchPosts()
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start()
  }, [])

  useEffect(() => {
    setFilteredPosts(filterPosts(posts, searchParams))
  }, [posts, searchParams])

  useFocusEffect(
    React.useCallback(() => {
      fetchPosts();
    }, [])
  );

  const fetchPosts = async () => {
    try {
      // First query - posts created by user
      const q = query(
        collection(db, "posts"),
        where('userId', '==', auth.currentUser?.uid),
        orderBy("datetime", "desc")
      );

      // Second query - posts where user is tagged
      const taggedQ = query(
        collection(db, "posts"),
        where('people', 'array-contains', auth.currentUser?.uid),
        orderBy("datetime", "desc")
      );

      try {
        const [postsSnapshot, taggedSnapshot] = await Promise.all([
          getDocs(q),
          getDocs(taggedQ)
        ]);

        const allPosts = [...postsSnapshot.docs, ...taggedSnapshot.docs]
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
            datetime: doc.data().datetime.toDate(),
          })) as Post[];

        // Remove duplicates and sort
        const uniquePosts = Array.from(
          new Map(allPosts.map(post => [post.id, post])).values()
        ).sort((a, b) => b.datetime.getTime() - a.datetime.getTime());

        setPosts(uniquePosts);
      } catch (error: any) {
        // Check if the error is due to missing index
        if (error.code === 'failed-precondition') {
          console.warn('Indexes are being built. Please wait a few minutes and try again.');
          // Instead of fetching all posts, fetch only user's posts without compound query
          const userPostsQuery = query(
            collection(db, "posts"),
            where('userId', '==', auth.currentUser?.uid)
          );
          const snapshot = await getDocs(userPostsQuery);
          const posts = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            datetime: doc.data().datetime.toDate(),
          })) as Post[];
          setPosts(posts);
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setPosts([]); // Set empty array instead of showing all posts
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };

  const handleDelete = async (postId: string) => {
    Alert.alert(
      "Delete Memory",
      "Are you sure you want to delete this memory?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const postRef = doc(db, "posts", postId);
              await deleteDoc(postRef);
              setPosts((current) => current.filter((p) => p.id !== postId));
              Alert.alert("Success", "Memory deleted successfully");
            } catch (error) {
              console.error("Error deleting post:", error);
              Alert.alert("Error", "Failed to delete memory");
            }
          },
        },
      ]
    );
  };

  const filterPosts = (posts: Post[], searchParams: SearchParams) => {
    return posts.filter((post) => {
      const textMatch = !searchParams.text || post.description.toLowerCase().includes(searchParams.text.toLowerCase())

      const dateMatch = !searchParams.date || post.datetime.toDateString() === searchParams.date.toDateString()

      const locationMatch =
        !searchParams.location ||
        (post.location && post.location.toLowerCase().includes(searchParams.location.toLowerCase()))

      const tagMatch =
        searchParams.tags.length === 0 ||
        searchParams.tags.some((tag) => post.tags.some((postTag) => postTag.toLowerCase().includes(tag.toLowerCase())))

      return textMatch && dateMatch && locationMatch && tagMatch
    })
  }

  const renderPost = ({ item: post, index }: { item: Post; index: number }) => {
    const isEven = index % 2 === 0
    const cardWidth = screenWidth * 0.42

    return (
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{
            translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [50, 0],
            }),
          }],
        }}
        className="py-3"
      >
        <View className="flex-row items-center justify-center">
          {/* Left card */}
          <View className="flex-1 items-end">
            {isEven && (
              <View>
                <TouchableOpacity
                  onPress={() => router.push(`/properties/${post.id}`)}
                  style={{ width: cardWidth }}
                >
                  <View className="bg-white rounded-2xl shadow-sm overflow-hidden border border-accent-100">
                    <ImageSlider images={post.mediaUrls || []} height={120} />
                    <View className="p-3">
                      <Text className="font-rubik-medium text-black-300 text-center text-sm">
                        {post.datetime.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
                {post.userId === auth.currentUser?.uid && (
                  <TouchableOpacity
                    onPress={() => handleDelete(post.id)}
                    className="absolute top-2 right-2 bg-black/50 rounded-full p-1"
                  >
                    <Ionicons name="trash-outline" size={16} color="white" />
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>

          {/* Center dot and line */}
          <View className="w-12 items-center justify-center relative">
            <View className="w-3 h-3 rounded-full bg-primary-300 z-10" />
            <View className="absolute w-[1px] h-full bg-primary-200" />
          </View>

          {/* Right card */}
          <View className="flex-1 items-start">
            {!isEven && (
              <View>
                <TouchableOpacity
                  onPress={() => router.push(`/properties/${post.id}`)}
                  style={{ width: cardWidth }}
                >
                  <View className="bg-white rounded-2xl shadow-sm overflow-hidden border border-accent-100">
                    <ImageSlider images={post.mediaUrls || []} height={120} />
                    <View className="p-3">
                      <Text className="font-rubik-medium text-black-300 text-center text-sm">
                        {post.datetime.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
                {post.userId === auth.currentUser?.uid && (
                  <TouchableOpacity
                    onPress={() => handleDelete(post.id)}
                    className="absolute top-2 right-2 bg-black/50 rounded-full p-1"
                  >
                    <Ionicons name="trash-outline" size={16} color="white" />
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        </View>
      </Animated.View>
    )
  }

  if (!fontsLoaded) {
    return null
  }

  return (
    <View className="flex-1 bg-accent-100">
      <Header variant="memories" onRefresh={handleRefresh} />
      <SearchBar onSearch={setSearchParams} />
      {filteredPosts.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg text-gray-500">No memories yet!!</Text>
          <TouchableOpacity
            onPress={() => router.push('/new-post')}
            className={`p-4 rounded-lg items-center bg-blue-500 mt-4 rounded-full`}
          >
            <Text className="text-white font-bold">Create your first memory</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredPosts}
          renderItem={renderPost}
          keyExtractor={(post) => post.id}
          className="flex-1"
          contentContainerClassName="py-4 pb-20"
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      )}
    </View>
  )
}

