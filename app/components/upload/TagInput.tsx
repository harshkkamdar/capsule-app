import { View, TextInput, TouchableOpacity, Text, ScrollView } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

interface TagInputProps {
  onTagsChange: (tags: string[]) => void;
}

export const TagInput = ({ onTagsChange }: TagInputProps) => {
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      const newTags = [...tags, currentTag.trim()];
      setTags(newTags);
      onTagsChange(newTags);
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    setTags(newTags);
    onTagsChange(newTags);
  };

  return (
    <View className="mb-4">
      <View className="flex-row items-center">
        <TextInput
          value={currentTag}
          onChangeText={setCurrentTag}
          placeholder="Add tags..."
          className="flex-1 p-2 border border-gray-200 rounded-lg"
          onSubmitEditing={addTag}
        />
        <TouchableOpacity onPress={addTag} className="ml-2">
          <Ionicons name="add-circle-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
      
      {tags.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-2">
          {tags.map((tag, index) => (
            <View key={index} className="bg-gray-200 rounded-full px-3 py-1 mr-2 flex-row items-center">
              <Text>{tag}</Text>
              <TouchableOpacity onPress={() => removeTag(tag)} className="ml-1">
                <Ionicons name="close-circle" size={16} color="gray" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}; 