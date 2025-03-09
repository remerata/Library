import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";

const availableBooks = [
  { id: "1", title: "The Great Gatsby", author: "F. Scott Fitzgerald", isbn: "9780743273565" },
  { id: "2", title: "1984", author: "George Orwell", isbn: "9780451524935" },
  { id: "3", title: "To Kill a Mockingbird", author: "Harper Lee", isbn: "9780061120084" },
];

export default function BorrowScreen() {
  const router = useRouter();
  const [books, setBooks] = useState(availableBooks);

  const borrowBook = (id) => {
    setBooks(books.filter(book => book.id !== id));
    alert("📚 Book Borrowed Successfully!");
  };

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>📚 Available Books</Text>

        {books.length === 0 ? (
          <Text style={styles.noBooks}>No Books Available</Text>
        ) : (
          <FlatList
            data={books}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.bookCard}>
                <Text style={styles.bookTitle}>{item.title}</Text>
                <Text style={styles.bookText}>Author: {item.author}</Text>
                <Text style={styles.bookText}>ISBN: {item.isbn}</Text>

                <TouchableOpacity 
                  style={styles.borrowButton} 
                  onPress={() => borrowBook(item.id)}
                >
                  <Text style={styles.buttonText}>Borrow</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}

        {/* ➕ Add Borrow Button */}
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => router.push("/admin/books/add")} // ✅ Fixed path
        >
          <Text style={styles.buttonText}>➕ Add Borrow</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "#F5F7FA" 
  },
  container: { 
    width: "60%", 
    backgroundColor: "#FFF", 
    padding: 20, 
    borderRadius: 10, 
    shadowColor: "#000", 
    shadowOpacity: 0.1, 
    shadowOffset: { width: 0, height: 2 }, 
    elevation: 3 
  },
  title: { 
    fontSize: 22, 
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center"
  },
  noBooks: { 
    fontSize: 18, 
    color: "gray", 
    textAlign: "center" 
  },
  bookCard: { 
    padding: 15, 
    backgroundColor: "#FFF", 
    borderRadius: 10, 
    marginVertical: 8, 
    shadowColor: "#000", 
    shadowOpacity: 0.1, 
    shadowOffset: { width: 0, height: 2 }, 
    elevation: 3 
  },
  bookTitle: { 
    fontSize: 18, 
    fontWeight: "bold", 
    marginBottom: 5 
  },
  bookText: { 
    fontSize: 14, 
    color: "#333" 
  },
  borrowButton: { 
    backgroundColor: "#008123", 
    paddingVertical: 8, 
    paddingHorizontal: 15, 
    borderRadius: 5, 
    marginTop: 10, 
    alignItems: "center"
  },
  addButton: { 
    backgroundColor: "#008123", 
    paddingVertical: 10, 
    borderRadius: 5, 
    marginTop: 15, 
    alignItems: "center" 
  },
  buttonText: { 
    color: "#FFF", 
    fontSize: 16, 
    fontWeight: "600" 
  }
});
