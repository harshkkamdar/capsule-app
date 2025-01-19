import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Link, router } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './lib/firebase';
import { AuthInput } from './components/auth/AuthInput';

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSignIn = async () => {
        try {
            setLoading(true);
            setError('');
            await signInWithEmailAndPassword(auth, email, password);
            router.replace('/(root)/(tabs)');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };


    return (
        <View className="flex-1 bg-white p-6">
            <View className="mt-20 mb-10">
                <Text className="font-['Inter'] text-3xl font-bold mb-2">Welcome back</Text>
                <Text className="font-['DM Sans'] text-gray-600">Sign in to continue</Text>
            </View>

            <AuthInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
            />

            <AuthInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry
            />

            {error && (
                <Text className="text-red-500 mb-4">{error}</Text>
            )}

            <TouchableOpacity
                onPress={handleSignIn}
                disabled={loading}
                className="bg-black py-4 rounded-lg items-center"
            >
                {loading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text className="text-white font-['DM Sans'] font-medium">Sign In</Text>
                )}
            </TouchableOpacity>

            <View className="flex-row justify-center mt-6">
                <Text className="font-['DM Sans'] text-gray-600">Don't have an account? </Text>
                <Link href="/sign-up" className="font-['DM Sans'] text-black font-medium">
                    Sign Up
                </Link>
            </View>
        </View>
    );
}