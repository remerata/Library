import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from "uuid";
import FlashMessage, { showMessage } from "react-native-flash-message";
import 'react-native-get-random-values'; // Fix for UUID issue

export default function AddBorrow() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [borrower, setBorrower] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleBorrowBook = async () => {
    if (!title || !author || !isbn || !borrower || !contactNumber || !dueDate) {
      Alert.alert("Error", "All fields are required!");
      return;
    }
    
    try {
      const newBorrow = { id: uuidv4(), title, author, isbn, borrower, contactNumber, dueDate };
      const storedBorrows = await AsyncStorage.getItem("borrowedBooks");
      const borrowedBooks = storedBorrows ? JSON.parse(storedBorrows) : [];
      
      borrowedBooks.unshift(newBorrow); // Add new borrow entry at the top
      await AsyncStorage.setItem("borrowedBooks", JSON.stringify(borrowedBooks));

      // Show success message
      showMessage({
        message: "Book borrowed successfully!",
        type: "success",
        icon: "success",
      });

      // Navigate back after a short delay
      setTimeout(() => router.back(), 1500);
    } catch (error) {
      console.error("Error borrowing book:", error);
      Alert.alert("Error", "Failed to borrow book.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Flash Message Component */}
      <FlashMessage position="top" />

      <Text style={styles.title}>📖 Borrow a Book</Text>

      <TextInput 
        placeholder="Book Title" 
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
      <TextInput 
        placeholder="Borrower's Name" 
        value={borrower} 
        onChangeText={setBorrower} 
        style={styles.input} 
      />
      <TextInput 
        placeholder="Contact Number" 
        value={contactNumber} 
        onChangeText={setContactNumber} 
        keyboardType="phone-pad"
        style={styles.input} 
      />
      <TextInput 
        placeholder="Due Date (YYYY-MM-DD)" 
        value={dueDate} 
        onChangeText={setDueDate} 
        style={styles.input} 
      />

      <TouchableOpacity style={styles.button} onPress={handleBorrowBook}>
        <Text style={styles.buttonText}>Borrow Book</Text>
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
