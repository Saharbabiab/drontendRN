import React, { useState } from "react";
import { View, Text, TextInput, Button, Modal } from "react-native";
import axios from "axios";
import FormGroup from "./FormGroup";
import { useUserContext } from "../utils/userContext";

export default function AddProduct({
  products,
  setProducts,
  setTotalProducts,
}) {
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
  };

  const handleChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]:
        name === "price" || name === "inStock" ? parseFloat(value) : value,
    }));
    console.log(formData);
  };

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
        setTotalProducts((prevTotal) => prevTotal + 1);
        if (products.length < 6) setProducts([...products, response.data]);
      }
      handleClose();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.addProduct}>
      {user && user.admin == true && (
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
          <FormGroup
            label={"Name"}
            type={"text"}
            name={"name"}
            required={true}
            value={formData.name}
            onChange={handleChange}
            autoFocus={true}
            feedback={"Please enter name"}
            placeholder={"Enter product name"}
          />
          <FormGroup
            label={"Image Link"}
            type={"text"}
            name={"img"}
            required={true}
            value={formData.img}
            onChange={handleChange}
            feedback={"Please enter image link"}
            placeholder={"Enter image link"}
          />
          <FormGroup
            label={"Description"}
            type={"textarea"}
            name={"description"}
            required={true}
            value={formData.description}
            onChange={handleChange}
            feedback={"Please enter description"}
            placeholder={"Enter product description"}
          />
          <FormGroup
            label={"Price"}
            type={"number"}
            name={"price"}
            required={true}
            value={formData.price}
            onChange={handleChange}
            feedback={"Please enter price"}
            placeholder={"Enter product price"}
          />
          <FormGroup
            label={"In Stock"}
            type={"number"}
            name={"inStock"}
            required={true}
            value={formData.inStock}
            onChange={handleChange}
            feedback={"Please enter in stock"}
            placeholder={"Enter product in stock"}
          />
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
};
