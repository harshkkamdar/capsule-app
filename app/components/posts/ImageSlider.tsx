import { View, Image, Dimensions, ScrollView, TouchableOpacity, Animated } from "react-native"
import { Video, ResizeMode } from "expo-av"
import React, { useState, useRef } from "react"
import { Ionicons } from "@expo/vector-icons"

interface ImageSliderProps {
  images: { url: string; type: "image" | "video" }[]
  height?: number
}

const ImageSlider = ({ images, height = 300 }: ImageSliderProps) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const screenWidth = Dimensions.get("window").width
  const cardWidth = screenWidth * 0.42 // Match the card width from posts.tsx
  const videoRef = useRef<Video | null>(null)
  const fadeAnim = useRef(new Animated.Value(1)).current

  const handleScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width
    const index = event.nativeEvent.contentOffset.x / slideSize
    const roundedIndex = Math.round(index)

    if (roundedIndex !== activeIndex) {
      setActiveIndex(roundedIndex)
      setIsPlaying(false)
      videoRef.current?.pauseAsync()

      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.5,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }

  const togglePlayPause = async () => {
    if (!videoRef.current) return

    if (isPlaying) {
      await videoRef.current.pauseAsync()
    } else {
      await videoRef.current.playAsync()
    }
    setIsPlaying(!isPlaying)
  }

  const renderMedia = (media: { url: string; type: "image" | "video" }, index: number) => {
    if (media.type === "video") {
      return (
        <View key={index} style={{ width: cardWidth, height }}>
          <Video
            ref={index === activeIndex ? videoRef : null}
            source={{ uri: media.url }}
            style={{ width: "100%", height: "100%" }}
            resizeMode={ResizeMode.COVER}
            isLooping
            shouldPlay={false}
          />
          <TouchableOpacity
            onPress={togglePlayPause}
            className="absolute inset-0 items-center justify-center bg-black/10"
          >
            <Ionicons
              name={isPlaying ? "pause-circle" : "play-circle"}
              size={40}
              color="white"
              style={{ opacity: 0.8 }}
            />
          </TouchableOpacity>
        </View>
      )
    }

    return (
      <Image
        key={index}
        source={{ uri: media.url }}
        style={{
          width: cardWidth,
          height,
          resizeMode: "cover",
        }}
      />
    )
  }

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
        <Animated.View style={{ opacity: fadeAnim }} className="flex-row justify-center absolute bottom-2 w-full">
          {images.map((media, index) => (
            <View
              key={index}
              className={`h-1 rounded-full mx-0.5 flex-row items-center ${
                index === activeIndex ? "w-3 bg-white" : "w-1 bg-white/60"
              }`}
            >
              {media.type === "video" && index === activeIndex && (
                <Ionicons name="videocam" size={6} color="white" style={{ position: "absolute", right: -8 }} />
              )}
            </View>
          ))}
        </Animated.View>
      )}
    </View>
  )
}

export default ImageSlider

