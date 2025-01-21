import { View, Text, TouchableOpacity } from "react-native"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { usePathname } from "expo-router"

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const isPostDetail = pathname.includes("/properties/")

  return (
    <View className="flex-row items-center justify-between px-4 h-16 bg-white border-b border-gray-100">
      {isPostDetail ? (
        <>
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
            <Ionicons name="chevron-back" size={24} color="#264653" />
          </TouchableOpacity>
          <Text className="font-['DM-Sans-Bold'] text-lg text-[#264653]">March 15, 2024</Text>
          <View className="w-8" /> {/* Spacer for alignment */}
        </>
      ) : (
        <>
          <Text className="font-['DM-Sans-Bold'] text-xl text-[#264653]">Capsule</Text>
          <View className="flex-row items-center gap-4">
            <TouchableOpacity>
              <Ionicons name="notifications-outline" size={24} color="#264653" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="settings-outline" size={24} color="#264653" />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  )
}

