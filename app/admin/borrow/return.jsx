import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FlashMessage, { showMessage } from "react-native-flash-message";

export default function ReturnBook() {
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

  const handleReturn = async (id) => {
    try {
      let updatedBooks = borrowedBooks.filter((b) => b.id !== id);
      await AsyncStorage.setItem("borrowedBooks", JSON.stringify(updatedBooks));

      setBorrowedBooks(updatedBooks);
      showMessage({ message: "Book successfully returned!", type: "success", icon: "success" });
    } catch (error) {
      Alert.alert("Error", "Failed to return the book.");
    }
  };

  return (
    <View style={styles.container}>
      <FlashMessage position="top" />
      <Text style={styles.title}>🔄 Return Borrowed Books</Text>

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

              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  style={styles.returnButton}
                  onPress={() => handleReturn(item.id)}
                >
                  <Text style={styles.buttonText}>Return</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleReturn(item.id)}
                >
                  <Text style={styles.buttonText}>Delete</Text>
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
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  bookItem: { backgroundColor: "#FFF", padding: 15, borderRadius: 8, marginVertical: 8 },
  bookTitle: { fontSize: 18, fontWeight: "bold" },
  buttonGroup: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  returnButton: { backgroundColor: "#28a745", padding: 8, borderRadius: 5, flex: 1, marginRight: 5 },
  deleteButton: { backgroundColor: "#dc3545", padding: 8, borderRadius: 5, flex: 1, marginLeft: 5 },
  buttonText: { color: "#FFF", textAlign: "center", fontWeight: "bold" },
});
