import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import React, { useState } from 'react';

interface PredefinedTagInputProps {
  onTagsChange: (tags: string[]) => void;
  initialTags?: string[];
}

const predefinedTags = [
  'Travel',
  'Food',
  'Family',
  'Friends',
  'Work',
  'Events',
  'Hobbies',
  'Fitness',
  'Nature',
  'Celebration',
];

export const PredefinedTagInput = ({ onTagsChange, initialTags = [] }: PredefinedTagInputProps) => {
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags);
  const [newTag, setNewTag] = useState('');

  const toggleTag = (tag: string) => {
    const newSelectedTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newSelectedTags);
    onTagsChange(newSelectedTags);
  };

  const addNewTag = () => {
    if (newTag.trim() && !selectedTags.includes(newTag.trim())) {
      const updatedTags = [...selectedTags, newTag.trim()];
      setSelectedTags(updatedTags);
      onTagsChange(updatedTags);
      setNewTag('');
    }
  };

  return (
    <View className="mb-4">
      <Text className="text-gray-700 mb-2">Select or Add Tags:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {predefinedTags.map(tag => (
          <TouchableOpacity
            key={tag}
            onPress={() => toggleTag(tag)}
            className={`p-2 border rounded-lg mr-2 ${selectedTags.includes(tag) ? 'bg-blue-500' : 'bg-gray-200'}`}
          >
            <Text className={`${selectedTags.includes(tag) ? 'text-white' : 'text-black'}`}>{tag}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View className="flex-row items-center mt-2">
        <TextInput
          value={newTag}
          onChangeText={setNewTag}
          placeholder="Add new tag..."
          className="flex-1 p-2 border border-gray-200 rounded-lg"
        />
        <TouchableOpacity onPress={addNewTag} className="ml-2 p-2 bg-blue-500 rounded-lg">
          <Text className="text-white">Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}; 