import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { auth } from '../../lib/firebase';
import { router } from 'expo-router';

const Profile = () => {
  const handleSignOut = async () => {
    try {
      await auth.signOut();
      router.replace('/sign-in');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <View className="flex-1 p-4">
      <Text className="text-lg font-bold">{auth.currentUser?.email}</Text>
      <TouchableOpacity
        onPress={handleSignOut}
        className="bg-red-500 p-4 rounded-lg mt-4"
      >
        <Text className="text-white text-center">Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

export default Profile;