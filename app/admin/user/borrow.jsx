import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function BorrowBook() {
  const { bookId } = useLocalSearchParams();
  const router = useRouter();
  const [book, setBook] = useState(null);
  const [borrowerName, setBorrowerName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [dueDate, setDueDate] = useState("");

  // Fetch book details
  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const storedBooks = await AsyncStorage.getItem("books");
        const books = storedBooks ? JSON.parse(storedBooks) : [];
        const selectedBook = books.find((b) => b.id.toString() === bookId);
        setBook(selectedBook);
      } catch (error) {
        console.error("Error fetching book:", error);
      }
    };

    fetchBookDetails();
  }, [bookId]);

  // Handle Borrow Book
  const handleBorrow = async () => {
    if (!borrowerName || !contactNumber || !dueDate) {
      Alert.alert("Missing Details", "Please fill in all fields before borrowing.");
      return;
    }

    try {
      // Store borrow information in AsyncStorage (you can update this logic based on your database)
      const borrowedBooks = await AsyncStorage.getItem("borrowedBooks");
      const borrowedList = borrowedBooks ? JSON.parse(borrowedBooks) : [];

      const newBorrowedBook = {
        ...book,
        borrowerName,
        contactNumber,
        dueDate,
        borrowedAt: new Date().toISOString(),
      };

      borrowedList.push(newBorrowedBook);
      await AsyncStorage.setItem("borrowedBooks", JSON.stringify(borrowedList));

      Alert.alert("Success", "Book borrowed successfully!");
      router.push("/user/index"); // Navigate back to the book list
    } catch (error) {
      console.error("Error borrowing book:", error);
    }
  };

  if (!book) return <Text style={styles.loading}>Loading book details...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Borrow Book</Text>
      <Text style={styles.bookTitle}>{book.title} by {book.author}</Text>
      <Text>Genre: {book.genre}</Text>
      <Text>ISBN: {book.isbn}</Text>

      {/* Borrower Name */}
      <TextInput
        style={styles.input}
        placeholder="Enter borrower's name"
        value={borrowerName}
        onChangeText={setBorrowerName}
      />

      {/* Contact Number */}
      <TextInput
        style={styles.input}
        placeholder="Enter contact number"
        keyboardType="phone-pad"
        value={contactNumber}
        onChangeText={setContactNumber}
      />

      {/* Due Date */}
      <TextInput
        style={styles.input}
        placeholder="Enter due date (YYYY-MM-DD)"
        value={dueDate}
        onChangeText={setDueDate}
      />

      {/* Confirm Borrow */}
      <TouchableOpacity style={styles.borrowButton} onPress={handleBorrow}>
        <Text style={styles.buttonText}>Confirm Borrow</Text>
      </TouchableOpacity>

      {/* Cancel Button */}
      <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F5F7FA", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  bookTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  input: { width: "100%", padding: 10, borderWidth: 1, borderColor: "#ccc", borderRadius: 5, marginBottom: 10 },
  borrowButton: { backgroundColor: "#008123", padding: 12, borderRadius: 5, marginTop: 10 },
  cancelButton: { backgroundColor: "#d9534f", padding: 12, borderRadius: 5, marginTop: 10 },
  buttonText: { color: "#FFF", fontWeight: "bold", textAlign: "center" },
  loading: { fontSize: 16, textAlign: "center", marginTop: 20 },
});
