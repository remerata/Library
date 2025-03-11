import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function DeleteBorrow() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const handleDelete = async () => {
    try {
      const storedBorrows = await AsyncStorage.getItem("borrowedBooks");
      let borrowedBooks = storedBorrows ? JSON.parse(storedBorrows) : [];

      borrowedBooks = borrowedBooks.filter((b) => b.id !== id);
      await AsyncStorage.setItem("borrowedBooks", JSON.stringify(borrowedBooks));

      Alert.alert("Deleted", "Borrow record has been deleted.");
      router.back();
    } catch (error) {
      Alert.alert("Error", "Failed to delete record.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🗑 Delete Borrowed Book</Text>
      <Text>Are you sure you want to delete this record?</Text>
      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.buttonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F5F7FA", justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  deleteButton: { backgroundColor: "#dc3545", paddingVertical: 12, borderRadius: 8, alignItems: "center", marginTop: 15 },
  buttonText: { color: "#FFF", fontSize: 16, fontWeight: "600" },
});
