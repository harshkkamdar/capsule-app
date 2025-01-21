import { View, Text, ScrollView, TouchableOpacity, Dimensions } from "react-native"
import React, { useEffect, useState } from "react"
import { useLocalSearchParams, router } from "expo-router"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../../lib/firebase"
import { Ionicons } from "@expo/vector-icons"
import ImageSlider2 from "../../components/posts/ImageSlider2"

interface Post {
  id: string
  mediaUrls: { url: string; type: "image" | "video" }[]
  description: string
  datetime: Date
  location?: string
  tags: string[]
  people?: string[]
}

export default function Property() {
  const { id } = useLocalSearchParams()
  const [post, setPost] = useState<Post | null>(null)
  const screenWidth = Dimensions.get("window").width

  useEffect(() => {
    fetchPost()
  }, [id])

  const fetchPost = async () => {
    try {
      const docRef = doc(db, "posts", id as string)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        setPost({
          id: docSnap.id,
          ...docSnap.data(),
          datetime: docSnap.data().datetime.toDate(),
        } as Post)
      }
    } catch (error) {
      console.error("Error fetching post:", error)
    }
  }

  if (!post) return null

  return (
    <View className="flex-1 bg-accent-100">
      {/* Header */}
      <View className="bg-white px-4 py-3 flex-row items-center border-b border-accent-100">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
          <Ionicons name="chevron-back" size={24} color="#191D31" />
        </TouchableOpacity>
        <Text className="flex-1 text-center font-rubik-medium text-black-300 text-lg -ml-8">
          {post.datetime.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </Text>
        <View className="w-8" /> {/* Spacer for alignment */}
      </View>

      <ScrollView className="flex-1">
        <ImageSlider2 images={post.mediaUrls} height={400} />

        {/* Post Details */}
        <View className="bg-white mt-2 p-6 rounded-t-3xl">
          {/* Time */}
          <View className="flex-row items-center mb-6">
            <Ionicons name="time-outline" size={20} color="#0061FF" />
            <Text className="font-rubik-medium text-black-300 ml-2">
              {post.datetime.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>

          {/* Description */}
          <Text className="font-rubik text-black-200 text-base leading-6 mb-6">{post.description}</Text>

          {/* Location */}
          {post.location && (
            <View className="flex-row items-center mb-6">
              <Ionicons name="location-outline" size={20} color="#0061FF" />
              <Text className="font-rubik text-black-200 ml-2">{post.location}</Text>
            </View>
          )}

          {/* People */}
          {post.people && post.people.length > 0 && (
            <View className="mb-6">
              <View className="flex-row items-center mb-3">
                <Ionicons name="people-outline" size={20} color="#0061FF" />
                <Text className="font-rubik-medium text-black-300 ml-2">People</Text>
              </View>
              <View className="flex-row flex-wrap gap-2">
                {post.people.map((person, index) => (
                  <View key={index} className="flex-row items-center bg-primary-100 rounded-xl px-3 py-2">
                    <Ionicons name="person" size={16} color="#0061FF" />
                    <Text className="font-rubik text-primary-300 ml-1">{person}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Tags */}
          {post.tags.length > 0 && (
            <View>
              <View className="flex-row items-center mb-3">
                <Ionicons name="pricetags-outline" size={20} color="#0061FF" />
                <Text className="font-rubik-medium text-black-300 ml-2">Tags</Text>
              </View>
              <View className="flex-row flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <View key={index} className="bg-primary-100 rounded-xl px-3 py-2">
                    <Text className="font-rubik text-primary-300">#{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  )
}

