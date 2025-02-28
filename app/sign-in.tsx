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
import { Ionicons } from "@expo/vector-icons";

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
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
        <SafeAreaView className="bg-accent-100 h-full">
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
                <View className="mb-10 px-6"> {/* Changed padding from px-10 to px-6 */}
                    <Text className="font-['Inter'] text-3xl font-bold mb-2 text-center">Welcome Back</Text>
                    <Text className="font-['DM Sans'] text-gray-600 text-center">Sign In</Text>

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
                            placeholder="Enter your password"
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
                        <Text className="text-danger mb-4">{error}</Text>
                    )}

                    <TouchableOpacity
                        onPress={handleSignIn}
                        disabled={loading}
                        className="bg-primary-300 py-4 rounded-lg items-center"
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