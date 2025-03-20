import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FlashMessage, { showMessage } from "react-native-flash-message";

export default function EditBorrow() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [borrowData, setBorrowData] = useState({
    title: "",
    author: "",
    isbn: "",
    borrower: "",
    contactNumber: "",
    dueDate: "",
  });

  useEffect(() => {
    const fetchBorrowData = async () => {
      const storedBorrows = await AsyncStorage.getItem("borrowedBooks");
      if (storedBorrows) {
        const borrowedBooks = JSON.parse(storedBorrows);
        const bookToEdit = borrowedBooks.find((b) => b.id === id);
        if (bookToEdit) setBorrowData(bookToEdit);
      }
    };
    fetchBorrowData();
  }, [id]);

  const handleUpdateBorrow = async () => {
    try {
      const storedBorrows = await AsyncStorage.getItem("borrowedBooks");
      let borrowedBooks = storedBorrows ? JSON.parse(storedBorrows) : [];

      borrowedBooks = borrowedBooks.map((b) => (b.id === id ? borrowData : b));
      await AsyncStorage.setItem("borrowedBooks", JSON.stringify(borrowedBooks));

      showMessage({ message: "Borrow details updated!", type: "success", icon: "success" });
      setTimeout(() => router.back(), 1500);
    } catch (error) {
      Alert.alert("Error", "Failed to update borrow details.");
    }
  };

  return (
    <View style={styles.container}>
      <FlashMessage position="top" />
      <Text style={styles.title}>✏️ Edit Borrowed Book</Text>
      <TextInput value={borrowData.title} style={styles.input} editable={false} />
      <TextInput value={borrowData.author} style={styles.input} editable={false} />
      <TextInput value={borrowData.borrowerName} onChangeText={(text) => setBorrowData({ ...borrowData, borrower: text })} style={styles.input} />
      <TextInput value={borrowData.contactNumber} onChangeText={(text) => setBorrowData({ ...borrowData, contactNumber: text })} style={styles.input} />
      <TextInput value={borrowData.dueDate} onChangeText={(text) => setBorrowData({ ...borrowData, dueDate: text })} style={styles.input} />
      <TouchableOpacity style={styles.button} onPress={handleUpdateBorrow}>
        <Text style={styles.buttonText}>Update</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F5F7FA" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, padding: 10, marginVertical: 8, borderRadius: 5, borderColor: "#CCC", backgroundColor: "#FFF" },
  button: { backgroundColor: "#007bff", paddingVertical: 12, borderRadius: 8, alignItems: "center", marginTop: 15 },
  buttonText: { color: "#FFF", fontSize: 16, fontWeight: "600" },
});
