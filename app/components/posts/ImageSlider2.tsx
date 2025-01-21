import { View, Image, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import React, { useState, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';

interface ImageSliderProps {
  images: { url: string; type: 'image' | 'video' }[];
  height?: number;
}

const ImageSlider = ({ images, height = 300 }: ImageSliderProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const screenWidth = Dimensions.get('window').width;
  const videoRef = useRef<Video | null>(null);

  const handleScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundedIndex = Math.round(index);
    
    if (roundedIndex !== activeIndex) {
      setActiveIndex(roundedIndex);
      setIsPlaying(false);
      videoRef.current?.pauseAsync();
    }
  };

  const togglePlayPause = async () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      await videoRef.current.pauseAsync();
    } else {
      await videoRef.current.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  const renderMedia = (media: { url: string; type: 'image' | 'video' }, index: number) => {
    if (media.type === 'video') {
      return (
        <View key={index} style={{ width: screenWidth, height }}>
          <Video
            ref={index === activeIndex ? videoRef : null}
            source={{ uri: media.url }}
            style={{ width: '100%', height: '100%' }}
            resizeMode={ResizeMode.COVER}
            isLooping
            shouldPlay={false}
          />
          <TouchableOpacity
            onPress={togglePlayPause}
            className="absolute inset-0 items-center justify-center bg-black/20"
          >
            <Ionicons
              name={isPlaying ? "pause-circle" : "play-circle"}
              size={50}
              color="white"
            />
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <Image
        key={index}
        source={{ uri: media.url }}
        style={{
          width: screenWidth,
          height,
          resizeMode: 'cover'
        }}
      />
    );
  };

  return (
    <View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {images.map((media, index) => renderMedia(media, index))}
      </ScrollView>
      
      {images.length > 1 && (
        <View className="flex-row justify-center absolute bottom-2 w-full">
          {images.map((media, index) => (
            <View
              key={index}
              className={`h-2 w-2 rounded-full mx-1 flex-row items-center ${
                index === activeIndex ? 'bg-white' : 'bg-gray-400'
              }`}
            >
              {media.type === 'video' && (
                <Ionicons
                  name="videocam"
                  size={8}
                  color="white"
                  style={{ position: 'absolute', right: -8 }}
                />
              )}
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default ImageSlider; 