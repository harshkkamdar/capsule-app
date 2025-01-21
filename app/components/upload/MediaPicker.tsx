import { View, TouchableOpacity, Image, Text, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

interface MediaPickerProps {
  onMediaSelect: (media: MediaItem[]) => void;
}

export interface MediaItem {
  uri: string;
  type: 'image' | 'video';
  fileName?: string;
}

export const MediaPicker = ({ onMediaSelect }: MediaPickerProps) => {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem[]>([]);

  const pickMedia = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      quality: 1,
    });
    if (!result.canceled) {
      const newMedia: MediaItem[] = result.assets.map(asset => ({
        uri: asset.uri,
        type: asset.type === 'video' ? 'video' : 'image' as const,
        fileName: asset.fileName ?? undefined
      }));
      
      setSelectedMedia(newMedia);
      onMediaSelect(newMedia);
    }
  };

  return (
    <View className="mb-4">
      <TouchableOpacity 
        onPress={pickMedia}
        className="bg-gray-100 p-4 rounded-lg items-center justify-center border-2 border-dashed border-gray-300"
      >
        <Ionicons name="cloud-upload-outline" size={32} color="gray" />
        <Text className="text-gray-600 mt-2">Select Photos or Videos</Text>
      </TouchableOpacity>

      {/* {selectedMedia.length > 0 && (
        <ScrollView horizontal className="mt-4" showsHorizontalScrollIndicator={false}>
          {selectedMedia.map((media, index) => (
            <View key={index} className="mr-2">
              <Image 
                source={{ uri: media.uri }} 
                className="w-20 h-20 rounded-lg"
              />
              {media.type === 'video' && (
                <View className="absolute top-1 right-1">
                  <Ionicons name="videocam" size={16} color="white" />
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      )} */}
    </View>
  );
}; 