import React, { useEffect, useState } from "react";
import { View, Text, Button, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useLocalSearchParams } from "expo-router";

const DeleteBook = () => {
  const { id } = useLocalSearchParams();
  const [book, setBook] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const loadBook = async () => {
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
        console.error("Error loading book:", error);
      }
    };

    if (id) loadBook();
  }, [id]);

  const handleDelete = async () => {
    if (!book) {
      Alert.alert("Error", "No book selected.");
      return;
    }

    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to delete "${book.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes, Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const storedBooks = await AsyncStorage.getItem("books");
              let books = storedBooks ? JSON.parse(storedBooks) : [];

              // Remove book with matching ID
              books = books.filter((b) => b.id !== id);

              await AsyncStorage.setItem("books", JSON.stringify(books));

              Alert.alert("Deleted", "Book removed successfully!", [
                { text: "OK", onPress: () => router.back() },
              ]);
            } catch (error) {
              console.error("Error deleting book:", error);
              Alert.alert("Error", "Failed to delete book.");
            }
          },
        },
      ]
    );
  };

  return (
    <View>
      {book ? (
        <>
          <Text>Are you sure you want to delete "{book.title}"?</Text>
          <Button title="Delete" color="red" onPress={handleDelete} />
          <Button title="Cancel" color="gray" onPress={() => router.back()} />
        </>
      ) : (
        <Text>Loading book details...</Text>
      )}
    </View>
  );
};

export default DeleteBook;
