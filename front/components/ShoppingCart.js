import React, { useEffect, useState } from "react";
import { Button, Overlay } from "react-native-elements";
import { useUserContext } from "../utils/userContext";
import CartPopoverProduct from "./CartPopoverProduct";
import axios from "axios";
import { View, Text, ScrollView, StyleSheet } from "react-native";

const ShoppingCart = () => {
  const { user, cart, setCart } = useUserContext();
  const [visible, setVisible] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartProducts, setCartProducts] = useState([]);

  useEffect(() => {
    const getCart = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/users/getCart/${user._id}`
        );
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
  }, [user, cart, setCart]);

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  return (
    <>
      <Button
        title={`Cart: $${cartTotal}`}
        onPress={toggleOverlay}
        type="clear"
      />
      <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Shopping Cart</Text>
          <ScrollView>
            {cartProducts.map((product, i) => (
              <CartPopoverProduct item={product} key={i} />
            ))}
          </ScrollView>
        </View>
      </Overlay>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
});

export default ShoppingCart;
