import { Stack } from "expo-router";
import { AuthProvider, useAuth } from "./context/AuthContext";
import "./globals.css";

function RootLayoutNav() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="loading" options={{ headerShown: false }} />
    </Stack>;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!user ? (
        <>
          <Stack.Screen name="sign-in" />
          <Stack.Screen name="sign-up" />
        </>
      ) : (
        <Stack.Screen 
          name="(root)" 
          options={{ 
            headerShown: true,
            headerTitle: "Capsule",
            headerLeft: () => null,
            headerBackVisible: false,
            gestureEnabled: false,
          }} 
        />
      )}
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
