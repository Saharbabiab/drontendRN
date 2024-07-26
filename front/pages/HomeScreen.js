import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
// import ProductCard from "../components/ProductCard";
// Assuming ProductCard is a custom component
import axios from "axios";

export default function HomePage() {
  const [users, setUsers] = useState(null);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/users/all");
        if (!response.data) {
          console.log("Something went wrong while getting all users");
          return;
        }
        setUsers(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUsers();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome to our store</Text>
      <Text style={styles.subheading}>all</Text>
      <View style={styles.productsContainer}>
        {users &&
          users.map((user) => (
            <View key={user._id} style={styles.productContainer}>
              <Text>{user.name}</Text>
              <Text>{user.username}</Text>
              <Text>{user.password}</Text>
            </View>
          ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 15,
    justifyContent: "space-around",
    alignItems: "center",
  },
  heading: {
    fontSize: 24,
    color: "blue", // Example styling
  },
  subheading: {
    fontSize: 20,
    color: "green", // Example styling
  },
  productsContainer: {
    flexDirection: "row",
    margin: 15,
    width: "80%",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  productContainer: {
    alignItems: "center",
    flexDirection: "column",
  },
  quantityText: {
    margin: 10,
  },
});
