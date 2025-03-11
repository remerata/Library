import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import React from "react";

export default function BooksList() {
  const router = useRouter();
  const [books, setBooks] = useState([]);

  // Load books from AsyncStorage
  const loadBooks = async () => {
    try {
      const storedBooks = await AsyncStorage.getItem("books");
      setBooks(storedBooks ? JSON.parse(storedBooks) : []);
    } catch (error) {
      console.error("Error loading books:", error);
    }
  };

  // Reload books when the page is focused
  useFocusEffect(
    React.useCallback(() => {
      loadBooks();
    }, [])
  );

  // Handle delete book
  const deleteBook = async (id) => {
    Alert.alert(
      "Delete Book",
      "Are you sure you want to delete this book?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const updatedBooks = books.filter((book) => book.id !== id);
              await AsyncStorage.setItem("books", JSON.stringify(updatedBooks));
              setBooks(updatedBooks); // Update UI
            } catch (error) {
              console.error("Error deleting book:", error);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📚 Book List</Text>
      <FlatList
        data={books}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.bookItem}>
            <Text style={styles.bookTitle}>{item.title}</Text>
            <Text style={styles.bookDetails}>Author: {item.author}</Text>
            <Text style={styles.bookDetails}>ISBN: {item.isbn}</Text>

            {/* Edit Button */}
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => router.push({ pathname: "/admin/books/edit", params: { id: item.id } })}
            >
              <Text style={styles.editButtonText}>✏ Edit</Text>
            </TouchableOpacity>

            {/* Delete Button */}
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteBook(item.id)}
            >
              <Text style={styles.deleteButtonText}>🗑 Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Add Book Button */}
      <TouchableOpacity style={styles.addButton} onPress={() => router.push("/admin/books/add")}>
        <Text style={styles.addButtonText}>➕ Add Book</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F7FA",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  bookItem: {
    padding: 15,
    backgroundColor: "#FFF",
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  bookDetails: {
    fontSize: 14,
    color: "#555",
  },
  editButton: {
    marginTop: 10,
    backgroundColor: "#007bff",
    padding: 8,
    borderRadius: 5,
    alignItems: "center",
  },
  editButtonText: {
    color: "#FFF",
    fontWeight: "600",
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: "#d9534f",
    padding: 8,
    borderRadius: 5,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#FFF",
    fontWeight: "600",
  },
  addButton: {
    backgroundColor: "#008123",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
  },
  addButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

