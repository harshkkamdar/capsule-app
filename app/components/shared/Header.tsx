import { View, Text, TouchableOpacity } from "react-native"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { usePathname } from "expo-router"

type HeaderVariant = "memories" | "detail" | "none" | "new-post" | "profile"

interface HeaderProps {
  variant?: HeaderVariant
}

export default function Header({ variant = "memories" }: HeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const isPostDetail = pathname.includes("/properties/")

  if (variant === "none") {
    return null
  }

  if (variant === "new-post") {
    return (
      <View className="flex-row items-center justify-between px-4 h-16 bg-white border-b border-gray-100">
        <Text className="font-['DM-Sans-Bold'] text-xl text-[#264653]">Create a New Post</Text>
        <View className="flex-row items-center gap-4">
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={24} color="#264653" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="settings-outline" size={24} color="#264653" />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  if (variant === "profile") {
    return (
      <View className="flex-row items-center justify-between px-4 h-16 bg-white border-b border-gray-100">
        <Text className="font-['DM-Sans-Bold'] text-xl text-[#264653]">Profile</Text>
        <View className="flex-row items-center gap-4">
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={24} color="#264653" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="settings-outline" size={24} color="#264653" />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  if (isPostDetail) {
    return (
      <View className="flex-row items-center justify-between px-4 h-16 bg-white border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
          <Ionicons name="chevron-back" size={24} color="#264653" />
        </TouchableOpacity>
        <Text className="font-['DM-Sans-Bold'] text-lg text-[#264653]">March 15, 2024</Text>
        <View className="w-8" /> {/* Spacer for alignment */}
      </View>
    )
  }

  return (
    <View className="flex-row items-center justify-between px-4 h-16 bg-white border-b border-gray-100">
      <Text className="font-['DM-Sans-Bold'] text-xl text-[#264653]">Your Memories</Text>
      <View className="flex-row items-center gap-4">
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color="#264653" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={24} color="#264653" />
        </TouchableOpacity>
      </View>
    </View>
  )
}
