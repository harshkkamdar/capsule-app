import React from 'react';
import { TextInput, View, Text } from 'react-native';

interface AuthInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  error?: string;
}

export const AuthInput = ({ 
  label, 
  value, 
  onChangeText, 
  placeholder, 
  secureTextEntry,
  error 
}: AuthInputProps) => {
  return (
    <View className="mb-4">
      <Text className="text-gray-700 mb-2 font-['DM Sans']">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        className="w-full p-4 border border-gray-200 rounded-lg bg-white"
      />
      {error && (
        <Text className="text-red-500 text-sm mt-1">{error}</Text>
      )}
    </View>
  );
}; 