import { View, Text, FlatList, TouchableOpacity, Alert, Dimensions, Animated } from "react-native"
import React, { useEffect, useState, useRef } from "react"
import { collection, query, orderBy, getDocs, deleteDoc, doc } from "firebase/firestore"
import { db, storage, auth } from "../../lib/firebase"
import { router } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import ImageSlider from "../../components/posts/ImageSlider"
import { ref, deleteObject } from "firebase/storage"
import { useFonts } from "expo-font"

interface Post {
  id: string
  userId: string
  mediaUrls: { url: string; type: "image" | "video" }[]
  description: string
  datetime: Date
  location?: string
  tags: string[]
}

export default function Index() {
  const [posts, setPosts] = useState<Post[]>([])
  const screenWidth = Dimensions.get("window").width
  const fadeAnim = useRef(new Animated.Value(0)).current

//   const [fontsLoaded] = useFonts({
//     "DM-Sans": require("../../assets/fonts/DMSans-Regular.ttf"),
//     "DM-Sans-Bold": require("../../assets/fonts/DMSans-Bold.ttf"),
//   })

  useEffect(() => {
    fetchPosts()
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start()
  }, [])

  const fetchPosts = async () => {
    try {
      const q = query(collection(db, "posts"), orderBy("datetime", "desc"))
      const querySnapshot = await getDocs(q)

      const fetchedPosts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        datetime: doc.data().datetime.toDate(),
      })) as Post[]

      setPosts(fetchedPosts)
    } catch (error) {
      console.error("Error fetching posts:", error)
    }
  }

  const handleDelete = async (post: Post) => {
    Alert.alert("Delete Memory", "Are you sure you want to delete this memory?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await Promise.all(
              post.mediaUrls.map(async (media) => {
                try {
                  const urlPath = media.url.split("posts%2F")[1].split("?")[0]
                  const fileRef = ref(storage, `posts/${decodeURIComponent(urlPath)}`)
                  await deleteObject(fileRef)
                } catch (error) {
                  console.error("Error deleting media:", error)
                }
              }),
            )
            await deleteDoc(doc(db, "posts", post.id))
            setPosts((current) => current.filter((p) => p.id !== post.id))
            Alert.alert("Success", "Memory deleted successfully")
          } catch (error) {
            console.error("Error deleting post:", error)
            Alert.alert("Error", "Failed to delete memory. Please try again.")
          }
        },
      },
    ])
  }

  const renderPost = ({ item: post, index }: { item: Post; index: number }) => {
    const isEven = index % 2 === 0
    const cardWidth = screenWidth * 0.42

    return (
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
          ],
        }}
        className="py-3"
      >
        <View className="flex-row items-center justify-center">
          {/* Left card */}
          <View className="flex-1 items-end">
            <TouchableOpacity
              onPress={() => router.push(`/properties/${post.id}`)}
              style={{ width: cardWidth }}
              className={`bg-white rounded-lg shadow-sm overflow-hidden ${isEven ? "opacity-100" : "opacity-0"}`}
            >
              <ImageSlider images={post.mediaUrls} height={120} />
              <View className="p-2">
                <Text className="font-['DM-Sans-Bold'] text-[#264653] text-center">
                  {post.datetime.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Center dot */}
          <View className="w-12 items-center justify-center">
            <View className="w-3 h-3 rounded-full bg-[#2A9D8F]" />
          </View>

          {/* Right card */}
          <View className="flex-1 items-start">
            <TouchableOpacity
              onPress={() => router.push(`/properties/${post.id}`)}
              style={{ width: cardWidth }}
              className={`bg-white rounded-lg shadow-sm overflow-hidden ${!isEven ? "opacity-100" : "opacity-0"}`}
            >
              <ImageSlider images={post.mediaUrls} height={120} />
              <View className="p-2">
                <Text className="font-['DM-Sans-Bold'] text-[#264653] text-center">
                  {post.datetime.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    )
  }

//   if (!fontsLoaded) {
//     return null
//   }

  return (
    <View className="flex-1 bg-[#F8F9FA]">
      {/* Center timeline line */}
      <View className="absolute left-1/2 w-[1px] h-full bg-[#2A9D8F]/20" />

      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(post) => post.id}
        className="flex-1"
        contentContainerClassName="py-4"
      />
    </View>
  )
}

