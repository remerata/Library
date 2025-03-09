import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

export default function AddBorrow() {
  const [name, setName] = useState("");
  const [bookTitle, setBookTitle] = useState("");
  const [borrowDate, setBorrowDate] = useState("");
  const router = useRouter();

  const handleSubmit = () => {
    if (!name || !bookTitle || !borrowDate) {
      alert("⚠️ Please fill in all fields!");
      return;
    }
    alert(`📚 ${bookTitle} borrowed by ${name} on ${borrowDate}`);
    router.push("/borrow");
  };

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>➕ Add Borrow</Text>

        <TextInput
          placeholder="Borrower's Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <TextInput
          placeholder="Book Title"
          value={bookTitle}
          onChangeText={setBookTitle}
          style={styles.input}
        />

        <TextInput
          placeholder="Borrow Date (YYYY-MM-DD)"
          value={borrowDate}
          onChangeText={setBorrowDate}
          style={styles.input}
        />

        <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
          <Text style={styles.buttonText}>📖 Confirm Borrow</Text>
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
  input: { 
    borderWidth: 1, 
    borderColor: "#ccc", 
    padding: 10, 
    borderRadius: 5, 
    marginBottom: 10 
  },
  addButton: { 
    backgroundColor: "#008123", 
    paddingVertical: 10, 
    borderRadius: 5, 
    alignItems: "center" 
  },
  buttonText: { 
    color: "#FFF", 
    fontSize: 16, 
    fontWeight: "600" 
  }
});
