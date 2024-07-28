import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TextInput } from "react-native";
import { Button, Animated } from "react-native";
import QuantityPicker from "./QuantityPicker";
import axios from "axios";
import { useUserContext } from "../utils/userContext";

export default function SingelProduct({ formData, setFormData, setProducts }) {
  const { user, cart, setCart } = useUserContext();
  const [Validated, setValidated] = useState(false);
  const [quantity, setQuantity] = useState(formData.inStock > 0 ? 1 : 0);
  const [show, setShow] = useState(false);
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
        `http://localhost:3001/api/products/editProduct/${formData._id}`,
        edited
      );
      if (!response) return console.log("something went wrong while editing");
      console.log(response);
      Alert.alert("Product edited");
      setProducts((prevProducts) =>
        prevProducts.map((p) => (p._id === edited._id ? response.data : p))
      );
      setFormData(response.data);
      setShow(false);
      console.log(formData);
    } catch (err) {
      console.log(err);
    }
  };
  const handleAddToCart = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3001/api/users/addToCart/${formData._id}`,
        { userId: user._id, qty: quantity }
      );
      if (!response)
        return console.log("something went wrong while adding to cart");
      if (response.data == "Not enough in stock") {
        return setMessage("Not enough in stock");
      } else {
        setCart(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleDelete = async () => {
    try {
      console.log(formData.name);
      console.log(formData._id);
      const response = await axios.delete(
        `http://localhost:3001/api/products/deleteProduct/${formData._id}`
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
        defaultValue={quantity}
        max={formData.inStock}
      />
      <Button title="Edit" onPress={() => setShow(true)} />
      <Button
        title="Delete
"
        onPress={handleDelete}
      />
      <Button title="Add to cart" onPress={handleAddToCart} />
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
