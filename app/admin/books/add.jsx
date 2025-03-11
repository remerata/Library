import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from "uuid";
import FlashMessage, { showMessage } from "react-native-flash-message";
import 'react-native-get-random-values'; // Fix for UUID issue


export default function AddBook() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");

  const handleAddBook = async () => {
    if (!title || !author || !isbn) {
      Alert.alert("Error", "All fields are required!");
      return;
    }
    
    try {
      const newBook = { id: uuidv4(), title, author, isbn };
      const storedBooks = await AsyncStorage.getItem("books");
      const books = storedBooks ? JSON.parse(storedBooks) : [];
      
      books.unshift(newBook); // Add book at the top for instant UI update
      await AsyncStorage.setItem("books", JSON.stringify(books));

      // Show success message
      showMessage({
        message: "Book added successfully!",
        type: "success",
        icon: "success",
      });

      // Navigate back after a short delay
      setTimeout(() => router.back(), 1500);
    } catch (error) {
      console.error("Error adding book:", error);
      Alert.alert("Error", "Failed to add book.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Flash Message Component */}
      <FlashMessage position="top" />

      <Text style={styles.title}>➕ Add New Book</Text>
      <TextInput 
        placeholder="Title" 
        value={title} 
        onChangeText={setTitle} 
        style={styles.input} 
      />
      <TextInput 
        placeholder="Author" 
        value={author} 
        onChangeText={setAuthor} 
        style={styles.input} 
      />
      <TextInput 
        placeholder="ISBN" 
        value={isbn} 
        onChangeText={setIsbn} 
        style={styles.input} 
      />
      <TouchableOpacity style={styles.button} onPress={handleAddBook}>
        <Text style={styles.buttonText}>Add Book</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F7FA",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginVertical: 8,
    borderRadius: 5,
    borderColor: "#CCC",
    backgroundColor: "#FFF",
  },
  button: {
    backgroundColor: "#008123",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
