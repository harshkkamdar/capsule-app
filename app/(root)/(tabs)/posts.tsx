import { View, Text, FlatList, TouchableOpacity, Alert, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db, storage, auth } from '../../lib/firebase';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ImageSlider from '../../components/posts/ImageSlider';
import { ref, deleteObject } from 'firebase/storage';

interface Post {
    id: string;
    userId: string;
    mediaUrls: { url: string; type: 'image' | 'video' }[];
    description: string;
    datetime: Date;
    location?: string;
    tags: string[];
}

export default function Posts() {
    const [posts, setPosts] = useState<Post[]>([]);
    const screenWidth = Dimensions.get('window').width;

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const q = query(collection(db, 'posts'), orderBy('datetime', 'desc'));
            const querySnapshot = await getDocs(q);

            const fetchedPosts = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                datetime: doc.data().datetime.toDate()
            })) as Post[];

            setPosts(fetchedPosts);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const handleDelete = async (post: Post) => {
        Alert.alert(
            "Delete Post",
            "Are you sure you want to delete this post? This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            // Delete media from storage
                            await Promise.all(
                                post.mediaUrls.map(async (media) => {
                                    try {
                                        // Extract the path from the full URL
                                        const urlPath = media.url.split('posts%2F')[1].split('?')[0];
                                        const fileRef = ref(storage, `posts/${decodeURIComponent(urlPath)}`);
                                        await deleteObject(fileRef);
                                    } catch (error) {
                                        console.error('Error deleting media:', error);
                                    }
                                })
                            );

                            // Delete post document
                            await deleteDoc(doc(db, 'posts', post.id));

                            // Update local state
                            setPosts(current => current.filter(p => p.id !== post.id));
                            Alert.alert('Success', 'Post deleted successfully');
                        } catch (error) {
                            console.error('Error deleting post:', error);
                            Alert.alert('Error', 'Failed to delete post. Please try again.');
                        }
                    }
                }
            ]
        );
    };

    const renderPost = ({ item: post }: { item: Post }) => (
        <View className="mb-8 bg-white">
            <TouchableOpacity
                onPress={() => router.push(`/properties/${post.id}`)}
                className="relative"
            >
                <ImageSlider images={post.mediaUrls} height={300} />
            </TouchableOpacity>

            <View className="p-4">
                <View className="flex-row justify-between items-start">
                    <Text className="text-lg font-bold">
                        {post.datetime.toLocaleDateString()}
                    </Text>
                    {post.userId === auth.currentUser?.uid && (
                        <TouchableOpacity
                            onPress={() => handleDelete(post)}
                            className="p-2"
                        >
                            <Ionicons name="trash-outline" size={20} color="red" />
                        </TouchableOpacity>
                    )}
                </View>

                <Text className="text-gray-800 mt-2">{post.description}</Text>

                {post.location && (
                    <View className="flex-row items-center mt-2">
                        <Ionicons name="location-outline" size={16} color="gray" />
                        <Text className="text-gray-600 ml-1">{post.location}</Text>
                    </View>
                )}

                {post.tags.length > 0 && (
                    <View className="flex-row flex-wrap mt-2">
                        {post.tags.map((tag, index) => (
                            <View key={index} className="bg-gray-100 rounded-full px-3 py-1 mr-2 mb-2">
                                <Text className="text-gray-600">#{tag}</Text>
                            </View>
                        ))}
                    </View>
                )}
            </View>
        </View>
    );

    return (
        <FlatList
            data={posts}
            renderItem={renderPost}
            keyExtractor={post => post.id}
            className="flex-1 bg-gray-50"
        />
    );
}
