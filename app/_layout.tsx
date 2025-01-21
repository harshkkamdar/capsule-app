import { Stack } from "expo-router"
import { AuthProvider, useAuth } from "./context/AuthContext"
import "./globals.css"

function RootLayoutNav() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="loading" options={{ headerShown: false }} />
      </Stack>
    )
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!user ? (
        <>
          <Stack.Screen
            name="sign-in"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="sign-up"
            options={{
              headerShown: false,
            }}
          />
        </>
      ) : (
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
            headerBackVisible: false,
            gestureEnabled: false,
          }}
        />
      )}
    </Stack>
  )
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  )
}

