import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import React, { useState, useRef } from 'react';
import { MediaPicker, MediaItem } from '../../components/upload/MediaPicker';
import { TagInput } from '../../components/upload/TagInput';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { doc, setDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from '../../lib/firebase';
import Header from "../../components/shared/Header"
import { PeoplePicker } from '../../components/upload/PeoplePicker';
import { PredefinedTagInput } from '../../components/upload/PredefinedTagInput';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ImageSlider from '../../components/posts/ImageSlider';

interface UploadPost {
  media: MediaItem[];
  location?: string;
  people?: string[];
  datetime: Date;
  tags: string[];
  description: string;
}

export default function NewPostScreen() {
  const [post, setPost] = useState<UploadPost>({
    media: [],
    datetime: new Date(),
    tags: [],
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const dragItem = useRef(null);

  const handleDragStart = (index: any) => {
    dragItem.current = index;
  };

  const handleDrop = (index: any) => {
    if (dragItem.current !== null) {
      const draggedItem = post.media[dragItem.current];
      const updatedMedia = post.media.filter((_, i) => i !== dragItem.current);
      updatedMedia.splice(index, 0, draggedItem);
      setPost(prev => ({ ...prev, media: updatedMedia }));
      dragItem.current = null;
    }
  };

  const handleUpload = async () => {
    if (!post.media.length) {
      alert('Please select at least one media item');
      return;
    }

    setLoading(true);
    try {
      const mediaUrls = await Promise.all(
        post.media.map(async (media) => {
          const response = await fetch(media.uri);
          const blob = await response.blob();
          const fileRef = ref(storage, `posts/${Date.now()}-${media.fileName}`);
          await uploadBytes(fileRef, blob);
          return {
            url: await getDownloadURL(fileRef),
            type: media.type
          };
        })
      );

      // Create post document with only defined fields
      const postData = {
        userId: auth.currentUser?.uid,
        mediaUrls,
        datetime: post.datetime,
        tags: post.tags,
        description: post.description,
        createdAt: new Date(),
        ...(post.location && { location: post.location }),
        ...(post.people && { people: post.people })
      };

      const postRef = doc(collection(db, 'posts'));
      await setDoc(postRef, postData);

      // Reset form
      setPost({
        media: [],
        datetime: new Date(),
        tags: [],
        description: ''
      });
      
      alert('Post uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="flex-1 bg-white">
        <Header variant="new-post" />
        <ScrollView className="flex-1 bg-white p-4" contentContainerStyle={{ paddingBottom: 20 }}>
          {/* <Text className="text-2xl font-bold mb-6">Create New Post</Text> */}
          
          <MediaPicker
            onMediaSelect={(media) => setPost(prev => ({ 
              ...prev, 
              media: [...prev.media, ...media]
            }))}
          />
          {/* Media display is hidden as per instructions */}
          
          {/* Display selected media with ImageSlider and delete buttons */}
          {post.media.length > 0 && (
            <View className="mb-4">
              {/* <ImageSlider
                images={post.media.map(media => ({ url: media.uri, type: media.type }))}
                height={300}
              /> */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-2">
                {post.media.map((media, index) => (
                  <View key={index} className="relative mr-2">
                    <Image
                      source={{ uri: media.uri }}
                      style={{ width: 80, height: 80 }}
                      className="rounded-lg"
                    />
                    <TouchableOpacity
                      onPress={() => {
                        setPost(prev => ({
                          ...prev,
                          media: prev.media.filter((_, i) => i !== index)
                        }));
                      }}
                      className="absolute top-1 right-1 bg-black/50 rounded-full p-1"
                    >
                      <Ionicons name="close" size={16} color="white" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          <TextInput
            placeholder="Add a description..."
            value={post.description}
            onChangeText={(text) => setPost(prev => ({ ...prev, description: text }))}
            multiline
            className="p-3 border border-gray-200 rounded-lg mb-4"
            style={{ height: 100 }}
          />

          <TouchableOpacity 
            onPress={() => setShowDatePicker(true)}
            className="flex-row items-center p-3 border border-gray-200 rounded-lg mb-4"
          >
            <Ionicons name="calendar-outline" size={24} color="gray" />
            <Text className="ml-2">{post.datetime.toLocaleDateString()}</Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={new Date(post.datetime.setHours(new Date().getHours(), new Date().getMinutes()))}
              mode="date"
              display="default"
              onChange={(event, date) => {
                if (event.type === 'set' && date) {
                  const currentTime = new Date();
                  setPost(prev => ({ ...prev, datetime: new Date(date.setHours(currentTime.getHours(), currentTime.getMinutes())) }));
                }
                setShowDatePicker(false);
              }}
            />
          )}

          <TextInput
            placeholder="Add location..."
            value={post.location}
            onChangeText={(text) => setPost(prev => ({ ...prev, location: text }))}
            className="p-3 border border-gray-200 rounded-lg mb-4"
          />

          <PeoplePicker
            selectedPeople={post.people || []}
            onPeopleSelect={(people) => setPost(prev => ({ ...prev, people }))}
          />

          <PredefinedTagInput
            onTagsChange={(tags) => setPost(prev => ({ ...prev, tags }))}
            initialTags={post.tags}
          />

          <TouchableOpacity
            onPress={handleUpload}
            disabled={loading}
            className={`p-4 rounded-lg items-center ${loading ? 'bg-gray-400' : 'bg-blue-500'}`}
            style={{ marginBottom: 100 }}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold">Upload Post</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
}