import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  Button,
  Animated,
  StyleSheet,
} from "react-native";
import QuantityPicker from "./QuantityPicker";
import axios from "axios";
import { useUserContext } from "../utils/userContext";
import SingelProduct from "./singelProdPage";

export default function ProductCard({ product, setProducts }) {
  const { user, cart, setCart } = useUserContext();
  const [quantity, setQuantity] = useState(1);
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const [clicked, setClicked] = useState(false);

  const handleQuantityChange = (newQuantity) => {
    setQuantity(newQuantity);
  };

  const handleProductClick = () => {
    setClicked(true);
  };

  const handleAddToCart = async () => {
    try {
      const response = await axios.post(
        `https://rz2zg90j-3001.euw.devtunnels.ms/api/users/addToCart/${product._id}`,
        { userId: user._id, qty: quantity }
      );
      if (!response) {
        console.log("Something went wrong while adding to cart");
        return;
      } else if (response.status !== 200) {
        setMessage("Not enough in stock");
        setShow(true);
      }
      if (response.status === 200) {
        await axios
          .get(
            `https://rz2zg90j-3001.euw.devtunnels.ms/api/users/getCart/${user._id}`
          )
          .then(
            (res) => {
              setCart(res.data.cart);
            },
            (err) => {
              console.log(err);
            }
          );
      }
      setQuantity(1);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={{ marginLeft: 10 }}>
      {clicked ? (
        <View>
          <Button title="X" onPress={() => setClicked(false)} />
          <SingelProduct formData={product} setProducts={setProducts} />
        </View>
      ) : (
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.imageContainer}
            onPress={handleProductClick}
          >
            <Image source={{ uri: product.img }} style={styles.image} />
          </TouchableOpacity>
          <View style={styles.infoContainer}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productDescription}>
              {product.description.length > 30
                ? `${product.description.substring(0, 30)}...`
                : product.description}
            </Text>
            <View style={styles.stockPriceContainer}>
              <View>
                <Text
                  style={
                    product.inStock > 0 ? styles.inStock : styles.outOfStock
                  }
                >
                  {product.inStock > 0 ? "In Stock" : "Out of Stock"}
                </Text>
                <Text style={styles.price}>{product.price}$</Text>
              </View>
              {show && (
                <Animated.View style={{ opacity: show ? 1 : 0 }}>
                  <Text>{message}</Text>
                </Animated.View>
              )}
            </View>
          </View>
          <View style={styles.actionsContainer}>
            <Button
              title="Add to Cart"
              disabled={product.inStock <= 0}
              onPress={handleAddToCart}
            />
            <QuantityPicker
              onChange={handleQuantityChange}
              defaultValue={1}
              disabled={product.inStock <= 0}
              max={product.inStock}
            />
          </View>
          {quantity === product.inStock && (
            <View style={styles.maxQuantityContainer}>
              <View style={styles.maxQuantityMessage}>
                <Text>Max quantity achieved</Text>
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: "gray",
    width: 200,
    height: 320,
    overflow: "hidden",
  },
  imageContainer: {
    marginTop: 20,
    width: "100%",
    height: 120,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  infoContainer: {
    padding: 10,
  },
  productName: {
    color: "blue",
  },
  productDescription: {
    color: "black",
  },
  stockPriceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inStock: {
    color: "green",
  },
  outOfStock: {
    color: "red",
  },
  price: {
    color: "red",
  },
  actionsContainer: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  maxQuantityContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  maxQuantityMessage: {
    width: "80%",
    backgroundColor: "yellow",
    padding: 10,
    marginTop: 10,
  },
});
