import { Tabs } from "expo-router";
import { TouchableOpacity, Text } from "react-native";
import { auth } from "../lib/firebase";
import { useRouter } from "expo-router";

export default function TabsLayout() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      router.replace("/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <Tabs
      screenOptions={{
        headerRight: () => (
          <TouchableOpacity onPress={handleSignOut} className="mr-4">
            <Text className="text-red-500">Sign Out</Text>
          </TouchableOpacity>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />
    </Tabs>
  );
} 