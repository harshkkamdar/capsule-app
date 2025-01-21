import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';

interface UserTagInputProps {
  onTagsChange: (tags: string[]) => void;
  initialTags?: string[];
}

// Base predefined tags that are available to all users
const basePredefinedTags = [
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

export const UserTagInput = ({ onTagsChange, initialTags = [] }: UserTagInputProps) => {
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags);
  const [newTag, setNewTag] = useState('');
  const [userTags, setUserTags] = useState<string[]>([]);
  const predefinedTags = [...basePredefinedTags, ...userTags];

  useEffect(() => {
    fetchUserTags();
  }, []);

  const fetchUserTags = async () => {
    if (!auth.currentUser?.uid) return;
    
    try {
      const userTagsDoc = await getDoc(doc(db, 'userTags', auth.currentUser.uid));
      if (userTagsDoc.exists()) {
        setUserTags(userTagsDoc.data().tags || []);
      }
    } catch (error) {
      console.error('Error fetching user tags:', error);
    }
  };

  const saveUserTag = async (newTag: string) => {
    if (!auth.currentUser?.uid) return;
    
    try {
      const userTagsRef = doc(db, 'userTags', auth.currentUser.uid);
      const updatedTags = [...userTags, newTag];
      await setDoc(userTagsRef, { tags: updatedTags }, { merge: true });
      setUserTags(updatedTags);
    } catch (error) {
      console.error('Error saving user tag:', error);
    }
  };

  const toggleTag = (tag: string) => {
    const newSelectedTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newSelectedTags);
    onTagsChange(newSelectedTags);
  };

  const addNewTag = async () => {
    if (newTag.trim() && !predefinedTags.includes(newTag.trim())) {
      const tagToAdd = newTag.trim();
      await saveUserTag(tagToAdd);
      
      const updatedTags = [...selectedTags, tagToAdd];
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
            className={`p-2 border rounded-lg mr-2 ${
              selectedTags.includes(tag) ? 'bg-blue-500' : 'bg-gray-200'
            }`}
          >
            <Text className={`${selectedTags.includes(tag) ? 'text-white' : 'text-black'}`}>
              {tag}
            </Text>
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
        <TouchableOpacity 
          onPress={addNewTag} 
          className="ml-2 p-2 bg-blue-500 rounded-lg"
        >
          <Text className="text-white">Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}; 