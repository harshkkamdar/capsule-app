import { View, TextInput, TouchableOpacity, Text, ScrollView, Animated } from "react-native"
import React, { useState, useRef } from "react"
import { Ionicons } from "@expo/vector-icons"
import DateTimePicker from "@react-native-community/datetimepicker"

interface SearchBarProps {
  onSearch: (searchParams: SearchParams) => void
}

export interface SearchParams {
  text: string
  date?: Date
  tags: string[]
  location?: string
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [searchText, setSearchText] = useState("")
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [location, setLocation] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [activeTags, setActiveTags] = useState<string[]>([])
  
  const filterHeight = useRef(new Animated.Value(0)).current

  const commonTags = [
    "Family", "Friends", "Travel", "Food", "Nature", "Work", 
    "Celebration", "Adventure", "Milestones"
  ]

  const toggleFilters = () => {
    setShowFilters(!showFilters)
    Animated.spring(filterHeight, {
      toValue: !showFilters ? 1 : 0,
      useNativeDriver: false,
    }).start()
  }

  const handleSearch = () => {
    onSearch({
      text: searchText,
      date: selectedDate,
      location: location,
      tags: [...activeTags, ...searchText
        .split(" ")
        .filter((word) => word.startsWith("#"))
        .map((tag) => tag.substring(1))],
    })
  }

  const toggleTag = (tag: string) => {
    setActiveTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  return (
    <View className="bg-accent-100 shadow-sm">
      {/* Main Search Bar */}
      <View className="px-4 py-3">
        <View className="flex-row items-center space-x-3">
          <View className="flex-1 flex-row items-center bg-white rounded-xl px-4 py-2.5 border border-primary-100">
            <Ionicons name="search" size={20} color="#8C8E98" />
            <TextInput
              className="flex-1 ml-2 text-base font-rubik text-black-300"
              placeholder="Search memories..."
              value={searchText}
              onChangeText={setSearchText}
              onSubmitEditing={handleSearch}
              placeholderTextColor="#8C8E98"
            />
            {searchText !== "" && (
              <TouchableOpacity 
                onPress={() => {
                  setSearchText("")
                  handleSearch()
                }}
              >
                <Ionicons name="close-circle" size={20} color="#8C8E98" />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity 
            onPress={toggleFilters}
            className={`p-2 rounded-xl ${showFilters ? 'bg-primary-100' : ''}`}
          >
            <Ionicons 
              name={showFilters ? "options" : "options-outline"} 
              size={22} 
              color="#0061FF" 
            />
          </TouchableOpacity>
        </View>

        {/* Active Filters */}
        {(selectedDate || location || activeTags.length > 0) && (
          <View className="flex-row flex-wrap mt-3 gap-2">
            {selectedDate && (
              <View className="flex-row items-center bg-primary-100 px-3 py-1.5 rounded-xl">
                <Ionicons name="calendar" size={14} color="#0061FF" />
                <Text className="ml-1 text-sm text-primary-300 font-rubik-medium">
                  {selectedDate.toLocaleDateString()}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedDate(undefined)
                    handleSearch()
                  }}
                  className="ml-1"
                >
                  <Ionicons name="close-circle" size={14} color="#0061FF" />
                </TouchableOpacity>
              </View>
            )}
            {location && (
              <View className="flex-row items-center bg-primary-100 px-3 py-1.5 rounded-xl">
                <Ionicons name="location" size={14} color="#0061FF" />
                <Text className="ml-1 text-sm text-primary-300 font-rubik-medium">
                  {location}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setLocation("")
                    handleSearch()
                  }}
                  className="ml-1"
                >
                  <Ionicons name="close-circle" size={14} color="#0061FF" />
                </TouchableOpacity>
              </View>
            )}
            {activeTags.map(tag => (
              <View key={tag} className="flex-row items-center bg-primary-100 px-3 py-1.5 rounded-xl">
                <Text className="text-sm text-primary-300 font-rubik-medium">
                  #{tag}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    toggleTag(tag)
                    handleSearch()
                  }}
                  className="ml-1"
                >
                  <Ionicons name="close-circle" size={14} color="#0061FF" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Expandable Filters */}
      <Animated.View 
        style={{
          maxHeight: filterHeight.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 300]
          }),
          opacity: filterHeight,
        }}
        className="overflow-hidden"
      >
        <View className="px-4 pb-4 border-t border-gray-100">
          {/* Location Input */}
          <View className="mt-4 flex-row items-center bg-gray-50 rounded-full px-4 py-2.5 border border-gray-100">
            <Ionicons name="location-outline" size={20} color="#94A3B8" />
            <TextInput
              className="flex-1 ml-2 text-base font-rubik text-black-300"
              placeholder="Add location..."
              value={location}
              onChangeText={setLocation}
              onSubmitEditing={handleSearch}
              placeholderTextColor="#94A3B8"
            />
          </View>

          {/* Date Picker Button */}
          <TouchableOpacity 
            onPress={() => setShowDatePicker(true)}
            className="mt-3 flex-row items-center bg-gray-50 rounded-full px-4 py-2.5 border border-gray-100"
          >
            <Ionicons name="calendar-outline" size={20} color="#94A3B8" />
            <Text className="ml-2 text-base font-rubik text-gray-500">
              {selectedDate ? selectedDate.toLocaleDateString() : "Select date..."}
            </Text>
          </TouchableOpacity>

          {/* Tags */}
          <Text className="mt-4 mb-2 text-sm font-rubik-bold text-gray-600 px-1">
            Popular Tags
          </Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            className="mx-[-16px] px-4"
          >
            <View className="flex-row">
              {commonTags.map((tag) => (
                <TouchableOpacity
                  key={tag}
                  onPress={() => {
                    toggleTag(tag)
                    handleSearch()
                  }}
                  className={`mr-2 px-4 py-2 rounded-full border ${
                    activeTags.includes(tag)
                      ? "bg-primary-100 border-primary-100"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <Text
                    className={`text-sm font-rubik ${
                      activeTags.includes(tag) ? "text-white" : "text-black-300"
                    }`}
                  >
                    #{tag}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </Animated.View>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode="date"
          onChange={(event, date) => {
            setShowDatePicker(false)
            if (date) {
              setSelectedDate(date)
              handleSearch()
            }
          }}
        />
      )}
    </View>
  )
}
