import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  Image 
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from "uuid";
import FlashMessage, { showMessage } from "react-native-flash-message";
import * as ImagePicker from "expo-image-picker";
import 'react-native-get-random-values'; // Fix for UUID issue

export default function AddBook() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [image, setImage] = useState(null); // State for image

  // Function to pick an image
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "You need to allow access to your photos.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleAddBook = async () => {
    if (!title || !author || !isbn) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    try {
      const newBook = { id: uuidv4(), title, author, isbn, image };
      const storedBooks = await AsyncStorage.getItem("books");
      const books = storedBooks ? JSON.parse(storedBooks) : [];

      books.unshift(newBook); // Add book at the top for instant UI update
      await AsyncStorage.setItem("books", JSON.stringify(books));

      showMessage({
        message: "Book added successfully!",
        type: "success",
        icon: "success",
      });

      setTimeout(() => router.back(), 1500);
    } catch (error) {
      console.error("Error adding book:", error);
      Alert.alert("Error", "Failed to add book.");
    }
  };

  return (
    <View style={styles.container}>
      <FlashMessage position="top" />

      <Text style={styles.title}>➕ Add New Book</Text>
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

      {/* Upload Image Button */}
      <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
        <Text style={styles.uploadText}>📸 Upload Image</Text>
      </TouchableOpacity>

      {/* Display selected image */}
      {image && <Image source={{ uri: image }} style={styles.image} />}

      <TouchableOpacity style={styles.button} onPress={handleAddBook}>
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
  uploadButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  uploadText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  image: {
    width: 150,
    height: 150,
    alignSelf: "center",
    marginVertical: 10,
    borderRadius: 8,
  },
  button: {
    backgroundColor: "#008123",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
