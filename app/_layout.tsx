import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "SNSU Library" }} />
      <Stack.Screen name="admin/index" options={{ title: "Admin Dashboard" }} />
      <Stack.Screen name="admin/user/index" options={{ title: "User Dashboard" }} />
    </Stack>
  );
}
