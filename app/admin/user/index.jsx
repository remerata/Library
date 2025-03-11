import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function UserIndex() {
  const router = useRouter();
  const [availableBooks, setAvailableBooks] = useState([]);

  // Fetch books from AsyncStorage
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const storedBooks = await AsyncStorage.getItem("books"); // Load from "books"
        if (storedBooks) {
          setAvailableBooks(JSON.parse(storedBooks));
        }
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📚 Available Books</Text>

      {availableBooks.length === 0 ? (
        <Text style={styles.noBooks}>No books available.</Text>
      ) : (
        <FlatList
          data={availableBooks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.bookItem}>
              <Text style={styles.bookTitle}>{item.title} by {item.author}</Text>
              <Text>Genre: {item.genre}</Text>
              <Text>ISBN: {item.isbn}</Text>

              <TouchableOpacity
                style={styles.borrowButton}
                onPress={() => router.push({ pathname: "/admin/user/borrow", params: { bookId: item.id } })}
              >
                <Text style={styles.buttonText}>Borrow</Text>
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
  borrowButton: { backgroundColor: "#008123", padding: 10, borderRadius: 5, marginTop: 10, alignItems: "center" },
  buttonText: { color: "#FFF", fontWeight: "bold" },
});
