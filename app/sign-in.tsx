
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from './lib/firebase';
import { useGlobalContext } from "./lib/global-provider";
import { Link, router } from "expo-router";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { AuthInput } from "./components/auth/AuthInput";

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { refetch, loading: globalLoading, isLogged } = useGlobalContext();

    const handleSignIn = async () => {
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        try {
            setLoading(true);
            setError('');
            await signInWithEmailAndPassword(auth, email, password);
            await refetch();
            router.replace('/(root)/(tabs)');
        } catch (err: any) {
            let errorMessage = 'An error occurred during sign in';
            if (err.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address';
            } else if (err.code === 'auth/wrong-password') {
                errorMessage = 'Incorrect password';
            } else if (err.code === 'auth/user-not-found') {
                errorMessage = 'User not found';
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (!globalLoading && isLogged) {
        router.replace('/(root)/(tabs)');
        return null;
    }

    return (
        <SafeAreaView className="bg-white h-full">
            <ScrollView contentContainerStyle={{ height: "100%" }}>
                <Image
                    source={images.onboarding}
                    className="w-full h-4/6"
                    resizeMode="contain"
                />

                <View className="px-10">
                    <Text className="text-base text-center uppercase font-rubik text-black-200">
                        Welcome Back
                    </Text>

                    <Text className="text-3xl font-rubik-bold text-black-300 text-center mt-2">
                        Sign in to continue
                    </Text>

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
            </ScrollView>
        </SafeAreaView>
    );
};

export default SignIn;