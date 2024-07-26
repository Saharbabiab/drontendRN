import React, { useEffect, useState } from "react";
import { Image, View, Text, TouchableOpacity } from "react-native";
import axios from "axios";
import { useUserContext } from "../utils/userContext";
import QuantityPicker from "./QuantityPicker";
import { useNavigation } from "@react-navigation/native";

export default function CartPopoverProduct({ productId, qty }) {
  const [product, setProduct] = useState(null);
  const { user, cart, setCart } = useUserContext();
  const [maxDisabled, setMaxDisabled] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3001/api/products/getById/${productId}`
        );
        setProduct(res.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    getProduct();
  }, [productId]);

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:3001/api/users/removeFromCart/${productId}`,
        { data: { userId: user._id } }
      );
      if (!response) console.log("something went wrong while deleting product");
      else if (response.data === "Product not found")
        console.log("Product not found");
      else if (response.data === "User not found")
        console.log("User not found");
      else if (response.status === 200) {
        const newCart = cart.filter((item) => item.productId !== productId);
        setCart(newCart);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleQuantityChange = async (newQty) => {
    try {
      const response = await axios.put(
        `http://localhost:3001/api/users/updateCart/${productId}`,
        { userId: user._id, qty: newQty }
      );
      if (!response) console.log("something went wrong while updating product");
      else if (response.data === "Product not found")
        console.log("Product not found");
      else if (response.data === "User not found")
        console.log("User not found");
      else if (response.status === 200) {
        const newCart = cart.map((item) => {
          if (item.productId === productId) {
            if (newQty == product.inStock) setMaxDisabled(true);
            else setMaxDisabled(false);
            return { ...item, qty: newQty };
          }
          return item;
        });
        setCart(newCart);
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <>
      {product ? (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Product", { productId: product._id })
            }
          >
            <Image
              source={{ uri: product.img }}
              style={{
                width: 70,
                height: 70,
                marginRight: 10,
              }}
            />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={{ marginBottom: 5 }}>{product.name}</Text>
            <Text style={{ fontSize: 14, marginBottom: 5 }}>
              <Text style={{ fontWeight: "bold" }}>Price:</Text> $
              {product.price} {"\n"}
              <Text style={{ fontWeight: "bold" }}>Quantity:</Text> {qty} {"\n"}
              <Text style={{ fontWeight: "bold" }}>Total:</Text> $
              {product.price * qty}
            </Text>
          </View>
          <TouchableOpacity onPress={handleDelete}>
            <Image
              source={require("../assets/trash.png")}
              style={{ width: 16, height: 16 }}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <Text>Loading...</Text>
      )}
    </>
  );
}
