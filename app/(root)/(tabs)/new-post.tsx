import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { MediaPicker, MediaItem } from '../../components/upload/MediaPicker';
import { TagInput } from '../../components/upload/TagInput';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { doc, setDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from '../../lib/firebase';

interface UploadPost {
  media: MediaItem[];
  location?: string;
  people?: string[];
  datetime: Date;
  tags: string[];
  description: string;
}

export default function Explore() {
  const [post, setPost] = useState<UploadPost>({
    media: [],
    datetime: new Date(),
    tags: [],
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

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
    <ScrollView className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold mb-6">Create New Post</Text>
      
      <MediaPicker
        onMediaSelect={(media) => setPost(prev => ({ ...prev, media }))}
      />

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
          value={post.datetime}
          mode="datetime"
          onChange={(event, date) => {
            setShowDatePicker(false);
            if (date) setPost(prev => ({ ...prev, datetime: date }));
          }}
        />
      )}

      <TextInput
        placeholder="Add location..."
        value={post.location}
        onChangeText={(text) => setPost(prev => ({ ...prev, location: text }))}
        className="p-3 border border-gray-200 rounded-lg mb-4"
      />

      <TagInput
        onTagsChange={(tags) => setPost(prev => ({ ...prev, tags }))}
      />

      <TouchableOpacity
        onPress={handleUpload}
        disabled={loading}
        className={`p-4 rounded-lg items-center ${loading ? 'bg-gray-400' : 'bg-blue-500'}`}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-bold">Upload Post</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}