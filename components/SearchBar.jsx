import React, { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearch = (event) => {
    const value = event.target.value;
    setQuery(value);
    onSearch(value); // Pass search query to parent component
  };

  return (
    <div style={styles.container}>
      <input
        type="text"
        placeholder="Search by title, author, or ISBN..."
        value={query}
        onChange={handleSearch}
        style={styles.input}
      />
    </div>
  );
};

const styles = {
  container: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
  },
  input: {
    width: "80%",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
  },
};

export default SearchBar;
