import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Button,
} from "react-native";
import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/native";
import QuantityPicker from "../../components/QuantityPicker";
import { useUserContext } from "../../utils/userContext";

export default function Product() {
  const { user, cart, setCart } = useUserContext();
  const navigation = useNavigation();
  const route = useRoute();
  const { prodId } = route.params;
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [prodQuantityInCart, setProdQuantityInCart] = useState(0);
  const [disabled, setDisabled] = useState(false);

  const handleQuantityChange = (newQuantity) => {
    setQuantity(newQuantity);
  };

  const handleAddToCart = async () => {
    try {
      if (!user) {
        navigation.navigate("SignupLogin");
        return;
      }
      const response = await axios.post(
        `http://localhost:3001/api/users/addToCart/${product._id}`,
        { userId: user._id, qty: quantity }
      );
      if (!response)
        return console.log("something went wrong while adding to cart");
      if (response.data === "Not enough in stock")
        return Alert.alert("Not enough in stock");
      if (response.status === 200) {
        const pInCartIndex = cart.findIndex((p) => p.productId === product._id);
        if (pInCartIndex !== -1) {
          const updatedCart = [...cart];
          updatedCart[pInCartIndex].qty += quantity;
          setCart(updatedCart);
        } else {
          setCart((prevCart) => [
            ...prevCart,
            { productId: product._id, qty: quantity },
          ]);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/products/getById/${prodId}`
        );
        if (!response)
          return console.log("something went wrong while getting product");
        setProduct(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    getProduct();
  }, [prodId]);

  useEffect(() => {
    if (product) {
      const pInCart = cart.find((p) => p.productId === product._id);
      if (pInCart) {
        setProdQuantityInCart(pInCart.qty);
        if (pInCart.qty === product.inStock) setDisabled(true);
        else setDisabled(false);
      } else {
        setProdQuantityInCart(0);
        setDisabled(false);
      }
    }
  }, [product, cart]);

  return (
    <View style={styles.container}>
      {product ? (
        <View style={styles.productContainer}>
          <Image style={styles.image} source={{ uri: product.img }} />
          <View style={styles.details}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.description}>{product.description}</Text>
            {product.inStock > 0 ? (
              <Text style={styles.inStock}>In Stock: {product.inStock}</Text>
            ) : (
              <Text style={styles.outOfStock}>Out of Stock</Text>
            )}
            <View style={styles.actions}>
              <QuantityPicker
                product={product}
                onChange={handleQuantityChange}
                disabled={
                  product.inStock === 0 ||
                  prodQuantityInCart === product.inStock
                }
                max={product.inStock - prodQuantityInCart}
              />
              <Text style={styles.price}>${product.price}</Text>
              <Button
                title="Add to Cart"
                disabled={disabled || product.inStock === 0}
                onPress={handleAddToCart}
              />
              {prodQuantityInCart === product.inStock &&
                product.inStock !== 0 && (
                  <View style={styles.alertContainer}>
                    <Text style={styles.alert}>Max quantity achieved</Text>
                  </View>
                )}
            </View>
          </View>
        </View>
      ) : (
        <ActivityIndicator size="large" color="#0000ff" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  productContainer: {
    flexDirection: "row",
    height: 500,
  },
  image: {
    width: 200,
    height: 200,
  },
  details: {
    flex: 1,
    paddingLeft: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
  inStock: {
    color: "green",
    marginBottom: 10,
  },
  outOfStock: {
    color: "red",
    marginBottom: 10,
  },
  actions: {
    flex: 1,
    justifyContent: "space-between",
  },
  price: {
    fontSize: 24,
    color: "red",
  },
  alertContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  alert: {
    color: "orange",
  },
});
