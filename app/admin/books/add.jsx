import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

export default function AddBook() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const router = useRouter();

  const handleSubmit = () => {
    console.log("Book Added:", { title, author, isbn });
    router.push("/admin/books");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>➕ Add a New Book</Text>
      
      <TextInput 
        placeholder="Title" 
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

      {/* Custom Green Button */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Add Book</Text>
      </TouchableOpacity>
    </View>
  );
}

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
    backgroundColor: "#008123", // Green color
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
