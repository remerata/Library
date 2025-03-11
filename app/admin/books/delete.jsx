import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function DeleteBook() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // Get book ID from URL
  const [book, setBook] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const storedBooks = await AsyncStorage.getItem("books");
        const books = storedBooks ? JSON.parse(storedBooks) : [];
        const foundBook = books.find((b) => b.id === id);
        if (foundBook) {
          setBook(foundBook);
        } else {
          Alert.alert("Error", "Book not found.");
          router.back();
        }
      } catch (error) {
        console.error("Error fetching book:", error);
      }
    };

    if (id) fetchBook();
  }, [id]);

  const handleDelete = async () => {
    try {
      const storedBooks = await AsyncStorage.getItem("books");
      const books = storedBooks ? JSON.parse(storedBooks) : [];
      const updatedBooks = books.filter((b) => b.id !== id);
      await AsyncStorage.setItem("books", JSON.stringify(updatedBooks));

      Alert.alert("Deleted", "Book removed successfully!", [
        { text: "OK", onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error("Error deleting book:", error);
      Alert.alert("Error", "Failed to delete book.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🗑 Delete Book</Text>
      {book && (
        <>
          <Text style={styles.bookTitle}>{book.title}</Text>
          <Text style={styles.bookDetails}>Author: {book.author}</Text>
          <Text style={styles.bookDetails}>ISBN: {book.isbn}</Text>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>Confirm Delete</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F5F7FA", justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  bookTitle: { fontSize: 18, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  bookDetails: { fontSize: 14, color: "#555", textAlign: "center" },
  deleteButton: { backgroundColor: "#d9534f", paddingVertical: 12, borderRadius: 8, alignItems: "center", marginTop: 15 },
  deleteButtonText: { color: "#FFF", fontSize: 16, fontWeight: "600" },
});
