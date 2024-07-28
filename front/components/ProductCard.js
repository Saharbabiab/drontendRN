import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import { Button, Animated } from "react-native";
import QuantityPicker from "./QuantityPicker";
import axios from "axios";
import { useUserContext } from "../utils/userContext";
import SingelProduct from "./singelProdPage";

export default function ProductCard({ product, setProducts }) {
  const { user, cart, setCart } = useUserContext();
  const [Validated, setValidated] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    name: product.name,
    img: product.img,
    description: product.description,
    price: product.price,
    inStock: product.inStock,
  });
  const [clicked, setClicked] = useState(false);

  const handleQuantityChange = (newQuantity) => {
    setQuantity(newQuantity);
  };

  const handleSubmit = async () => {
    if (Validated === false) {
      setValidated(true);
      return;
    }
    try {
      const response = await axios.put(
        `http://localhost:3001/api/products/editProduct/${product._id}`,
        formData
      );
      if (!response) return console.log("something went wrong while editing");
      console.log(response);
      Alert.alert("Product edited");
      setProducts((prevProducts) =>
        prevProducts.map((p) => (p._id === product._id ? response.data : p))
      );
    } catch (err) {
      console.log(err);
    }
  };

  const HandleProductClick = () => {
    setClicked(true);
  };
  const handleAddToCart = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3001/api/users/addToCart/${product._id}`,
        { userId: user._id, qty: quantity }
      );
      if (!response)
        return console.log("something went wrong while adding to cart");
      if (response.data == "Not enough in stock") {
        setMessage("Not enough in stock");
        setShow(true);
        setTimeout(() => {
          setShow(false);
        }, 3000);
        return;
      }
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
    console.log(clicked);
  }, [clicked]);

  return (
    <View>
      {clicked == true ? (
        <View>
          <Button title="X" onPress={() => setClicked(false)} />
          <SingelProduct
            formData={product}
            setFormData={setFormData}
            setProducts={setProducts}
          />
        </View>
      ) : (
        <View
          style={{
            borderWidth: 1,
            borderColor: "gray",
            width: 200,
            height: 320,
            overflow: "hidden",
          }}
        >
          <TouchableOpacity
            style={{
              marginTop: 20,
              width: "100%",
              height: 120,
              overflow: "hidden",
            }}
            onPress={HandleProductClick}
          >
            {clicked && (
              <SingelProduct
                product={product}
                setProducts={setProducts}
                setClicked={setClicked}
              />
            )}
            <Image
              source={{ uri: product.img }}
              style={{ width: "100%", height: "100%" }}
            />
          </TouchableOpacity>
          <View style={{ padding: 10 }}>
            <Text style={{ color: "blue" }}>{product.name}</Text>
            <Text>
              {product.description.length > 30
                ? `${product.description.substring(0, 30)}...`
                : product.description}
            </Text>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View>
                <Text style={{ color: product.inStock > 0 ? "green" : "red" }}>
                  {product.inStock > 0 ? "In Stock" : "Out of Stock"}
                </Text>
                <Text style={{ color: "red" }}>{product.price}$</Text>
              </View>
              <Animated.View style={{ opacity: show ? 1 : 0 }}>
                <Text>{message}</Text>
              </Animated.View>
            </View>
          </View>
          <View style={{ padding: 10 }}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Button
                title="Add to Cart"
                disabled={product.inStock > 0 ? false : true}
                onPress={handleAddToCart}
              />
              <QuantityPicker
                onChange={handleQuantityChange}
                defaultValue={1}
                disabled={product.inStock > 0 ? false : true}
                max={product.inStock}
              />
            </View>
          </View>
          {quantity === product.inStock && (
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <View
                style={{
                  width: "80%",
                  backgroundColor: "yellow",
                  padding: 10,
                  marginTop: 10,
                }}
              >
                <Text>Max quantity achieved</Text>
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  );
}
