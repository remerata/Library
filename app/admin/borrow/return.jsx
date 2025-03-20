import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ReturnBook() {
  const [borrowedBooks, setBorrowedBooks] = useState([]);

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      const storedBorrows = await AsyncStorage.getItem("borrowedBooks");
      setBorrowedBooks(storedBorrows ? JSON.parse(storedBorrows) : []);
    };
    fetchBorrowedBooks();
  }, []);

  const handleReturnBook = async (bookId) => {
    // Fetch books and borrowed books
    const storedBooks = await AsyncStorage.getItem("books");
    const storedBorrows = await AsyncStorage.getItem("borrowedBooks");

    let books = storedBooks ? JSON.parse(storedBooks) : [];
    let borrowedBooks = storedBorrows ? JSON.parse(storedBorrows) : [];

    // Update book status
    books = books.map((book) => (book.id === bookId ? { ...book, status: "Available" } : book));
    borrowedBooks = borrowedBooks.filter((book) => book.id !== bookId);

    // Save back to AsyncStorage
    await AsyncStorage.setItem("books", JSON.stringify(books));
    await AsyncStorage.setItem("borrowedBooks", JSON.stringify(borrowedBooks));

    // Update UI
    setBorrowedBooks(borrowedBooks);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📖 Return Borrowed Books</Text>

      {borrowedBooks.length === 0 ? (
        <Text style={styles.noBooks}>No borrowed books found.</Text>
      ) : (
        <FlatList
          data={borrowedBooks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.bookItem}>
              {item.image && (
                <Image
                  source={{ uri: item.image }}
                  style={styles.bookImage}
                />
              )}
              <View style={{ flex: 1 }}>
                <Text style={styles.bookTitle}>{item.title} by {item.author}</Text>
                <Text>Borrowed by: {item.borrowerName}</Text>
                <Text>Due Date: {item.dueDate}</Text>
                <TouchableOpacity style={styles.returnButton} onPress={() => handleReturnBook(item.id)}>
                  <Text style={styles.returnText}>Return</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F5F7FA" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  noBooks: { textAlign: "center", fontSize: 16, color: "gray", marginTop: 20 },
  bookItem: { backgroundColor: "#FFF", padding: 15, borderRadius: 8, marginVertical: 8, flexDirection: "row" },
  bookImage: { width: 80, height: 120, marginRight: 10, borderRadius: 5 },
  bookTitle: { fontSize: 18, fontWeight: "bold" },
  returnButton: { marginTop: 10, backgroundColor: "#FF5733", padding: 10, borderRadius: 5, alignItems: "center" },
  returnText: { color: "#FFF", fontWeight: "bold" },
});
