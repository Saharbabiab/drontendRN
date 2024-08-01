import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TextInput } from "react-native";
import { Button, Animated } from "react-native";
import QuantityPicker from "./QuantityPicker";
import axios from "axios";
import { useUserContext } from "../utils/userContext"; // Add this line to import the useUserContext hook

export default function SingelProduct({ formData, setFormData, setProducts }) {
  const { user, cart, setCart } = useUserContext();
  const [Validated, setValidated] = useState(false);
  const [quantity, setQuantity] = useState(formData.inStock > 0 ? 1 : 0);
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const [edited, setEdited] = useState({
    name: formData.name,
    img: formData.img,
    description: formData.description,
    price: formData.price,
    inStock: formData.inStock,
  });

  const handleQuantityChange = (newQuantity) => {
    setQuantity(newQuantity);
  };

  const handleSubmit = async () => {
    if (Validated === false) {
      setValidated(true);
      return;
    }
    console.log(edited);
    try {
      const response = await axios.put(
        `https://rz2zg90j-3001.euw.devtunnels.ms/api/products/editProduct/${formData._id}`,
        edited
      );
      if (!response) return console.log("something went wrong while editing");
      console.log(response);
      await axios
        .get(`https://rz2zg90j-3001.euw.devtunnels.ms/api/products/getProducts`)
        .then((res) => {
          setProducts(res.data);
          setFormData(response.data);
        });
      setShow(false);
      console.log(formData);
    } catch (err) {
      console.log(err);
    }
  };
  const handleAddToCart = async () => {
    try {
      const response = await axios.post(
        `https://rz2zg90j-3001.euw.devtunnels.ms/api/users/addToCart/${formData._id}`,
        { userId: user._id, qty: quantity }
      );
      if (!response) {
        console.log("Something went wrong while adding to cart");
        return;
      } else {
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
  const handleDelete = async () => {
    try {
      console.log(formData.name);
      console.log(formData._id);
      const response = await axios.delete(
        `https://rz2zg90j-3001.euw.devtunnels.ms/api/products/deleteProduct/${formData._id}`
      );
      if (!response) return console.log("something went wrong while deleting");
      console.log(response);
      setProducts((prevProducts) =>
        prevProducts.filter((p) => p._id !== formData._id)
      );
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <View style={styles.card}>
      <Image style={styles.image} source={{ uri: formData.img }} />
      <Text style={styles.name}>{formData.name}</Text>
      <Text style={styles.description}>{formData.description}</Text>
      <Text style={styles.price}>${formData.price}</Text>
      <QuantityPicker
        onChange={handleQuantityChange}
        defaultValue={1}
        disabled={formData.inStock <= 0}
        max={formData.inStock}
      />
      <Button title="Edit" onPress={() => setShow(true)} />
      <Button
        title="Delete
"
        onPress={handleDelete}
      />
      <Button
        title="Add to cart"
        onPress={handleAddToCart}
        disabled={formData.inStock <= 0}
      />
      {show && <Text>{message}</Text>}
      <Animated.View style={{ opacity: show ? 1 : 0 }}>
        <View style={styles.form}>
          <Text style={styles.heading}>Edit Product</Text>
          <Text>Name</Text>
          <TextInput
            style={styles.input}
            value={edited.name}
            onChangeText={(text) => setEdited({ ...edited, name: text })}
          />
          <Text>Image</Text>
          <TextInput
            style={styles.input}
            value={edited.img}
            onChangeText={(text) => setEdited({ ...edited, img: text })}
          />
          <Text>Description</Text>
          <TextInput
            style={styles.input}
            value={edited.description}
            onChangeText={(text) => setEdited({ ...edited, description: text })}
          />
          <Text>Price</Text>
          <TextInput
            style={styles.input}
            value={edited.price}
            onChangeText={(text) => setEdited({ ...edited, price: text })}
          />
          <Text>In Stock</Text>
          <TextInput
            style={styles.input}
            placeholder={edited.inStock}
            onChangeText={(text) => setEdited({ ...edited, inStock: text })}
          />
          <Button title="Submit" onPress={handleSubmit} />
          <Button title="Close" onPress={() => setShow(false)} />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "lightgrey",
    borderRadius: 10,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
  },
  description: {
    fontSize: 16,
  },
  price: {
    fontSize: 18,
    color: "green",
  },
  form: {
    padding: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "lightgrey",
    borderRadius: 5,
    padding: 5,
    marginVertical: 5,
  },
  closeBtn: {
    backgroundColor: "red",
    color: "white",
    padding: 10,
    borderRadius: 5,
  },
});
