import React, { useEffect, useState } from "react";
import { Image, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import axios from "axios";
import { useUserContext } from "../utils/userContext";
import { useNavigation } from "@react-navigation/native";

export default function CartPopoverProduct({ item }) {
  const { user, cart, setCart, api } = useUserContext();
  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${api}/users/removeFromCart/${item._id}`,
        { data: { userId: user._id } }
      );
      if (!response) console.log("something went wrong while deleting product");
      else if (response.data === "Product not found")
        console.log("Product not found");
      else if (response.data === "User not found")
        console.log("User not found");
      else if (response.status === 200) {
        const newCart = cart.filter((item) => item._id !== item.productId);
        setCart(newCart);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
      }}
    >
      <Image
        source={{ uri: item.img }}
        style={{
          width: 70,
          height: 70,
          marginRight: 10,
        }}
      />

      <View style={{ flex: 1 }}>
        <Text style={{ marginBottom: 5 }}>{item.name}</Text>
        <Text style={{ fontSize: 14, marginBottom: 5 }}>
          <Text style={{ fontWeight: "bold" }}>Price:</Text> ${item.price}{" "}
          {"\n"}
          <Text style={{ fontWeight: "bold" }}>Quantity:</Text> {item.qty}{" "}
          {"\n"}
          <Text style={{ fontWeight: "bold" }}>Total:</Text> $
          {item.price * item.qty}
        </Text>
      </View>
      <TouchableOpacity onPress={handleDelete}>
        <Image
          source={require("../assets/trash.png")}
          style={{ width: 16, height: 16 }}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: "80%",
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "black",
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  link: {
    color: "blue",
    marginTop: 10,
  },
});
