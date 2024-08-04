import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Animated,
} from "react-native";
import QuantityPicker from "./QuantityPicker";
import axios from "axios";
import { useUserContext } from "../utils/userContext";

export default function SingleProduct({ formData, setFormData, setProducts }) {
  const { user, cart, setCart, api } = useUserContext();
  const [validated, setValidated] = useState(false);
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
    if (!validated) {
      setValidated(true);
      return;
    }
    try {
      const response = await axios.put(
        `${api}/products/editProduct/${formData._id}`,
        edited
      );
      if (!response) return console.log("something went wrong while editing");
      const res = await axios.get(`${api}/products/getProducts`);
      setProducts(res.data);
      setFormData(response.data);
      setShow(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddToCart = async () => {
    try {
      const response = await axios.post(
        `${api}/users/addToCart/${formData._id}`,
        { userId: user._id, qty: quantity }
      );
      if (!response) {
        setMessage("Not enough in stock");
        setShow(true);
        return;
      }
      if (response.status === 200) {
        const res = await axios.get(`${api}/users/getCart/${user._id}`);
        setCart(res.data.cart);
      }
      setQuantity(1);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${api}/products/deleteProduct/${formData._id}`
      );
      if (!response) return console.log("something went wrong while deleting");
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
      <TouchableOpacity style={styles.button} onPress={() => setShow(true)}>
        <Text style={styles.buttonText}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.deleteButton]}
        onPress={handleDelete}
      >
        <Text style={styles.buttonText}>Delete</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.addToCartButton]}
        onPress={handleAddToCart}
        disabled={formData.inStock <= 0}
      >
        <Text style={styles.buttonText}>Add to cart</Text>
      </TouchableOpacity>
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
            value={edited.inStock.toString()}
            onChangeText={(text) =>
              setEdited({ ...edited, inStock: parseInt(text) })
            }
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.closeButton]}
            onPress={() => setShow(false)}
          >
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    maxWidth: 400,
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
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: "red",
  },
  addToCartButton: {
    backgroundColor: "green",
  },
  closeButton: {
    backgroundColor: "grey",
  },
});
