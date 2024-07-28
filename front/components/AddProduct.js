import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, Modal } from "react-native";
import axios from "axios";
import FormGroup from "./FormGroup";
import { useUserContext } from "../utils/userContext";

export default function AddProduct({ setShowAddProduct, setProducts }) {
  const { user } = useUserContext();
  const [show, setShow] = useState(false);
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    img: "",
    description: "",
    price: 0,
    inStock: 0,
  });

  const handleShow = () => {
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setValidated(false);
    setShowAddProduct(false);
  };

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    console.log(formData);
  };
  useEffect(() => {}, [show]);

  const handleSubmit = async () => {
    if (validated === false) {
      setValidated(true);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/api/products/create",
        {
          name: formData.name,
          img: formData.img,
          description: formData.description,
          price: formData.price,
          inStock: formData.inStock,
        }
      );
      if (!response) console.log("something went wrong while creating product");
      console.log(response);
      if (response.status === 200) {
        const productsResponse = await axios.get(
          "http://localhost:3001/api/products/getProducts"
        );
        if (!productsResponse)
          console.log("something went wrong while fetching products");
        console.log(productsResponse.data);
        setProducts(productsResponse.data);
      } else {
        console.log("something went wrong while creating product");
      }
      handleClose();
      setFormData({
        name: "",
        img: "",
        description: "",
        price: 0,
        inStock: 0,
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
              price: 0,
              inStock: 0,
            });
          }}
        />
      )}
      <Modal visible={show} onRequestClose={handleClose}>
        <View>
          <Text>Add Product</Text>
        </View>
        <View>
          <View>
            <Text>Name</Text>
            <TextInput
              style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
              keyboardType={"text"}
              onChangeText={(text) => handleChange("name", text)}
              value={formData.name}
              required={true}
              autoFocus={true}
              placeholder={"Enter product name"}
            />
            {validated && !formData.name && (
              <Text style={{ color: "red" }}>Please enter name</Text>
            )}
          </View>

          <View>
            <Text>Image Link</Text>
            <TextInput
              style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
              keyboardType={"text"}
              onChangeText={(text) => handleChange("img", text)}
              value={formData.img}
              required={true}
              autoFocus={true}
              placeholder={"Enter image link"}
            />
            {validated && !formData.img && (
              <Text style={{ color: "red" }}>Please enter image link</Text>
            )}
          </View>

          <View>
            <Text>Description</Text>
            <TextInput
              style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
              keyboardType={"text"}
              onChangeText={(text) => handleChange("description", text)}
              value={formData.description}
              required={true}
              autoFocus={true}
              placeholder={"Enter product description"}
            />
            {validated && !formData.description && (
              <Text style={{ color: "red" }}>Please enter description</Text>
            )}
          </View>

          <View>
            <Text>Price</Text>
            <TextInput
              style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
              keyboardType={"number-pad"}
              onChangeText={(text) => handleChange("price", text)}
              value={formData.price}
              required={true}
              autoFocus={true}
              placeholder={"Enter product price"}
            />
            {validated && !formData.description && (
              <Text style={{ color: "red" }}>Please enter product price</Text>
            )}
          </View>

          <View>
            <Text>In Stock</Text>
            <TextInput
              style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
              keyboardType={"number-pad"}
              onChangeText={(text) => handleChange("inStock", text)}
              value={formData.inStock}
              required={true}
              autoFocus={true}
              placeholder={"Enter product in stock"}
            />
            {validated && !formData.description && (
              <Text style={{ color: "red" }}>
                Please enter product in stock
              </Text>
            )}
          </View>
        </View>
        <View>
          <Button title="Close" onPress={handleClose} />
          <Button title="Save" onPress={handleSubmit} />
        </View>
      </Modal>
    </View>
  );
}

const styles = {
  addProduct: {
    margin: 15,
  },
  container: {
    paddingVertical: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(0, 0, 0, 0.92)",
  },
  inactiveDot: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
};
