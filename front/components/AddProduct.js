import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Modal,
  Image,
  StyleSheet,
} from "react-native";
import axios from "axios";
import { useUserContext } from "../utils/userContext";
import { launchImageLibrary } from "react-native-image-picker";

export default function AddProduct({ setShowAddProduct, setProducts }) {
  const { user } = useUserContext();
  const [show, setShow] = useState(false);
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    img: "",
    description: "",
    price: "",
    inStock: "",
  });
  const [imageUri, setImageUri] = useState("");

  const handleShow = () => {
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setValidated(false);
    setShowAddProduct(false);
    setImageUri(""); // Clear imageUri on close
  };

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleImagePicker = () => {
    launchImageLibrary(
      { mediaType: "photo", includeBase64: true },
      (response) => {
        if (response.didCancel) {
          console.log("User cancelled image picker");
        } else if (response.error) {
          console.log("ImagePicker Error: ", response.error);
        } else {
          setImageUri(response.assets[0].uri);
          setFormData({ ...formData, img: response.assets[0].base64 });
        }
      }
    );
  };

  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.img ||
      !formData.description ||
      !formData.price ||
      !formData.inStock
    ) {
      setValidated(true);
      return;
    }

    try {
      const response = await axios.post(
        "https://rz2zg90j-3001.euw.devtunnels.ms/api/products/create",
        {
          name: formData.name,
          img: formData.img, // Ensure this is the correct format for your API
          description: formData.description,
          price: parseFloat(formData.price),
          inStock: parseInt(formData.inStock, 10),
        }
      );
      if (response.status === 200) {
        const productsResponse = await axios.get(
          "https://rz2zg90j-3001.euw.devtunnels.ms/api/products/getProducts"
        );
        setProducts(productsResponse.data);
      } else {
        console.log("Something went wrong while creating product");
      }
      handleClose();
      setFormData({
        name: "",
        img: "",
        description: "",
        price: "",
        inStock: "",
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.addProduct}>
      {user && (
        <Button
          title="Add Product"
          onPress={() => {
            handleShow();
            setFormData({
              name: "",
              img: "",
              description: "",
              price: "",
              inStock: "",
            });
            setImageUri(""); // Clear imageUri on show
          }}
        />
      )}
      <Modal visible={show} onRequestClose={handleClose}>
        <View style={styles.modalContent}>
          <Text>Add Product</Text>
          <View>
            <Text>Name</Text>
            <TextInput
              style={styles.input}
              keyboardType="default"
              onChangeText={(text) => handleChange("name", text)}
              value={formData.name}
              placeholder="Enter product name"
            />
            {validated && !formData.name && (
              <Text style={styles.error}>Please enter name</Text>
            )}
          </View>

          <View>
            <Text>Image</Text>
            <Button title="Select Image" onPress={handleImagePicker} />
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.image} />
            ) : null}
            {validated && !formData.img && (
              <Text style={styles.error}>Please select an image</Text>
            )}
          </View>

          <View>
            <Text>Description</Text>
            <TextInput
              style={styles.input}
              keyboardType="default"
              onChangeText={(text) => handleChange("description", text)}
              value={formData.description}
              placeholder="Enter product description"
            />
            {validated && !formData.description && (
              <Text style={styles.error}>Please enter description</Text>
            )}
          </View>

          <View>
            <Text>Price</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              onChangeText={(text) => handleChange("price", text)}
              value={formData.price}
              placeholder="Enter product price"
            />
            {validated && !formData.price && (
              <Text style={styles.error}>Please enter product price</Text>
            )}
          </View>

          <View>
            <Text>In Stock</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              onChangeText={(text) => handleChange("inStock", text)}
              value={formData.inStock}
              placeholder="Enter product in stock"
            />
            {validated && !formData.inStock && (
              <Text style={styles.error}>Please enter product in stock</Text>
            )}
          </View>

          <View style={styles.buttonContainer}>
            <Button title="Close" onPress={handleClose} />
            <Button title="Save" onPress={handleSubmit} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  addProduct: {
    margin: 15,
  },
  modalContent: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  error: {
    color: "red",
  },
  image: {
    width: 100,
    height: 100,
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
});
