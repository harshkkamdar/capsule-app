import { View, Text, FlatList, TouchableOpacity, Alert, Dimensions, Animated } from "react-native"
import React, { useEffect, useState, useRef } from "react"
import { collection, query, orderBy, getDocs, deleteDoc, doc } from "firebase/firestore"
import { db, storage, auth } from "../../lib/firebase"
import { router } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import ImageSlider from "../../components/posts/ImageSlider"
import { ref, deleteObject } from "firebase/storage"
import { useFonts } from "expo-font"
import Header from "../../components/shared/Header"
import { SearchBar, type SearchParams } from "../../components/posts/SearchBar"

interface Post {
  id: string
  userId: string
  mediaUrls: { url: string; type: "image" | "video" }[]
  description: string
  datetime: Date
  location?: string
  tags: string[]
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
            {isEven && (
              <TouchableOpacity
                onPress={() => router.push(`/properties/${post.id}`)}
                style={{ width: cardWidth }}
              >
                <View className="bg-white rounded-2xl shadow-sm overflow-hidden border border-accent-100">
                  <ImageSlider images={post.mediaUrls} height={120} />
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
              <TouchableOpacity
                onPress={() => router.push(`/properties/${post.id}`)}
                style={{ width: cardWidth }}
              >
                <View className="bg-white rounded-2xl shadow-sm overflow-hidden border border-accent-100">
                  <ImageSlider images={post.mediaUrls} height={120} />
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
      <Header variant="memories" />
      <SearchBar onSearch={setSearchParams} />
      <FlatList
        data={filteredPosts}
        renderItem={renderPost}
        keyExtractor={(post) => post.id}
        className="flex-1"
        contentContainerClassName="py-4 pb-20"
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

