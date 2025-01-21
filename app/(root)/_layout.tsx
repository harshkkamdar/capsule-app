import { Tabs } from "expo-router"
import { TouchableOpacity, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import Header from "../components/shared/Header"
import { usePathname } from "expo-router"

export default function TabsLayout() {
  const pathname = usePathname()
  const hideTabBar = pathname.includes("/properties/")

  return (
    <View className="flex-1">
      <Header />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            display: hideTabBar ? "none" : "flex",
            backgroundColor: "#ffffff",
            borderTopColor: "#F1F5F9",
            height: 60,
            paddingBottom: 8,
            elevation: 5, // Add shadow for Android
            shadowColor: "#000", // Add shadow for iOS
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          },
          tabBarShowLabel: false,
        }}
      >
        <Tabs.Screen
          name="posts"
          options={{
            tabBarIcon: ({ focused }) => (
              <Ionicons name={focused ? "time" : "time-outline"} size={24} color={focused ? "#2A9D8F" : "#64748B"} />
            ),
          }}
        />
        <Tabs.Screen
          name="new-post"
          options={{
            tabBarIcon: ({ focused }) => (
              <View className="bg-[#2A9D8F] rounded-full p-3 -mt-6">
                <Ionicons name="add" size={24} color="white" />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={24}
                color={focused ? "#2A9D8F" : "#64748B"}
              />
            ),
          }}
        />
      </Tabs>
    </View>
  )
}

