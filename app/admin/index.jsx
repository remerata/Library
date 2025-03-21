import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Logo at the top */}
      <Image source={require("../../image/logo.png")} style={styles.logo} />
      <Text style={styles.title}>Admin Dashboard</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push("/admin/books")}>
        <Text style={styles.buttonText}>Manage Books</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push("/admin/borrow")}>
        <Text style={styles.buttonText}>Manage Borrows</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
    padding: 20,
  },
  logo: {
    width: 120, // Adjust width as needed
    height: 120, // Adjust height as needed
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#008123",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
