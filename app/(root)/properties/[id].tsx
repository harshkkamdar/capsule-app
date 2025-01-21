import { View, Text, ScrollView, TouchableOpacity, Dimensions, Alert } from "react-native"
import React, { useEffect, useState } from "react"
import { useLocalSearchParams, router } from "expo-router"
import { deleteDoc, doc, getDoc } from "firebase/firestore"
import { db, storage } from "../../lib/firebase"
import { Ionicons } from "@expo/vector-icons"
import ImageSlider2 from "../../components/posts/ImageSlider2"
import { ref } from "firebase/storage"
import { deleteObject } from "firebase/storage"
import { EditPost } from '../../components/posts/EditPost'

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
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)

  useEffect(() => {
    fetchPost()
  }, [id])

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
            // setPosts((current) => current.filter((p) => p.id !== post.id))
            Alert.alert("Success", "Memory deleted successfully")
          } catch (error) {
            console.error("Error deleting post:", error)
            Alert.alert("Error", "Failed to delete memory. Please try again.")
          }
        },
      },
    ])
  }

  const fetchPost = async () => {
    try {
      const docRef = doc(db, "posts", id as string)
      const docSnap = await getDoc(docRef)
      console.log(docSnap.data())
      if (docSnap.exists()) {
        const postData = docSnap.data();
        const peopleWithDisplayNames = await Promise.all(
          postData.people?.map(async (uid: string) => {
            const userDoc = await getDoc(doc(db, "users", uid));
            return userDoc.exists() ? userDoc.data().displayName : null;
          }) || []
        );

        setPost({
          id: docSnap.id,
          ...postData,
          datetime: postData.datetime.toDate(),
          people: peopleWithDisplayNames.filter(name => name !== null) as string[],
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
          }) || "None"}
        </Text>
        <TouchableOpacity 
          onPress={() => setIsEditModalVisible(true)}
          className="p-2"
        >
          <Ionicons name="pencil" size={24} color="#264653" />
        </TouchableOpacity>
        <View className="w-8" /> {/* Spacer for alignment */}
      </View>

      <ScrollView className="flex-1">
        <ImageSlider2 images={post.mediaUrls || []} height={400} />

        {/* Post Details */}
        <View className="bg-white mt-2 p-6 rounded-t-3xl">
          {/* Time */}
          <View className="flex-row items-center mb-6">
            <Ionicons name="time-outline" size={20} color="#0061FF" />
            <Text className="font-rubik-medium text-black-300 ml-2">
              {post.datetime.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              }) || "None"}
            </Text>
          </View>

          {/* Description */}
          <Text className="font-rubik text-black-200 text-base leading-6 mb-6">
            {post.description || "None"}
          </Text>

          {/* Location */}
          {post.location ? (
            <View className="flex-row items-center mb-6">
              <Ionicons name="location-outline" size={20} color="#0061FF" />
              <Text className="font-rubik text-black-200 ml-2">{post.location}</Text>
            </View>
          ) : (
            <Text className="font-rubik text-black-200 ml-2">Location: None</Text>
          )}

          {/* People */}
          {post.people && post.people.length > 0 ? (
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
          ) : (
            <View className="mb-6">
            <View className="flex-row items-center mb-3">
              <Ionicons name="people-outline" size={20} color="#0061FF" />
              <Text className="font-rubik-medium text-black-300 ml-2">People</Text>
            </View>
            <View className="flex-row flex-wrap gap-2">
              <Text>None</Text>
            </View>
          </View>
          )}

          {/* Tags */}
          {post.tags.length > 0 ? (
            <View>
              <View className="flex-row items-center mb-3">
                <Ionicons name="pricetags-outline" size={20} color="#0061FF" />
                <Text className="font-rubik-medium text-black-300 ml-2">Tags</Text>
              </View>
              <View className="flex-row flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <View key={index} className="bg-primary-100 rounded-xl px-3 py-2">
                    <Text className="font-rubik text-primary-300">{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <Text className="font-rubik text-black-200 ml-2">Tags: None</Text>
          )}
        </View>
      </ScrollView>

      <EditPost
        post={post}
        visible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        onUpdate={() => {
          fetchPost()
        }}
      />
    </View>
  )
}

