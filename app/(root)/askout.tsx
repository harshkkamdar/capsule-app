import { View, Text, TouchableOpacity, BackHandler } from 'react-native';
import React, { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { Animated } from 'react-native';

const questions = [
  "Think again?",
  "Think really hard, are u sure?",
  "Ok, I am not moving till you say yes!"
];

export default function AskOut() {
  const [noCount, setNoCount] = useState(0);
  const [accepted, setAccepted] = useState(false);
  const fadeAnim = new Animated.Value(1);

  useEffect(() => {
    // Handle back button
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      return true; // Prevent going back
    });

    return () => backHandler.remove();
  }, []);

  const handleNo = () => {
    if (noCount < questions.length) {
      setNoCount(prev => prev + 1);
    }
  };

  const handleYes = () => {
    setAccepted(true);
  };

  return (
    <View className="flex-1 bg-white justify-center items-center px-6">
      <Animated.View 
        className="items-center"
        style={{ opacity: fadeAnim }}
      >
        {!accepted ? (
          <>
            <Text className="text-3xl font-rubik-bold text-center mb-4">
              Shruti,
            </Text>
            <Text className="text-2xl font-rubik-medium text-center mb-12">
              Will you be my girlfriend?
            </Text>
            <View className="flex-row gap-6">
              <TouchableOpacity
                onPress={handleYes}
                className="bg-primary-300 px-12 py-4 rounded-xl"
              >
                <Text className="text-white font-rubik-medium text-lg">
                  Yes
                </Text>
              </TouchableOpacity>
              
              {noCount < questions.length && (
                <TouchableOpacity
                  onPress={handleNo}
                  className="bg-danger px-12 py-4 rounded-xl"
                >
                  <Text className="text-white font-rubik-medium text-lg">
                    No
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            {noCount > 0 && (
              <Text className="text-xl font-rubik-medium text-center mt-8 text-black-300">
                {questions[noCount - 1]}
              </Text>
            )}
          </>
        ) : (
          <View className="items-center">
            <Text className="text-3xl font-rubik-bold text-center text-primary-300">
              She said yes!!
            </Text>
            <Text className="text-4xl font-rubik-bold mt-4">
              Woohooo! 🎉
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/")}
              className="bg-primary-300 px-12 py-4 rounded-xl mt-8"
            >
              <Text className="text-white font-rubik-medium text-lg">
                Go back to app
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    </View>
  );
} 