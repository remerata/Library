import React, { useState, useEffect } from "react";
import { View, Alert, StyleSheet, Image, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { TextInput, Button, Text, Card } from "react-native-paper";
import moment from "moment";

const Borrow = () => {
  const { bookId } = useLocalSearchParams();
  const [selectedBook, setSelectedBook] = useState(null);
  const [borrowerName, setBorrowerName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [dueDate, setDueDate] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchBookDetails = async () => {
      const storedBooks = await AsyncStorage.getItem("books");
      const books = storedBooks ? JSON.parse(storedBooks) : [];
      const book = books.find((b) => b.id === bookId);

      if (!book) {
        Alert.alert("Error", "Book not found");
        router.back();
      } else {
        setSelectedBook(book);
      }
    };

    fetchBookDetails();
  }, [bookId]);

  const handleBorrow = async () => {
    if (!borrowerName || !contactNumber || !dueDate) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    if (!moment(dueDate, "YYYY-MM-DD", true).isValid() || moment(dueDate).isBefore(moment(), "day")) {
      Alert.alert("Error", "Enter a valid future date (YYYY-MM-DD).");
      return;
    }

    const storedBorrowed = await AsyncStorage.getItem("borrowedBooks");
    const borrowedBooks = storedBorrowed ? JSON.parse(storedBorrowed) : [];

    if (borrowedBooks.some((b) => b.id === selectedBook.id)) {
      Alert.alert("Error", "This book is already borrowed.");
      return;
    }

    borrowedBooks.push({
      id: selectedBook.id,
      title: selectedBook.title,
      author: selectedBook.author,
      borrowerName,
      contactNumber,
      dueDate,
    });

    await AsyncStorage.setItem("borrowedBooks", JSON.stringify(borrowedBooks));

    const storedBooks = await AsyncStorage.getItem("books");
    const books = storedBooks ? JSON.parse(storedBooks) : [];
    const updatedBooks = books.map((b) =>
      b.id === selectedBook.id ? { ...b, status: "Not Available" } : b
    );

    await AsyncStorage.setItem("books", JSON.stringify(updatedBooks));

    Alert.alert("Success", "Book borrowed successfully!");
    router.back();
  };

  if (!selectedBook) return null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          {selectedBook.image && (
            <Image source={{ uri: selectedBook.image }} style={styles.bookImage} />
          )}
          <Text style={styles.title}>{selectedBook.title}</Text>
          <Text style={styles.author}>by {selectedBook.author}</Text>
          <Text style={styles.genre}>Genre: {selectedBook.genre}</Text>
          <Text style={styles.isbn}>ISBN: {selectedBook.isbn}</Text>
        </Card.Content>
      </Card>

      <TextInput label="Your Name" value={borrowerName} onChangeText={setBorrowerName} style={styles.input} />
      <TextInput label="Contact Number" keyboardType="phone-pad" value={contactNumber} onChangeText={setContactNumber} style={styles.input} />
      <TextInput label="Due Date (YYYY-MM-DD)" value={dueDate} onChangeText={setDueDate} style={styles.input} />

      <Button mode="contained" onPress={handleBorrow} style={styles.button}>
        Confirm Borrow
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F5F7FA",
    flexGrow: 1,
    alignItems: "center",
  },
  card: {
    width: "100%",
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 4,
  },
  bookImage: {
    width: 120,
    height: 180,
    borderRadius: 8,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginBottom: 5,
  },
  author: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  genre: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
  },
  isbn: {
    fontSize: 14,
    color: "#777",
    marginTop: 5,
  },
  input: {
    width: "100%",
    marginBottom: 10,
    backgroundColor: "#FFF",
  },
  button: {
    width: "100%",
    marginTop: 10,
    backgroundColor: "#008123",
  },
});

export default Borrow;
