import { View, TextInput, TouchableOpacity, Text, Modal } from 'react-native';
import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { PeoplePicker } from '../upload/PeoplePicker';
import { TagInput } from '../upload/TagInput';
import DateTimePicker from '@react-native-community/datetimepicker';
import { PredefinedTagInput } from '../upload/PredefinedTagInput';

interface Post {
  id: string;
  description: string;
  location?: string;
  people?: string[];
  tags?: string[];
  datetime: Date;
}

interface EditPostProps {
  post: Post;
  visible: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export const EditPost = ({ post, visible, onClose, onUpdate }: EditPostProps) => {
  const [editedPost, setEditedPost] = useState({
    description: post.description,
    location: post.location || '',
    people: post.people || [],
    tags: post.tags || [],
    datetime: post.datetime
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleUpdate = async () => {
    try {
      const postRef = doc(db, 'posts', post.id);
      await updateDoc(postRef, editedPost);
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl p-6">
          <Text className="text-xl font-bold mb-4">Edit Post</Text>
          
          <TextInput
            value={editedPost.description}
            onChangeText={(text) => setEditedPost(prev => ({ ...prev, description: text }))}
            className="p-3 border border-gray-200 rounded-lg mb-4"
            multiline
            placeholder="Description"
          />

          <TextInput
            value={editedPost.location}
            onChangeText={(text) => setEditedPost(prev => ({ ...prev, location: text }))}
            className="p-3 border border-gray-200 rounded-lg mb-4"
            placeholder="Location"
          />

          <PeoplePicker
            selectedPeople={editedPost.people}
            onPeopleSelect={(people) => setEditedPost(prev => ({ ...prev, people }))}
          />

          <PredefinedTagInput
            onTagsChange={(tags) => setEditedPost(prev => ({ ...prev, tags }))}
            initialTags={editedPost.tags}
          />

          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            className="p-3 border border-gray-200 rounded-lg mb-4"
          >
            <Text>{editedPost.datetime.toLocaleDateString()}</Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={editedPost.datetime}
              mode="date"
              onChange={(event, date) => {
                setShowDatePicker(false);
                if (date) {
                  setEditedPost(prev => ({ ...prev, datetime: date }));
                }
              }}
            />
          )}

          <View className="flex-row justify-end gap-4 mt-4">
            <TouchableOpacity onPress={onClose}>
              <Text className="text-gray-500">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleUpdate}>
              <Text className="text-blue-500 font-bold">Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}; 