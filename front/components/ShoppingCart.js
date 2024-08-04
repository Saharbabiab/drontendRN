import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-native";
import { useUserContext } from "../utils/userContext";
import CartPopoverProduct from "./CartPopoverProduct";
import axios from "axios";
import { View, Text, ScrollView, StyleSheet } from "react-native";

const ShoppingCart = () => {
  const { user, cart, setCart, api } = useUserContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartProducts, setCartProducts] = useState([]);

  useEffect(() => {
    const getCart = async () => {
      try {
        const response = await axios.get(`${api}/users/getCart/${user._id}`);
        setCart(response.data);
        setCartProducts(response.data);
        const total = response.data
          .map((product) => product.price * product.qty)
          .reduce((a, b) => a + b, 0);
        setCartTotal(total);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    if (user) {
      getCart();
    }
  }, [user]);

  const toggleModal = () => {
    setModalVisible((prev) => !prev);
  };

  return (
    <>
      <Button title={`Cart: $${cartTotal}`} onPress={toggleModal} />
      <Modal
        visible={modalVisible}
        onRequestClose={toggleModal}
        animationType="slide"
      >
        <View style={styles.container}>
          <Text style={styles.title}>Shopping Cart</Text>
          <ScrollView>
            {cartProducts.map((product, i) => (
              <CartPopoverProduct item={product} key={i} />
            ))}
          </ScrollView>
          <Button title="Close" onPress={toggleModal} />
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
});

export default ShoppingCart;
