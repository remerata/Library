import React, { useState } from "react";
import SearchBar from "../../components/SearchBar"; // Adjust the path if needed

const usersData = [
  { id: 1, name: "John Doe", email: "johndoe@example.com", role: "Librarian" },
  { id: 2, name: "Jane Smith", email: "janesmith@example.com", role: "Student" },
  { id: 3, name: "Alice Johnson", email: "alicejohnson@example.com", role: "Faculty" },
];

const UserScreen = () => {
  const [users, setUsers] = useState(usersData);
  const [filteredUsers, setFilteredUsers] = useState(usersData);

  const handleSearch = (query) => {
    const lowerQuery = query.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(lowerQuery) ||
        user.email.toLowerCase().includes(lowerQuery) ||
        user.role.toLowerCase().includes(lowerQuery)
    );
    setFilteredUsers(filtered);
  };

  const handleDelete = (id) => {
    const updatedUsers = users.filter((user) => user.id !== id);
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
  };

  return (
    <div style={styles.container}>
      <h2>User Management</h2>
      <SearchBar onSearch={handleSearch} />
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button style={styles.editButton} onClick={() => alert(`Edit ${user.name}`)}>
                    Edit
                  </button>
                  <button style={styles.deleteButton} onClick={() => handleDelete(user.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No users found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    maxWidth: "900px",
    margin: "0 auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },
  editButton: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "5px 10px",
    marginRight: "5px",
    border: "none",
    cursor: "pointer",
  },
  deleteButton: {
    backgroundColor: "#f44336",
    color: "white",
    padding: "5px 10px",
    border: "none",
    cursor: "pointer",
  },
};

export default UserScreen;
