import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useState, useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function EditBook() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // Get book ID from URL
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");

  useEffect(() => {
    const loadBook = async () => {
      try {
        const storedBooks = await AsyncStorage.getItem("books");
        const books = storedBooks ? JSON.parse(storedBooks) : [];
        const book = books.find((b) => b.id === id);
        if (book) {
          setTitle(book.title);
          setAuthor(book.author);
          setIsbn(book.isbn);
        } else {
          Alert.alert("Error", "Book not found.");
          router.back();
        }
      } catch (error) {
        console.error("Error loading book:", error);
      }
    };

    if (id) loadBook();
  }, [id]);

  const handleSave = async () => {
    if (!title || !author || !isbn) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    try {
      const storedBooks = await AsyncStorage.getItem("books");
      const books = storedBooks ? JSON.parse(storedBooks) : [];

      // Update the book in the list
      const updatedBooks = books.map((book) =>
        book.id === id ? { ...book, title, author, isbn } : book
      );

      await AsyncStorage.setItem("books", JSON.stringify(updatedBooks));

      Alert.alert("Success", "Book updated successfully!", [
        { text: "OK", onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error("Error updating book:", error);
      Alert.alert("Error", "Failed to update book.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>✏ Edit Book</Text>
      <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={styles.input} />
      <TextInput placeholder="Author" value={author} onChangeText={setAuthor} style={styles.input} />
      <TextInput placeholder="ISBN" value={isbn} onChangeText={setIsbn} style={styles.input} />
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F5F7FA", justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, padding: 10, marginVertical: 8, borderRadius: 5, borderColor: "#CCC", backgroundColor: "#FFF" },
  button: { backgroundColor: "#007bff", paddingVertical: 12, borderRadius: 8, alignItems: "center", marginTop: 15 },
  buttonText: { color: "#FFF", fontSize: 16, fontWeight: "600" },
});
