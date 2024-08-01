import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import axios from "axios";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useUserContext } from "../utils/userContext";
import ShoppingCart from "../components/ShoppingCart";

export default function HomePage({ navigation }) {
  const { user, setUser, setCart } = useUserContext();

  // useEffect(() => {
  //   const getUser = async () => {
  //     try {
  //       const res = await axios.post("http://localhost:3001/api/users/login", {
  //         username: "s",
  //         password: "1",
  //       });
  //       setUser(res.data);
  //       setCart(res.data.cart);
  //     } catch (error) {
  //       console.error("Error fetching user:", error);
  //     }
  //   };

  //   getUser();
  // }, []);

  return (
    <View style={styles.container}>
      {user ? (
        <View>
          <ShoppingCart navigation={navigation} />
          <Text style={styles.subheading}>Welcome {user.name}</Text>
          <Button title="Logout" onPress={() => setUser(null)} />
          <Button
            title="Products"
            onPress={() => navigation.navigate("Products")}
          />
          <Button
            title="Checkout"
            onPress={() => navigation.navigate("Checkout")}
          />
          <Button
            title="Profile"
            onPress={() => navigation.navigate("Profile")}
          />
        </View>
      ) : (
        <Button title="Login" onPress={() => navigation.navigate("Login")} />
      )}
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
  subheading: {
    fontSize: 20,
    color: "green", // Example styling
  },
});
