import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function BorrowHistory() {
  const router = useRouter();
  const [borrowedBooks, setBorrowedBooks] = useState([]);

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      const storedBorrows = await AsyncStorage.getItem("borrowedBooks");
      if (storedBorrows) {
        setBorrowedBooks(JSON.parse(storedBorrows));
      }
    };
    fetchBorrowedBooks();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📚 Borrowed Books History</Text>

      {borrowedBooks.length === 0 ? (
        <Text style={styles.noBooks}>No borrowed books found.</Text>
      ) : (
        <FlatList
          data={borrowedBooks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.bookItem}>
              <Text style={styles.bookTitle}>{item.title} by {item.author}</Text>
              <Text>Borrowed by: {item.borrower}</Text>
              <Text>Due Date: {item.dueDate}</Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => router.push(`/borrow/delete?id=${item.id}`)}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
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
  bookItem: { backgroundColor: "#FFF", padding: 15, borderRadius: 8, marginVertical: 8 },
  bookTitle: { fontSize: 18, fontWeight: "bold" },
  editButton: { backgroundColor: "#007bff", padding: 8, borderRadius: 5, marginTop: 5 },
  deleteButton: { backgroundColor: "#dc3545", padding: 8, borderRadius: 5, marginTop: 5 },
  buttonText: { color: "#FFF", textAlign: "center", fontWeight: "bold" },
});
