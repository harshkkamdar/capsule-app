import { View, Text, ScrollView, Image, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { Ionicons } from '@expo/vector-icons'
import ImageSlider2 from '../../components/posts/ImageSlider2'

interface Post {
    id: string
    mediaUrls: { url: string; type: 'image' | 'video' }[]
    description: string
    datetime: Date
    location?: string
    tags: string[]
}

export default function Property() {
    const { id } = useLocalSearchParams()
    const [post, setPost] = useState<Post | null>(null)
    const screenWidth = Dimensions.get('window').width

    useEffect(() => {
        fetchPost()
    }, [id])

    const fetchPost = async () => {
        try {
            const docRef = doc(db, 'posts', id as string)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                setPost({
                    id: docSnap.id,
                    ...docSnap.data(),
                    datetime: docSnap.data().datetime.toDate()
                } as Post)
            }
        } catch (error) {
            console.error('Error fetching post:', error)
        }
    }

    if (!post) return null

    return (
        <ScrollView className="flex-1 bg-white">
            <ImageSlider2 images={post.mediaUrls} height={400} />

            {/* Post Details */}
            <View className="p-6">
                <Text className="text-2xl font-bold mb-4">
                    {post.datetime.toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </Text>

                <Text className="text-gray-800 text-lg mb-4">{post.description}</Text>

                {post.location && (
                    <View className="flex-row items-center mb-4">
                        <Ionicons name="location-outline" size={20} color="gray" />
                        <Text className="text-gray-600 ml-2 text-lg">{post.location}</Text>
                    </View>
                )}

                {post.tags.length > 0 && (
                    <View className="flex-row flex-wrap">
                        {post.tags.map((tag, index) => (
                            <View key={index} className="bg-gray-100 rounded-full px-4 py-2 mr-2 mb-2">
                                <Text className="text-gray-600 text-lg">#{tag}</Text>
                            </View>
                        ))}
                    </View>
                )}
            </View>
        </ScrollView>
    )
}