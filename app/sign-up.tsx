import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { Link, router } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, updateUserProfile } from './lib/firebase';
import { AuthInput } from './components/auth/AuthInput';
import { Ionicons } from "@expo/vector-icons";

export default function SignUp() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the user profile with display name
      await updateUserProfile(displayName);
      
      // Create user profile in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        displayName,
        email,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp()
      });

      router.replace('/(root)/(tabs)');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-accent-100 p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <View className="mb-10">
          <Text className="font-['Inter'] text-3xl font-bold mb-2 text-center">Create Account</Text>
          <Text className="font-['DM Sans'] text-gray-600 text-center">Start sharing memories</Text>
        </View>

        <AuthInput
          label="Display Name"
          value={displayName}
          onChangeText={setDisplayName}
          placeholder="Enter your name"
        />

        <AuthInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
        />

        <View className="relative">
          <AuthInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Create a password"
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-4"
          >
            <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color="gray" />
          </TouchableOpacity>
        </View>

        {error && (
          <Text className="text-danger mb-4 text-center">{error}</Text>
        )}

        <TouchableOpacity
          onPress={handleSignUp}
          disabled={loading}
          className="bg-primary-300 py-4 rounded-lg items-center"
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-['DM Sans'] font-medium">Create Account</Text>
          )}
        </TouchableOpacity>

        <View className="flex-row justify-center mt-6">
          <Text className="font-['DM Sans'] text-gray-600">Already have an account? </Text>
          <Link href="/sign-in" className="font-['DM Sans'] text-black font-medium">
            Sign In
          </Link>
        </View>
      </ScrollView>
    </View>
  );
} 