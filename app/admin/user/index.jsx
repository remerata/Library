import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function UserIndex() {
  const router = useRouter();
  const [availableBooks, setAvailableBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const storedBooks = await AsyncStorage.getItem("books");
        if (storedBooks) {
          let books = JSON.parse(storedBooks).map(book => ({
            ...book,
            status: book.status || "Available"
          }));
          setAvailableBooks(books);
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
            <View style={styles.card}>
              {item.image && <Image source={{ uri: item.image }} style={styles.bookImage} />}
              <View style={styles.bookDetails}>
                <Text style={styles.bookTitle}>{item.title}</Text>
                <Text style={styles.bookAuthor}>by {item.author}</Text>
                <Text style={styles.bookInfo}>Genre: {item.genre}</Text>
                <Text style={styles.bookInfo}>ISBN: {item.isbn}</Text>
                <Text style={item.status === "Available" ? styles.available : styles.notAvailable}>
                  {item.status}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.borrowButton, item.status === "Not Available" && styles.disabledButton]}
                onPress={() => {
                  if (item.status === "Available") {
                    router.push({ pathname: "/admin/user/borrow", params: { bookId: item.id } });
                  }
                }}
                disabled={item.status === "Not Available"}
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
  container: { flex: 1, padding: 20, backgroundColor: "#EEF1F6" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center", color: "#333" },
  noBooks: { textAlign: "center", fontSize: 16, color: "gray", marginTop: 20 },
  card: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center",
  },
  bookImage: { width: 250, height: 140, borderRadius: 8, marginBottom: 10 },
  bookDetails: { alignItems: "center" },
  bookTitle: { fontSize: 18, fontWeight: "bold", textAlign: "center", color: "#222" },
  bookAuthor: { fontSize: 14, color: "#666", marginBottom: 5 },
  bookInfo: { fontSize: 14, color: "#444" },
  available: { color: "green", fontWeight: "bold", marginTop: 5 },
  notAvailable: { color: "red", fontWeight: "bold", marginTop: 5 },
  borrowButton: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
    width: "90%",
  },
  disabledButton: { backgroundColor: "gray" },
  buttonText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
});
