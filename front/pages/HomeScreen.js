import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import axios from "axios";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useUserContext } from "../utils/userContext";

const Stack = createNativeStackNavigator();

export default function HomePage({ navigation }) {
  const { user, setUser, setCart } = useUserContext();

  useEffect(() => {
    setUser({ name: "John Doe" });
  }, []);

  return (
    <View>
      <View style={styles.container}>
        {user ? (
          <View>
            <Text style={styles.subheading}>Welcome {user.name}</Text>
            <Button title="Logout" onPress={() => setUser(null)} />
            <Button
              title="Products"
              onPress={() => navigation.navigate("Products")}
            />
          </View>
        ) : (
          <Button title="Login" onPress={() => navigation.navigate("Login")} />
        )}
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
  logincontainer: {
    flex: 1,
    justifyContent: "left",
    alignItems: "left",
  },
});
