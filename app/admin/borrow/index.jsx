import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useFocusEffect } from "expo-router";
import FlashMessage, { showMessage } from "react-native-flash-message";

export default function BorrowIndex() {
  const router = useRouter();
  const [borrowedBooks, setBorrowedBooks] = useState([]);

  // Fetch borrowed books from storage
  const fetchBorrowedBooks = async () => {
    try {
      const storedBorrows = await AsyncStorage.getItem("borrowedBooks");
      const parsedBorrows = storedBorrows ? JSON.parse(storedBorrows) : [];
  
      setBorrowedBooks(Array.isArray(parsedBorrows) ? parsedBorrows : []);
    } catch (error) {
      console.error("Error fetching borrowed books:", error);
      setBorrowedBooks([]);
    }
  };

  // Refresh list when returning to this screen
  useFocusEffect(
    useCallback(() => {
      fetchBorrowedBooks();
    }, [])
  );

  const handleDelete = async (id) => {
    Alert.alert("Delete Confirmation", "Are you sure you want to delete this borrow record?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: async () => {
          try {
            const storedBorrows = await AsyncStorage.getItem("borrowedBooks");
            let borrowedBooks = storedBorrows ? JSON.parse(storedBorrows) : [];

            borrowedBooks = borrowedBooks.filter((b) => b.id !== id);
            await AsyncStorage.setItem("borrowedBooks", JSON.stringify(borrowedBooks));

            setBorrowedBooks(borrowedBooks);
            showMessage({ message: "Borrow record deleted!", type: "success", icon: "success" });
          } catch (error) {
            Alert.alert("Error", "Failed to delete record.");
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <FlashMessage position="top" />

      {/* Top Button Row */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/admin/user")}
        >
          <Text style={styles.addButtonText}>+ Borrow a Book</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.returnButton}
          onPress={() => router.push("/admin/borrow/return")}
        >
          <Text style={styles.buttonText}>Return Book</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>📚 Borrowed Books</Text>

      {borrowedBooks.length === 0 ? (
        <Text style={styles.noBooks}>No borrowed books found.</Text>
      ) : (
        <FlatList
          data={borrowedBooks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.bookItem}>
              <Text style={styles.bookTitle}>{item.title} by {item.author}</Text>
              <Text>Borrowed by: {item.borrowerName || "Unknown"}</Text>
              <Text>Contact: {item.contactNumber || "N/A"}</Text>
              <Text>Due Date: {item.dueDate || "Not specified"}</Text>

              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => router.push(`/admin/borrow/edit?id=${item.id}`)}
                >
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(item.id)}
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
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  noBooks: { textAlign: "center", fontSize: 16, color: "gray", marginTop: 20 },
  bookItem: { backgroundColor: "#FFF", padding: 15, borderRadius: 8, marginVertical: 8 },
  bookTitle: { fontSize: 18, fontWeight: "bold" },
  buttonGroup: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },

  // Buttons
  buttonRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  addButton: { backgroundColor: "#28a745", padding: 12, borderRadius: 5, flex: 1, marginRight: 5, alignItems: "center" },
  returnButton: { backgroundColor: "#007bff", padding: 12, borderRadius: 5, flex: 1, marginRight: 5, alignItems: "center" },
  historyButton: { backgroundColor: "#6c757d", padding: 12, borderRadius: 5, flex: 1, alignItems: "center" },

  editButton: { backgroundColor: "#007bff", padding: 8, borderRadius: 5, flex: 1, marginRight: 5 },
  deleteButton: { backgroundColor: "#dc3545", padding: 8, borderRadius: 5, flex: 1, marginLeft: 5 },
  buttonText: { color: "#FFF", textAlign: "center", fontWeight: "bold" },
  addButtonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
});
