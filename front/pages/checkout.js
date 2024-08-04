import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Modal,
  Alert,
} from "react-native";
import { Button } from "react-native-elements";
import axios from "axios";
import { useUserContext } from "../utils/userContext";
import CartPopoverProduct from "../components/CartPopoverProduct";

export default function CheckoutPage() {
  const { user, cart, setCart, api } = useUserContext();
  const [totalPrice, setTotalPrice] = useState(0);
  const [updateCartModal, setUpdateCartModal] = useState(false);
  const [checkCart, setCheckCart] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async (productId) => {
    try {
      const response = await axios.delete(
        `${api}/users/removeFromCart/${productId}`,
        { data: { userId: user._id } }
      );
      if (!response) console.log("something went wrong while deleting product");
      else if (response.data === "Product not found")
        console.log("Product not found");
      else if (response.data === "User not found")
        console.log("User not found");
      else if (response.status === 200) {
        const newCart = cart.filter((item) => item._id !== productId);
        setCart(newCart);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${api}/orders/create`, {
        userId: user._id,
        items: cart,
        totalPrice: totalPrice,
      });
      if (response.status === 200) {
        setCart([]);
        setCheckCart(true);
        setUpdateCartModal(true);
        for (let product of cart) {
          await axios.delete(`${api}/users/removeFromCart/${product._id}`, {
            data: { userId: user._id },
          });
        }
      }
    } catch (error) {
      console.error("Error creating order:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    let total = 0;
    for (let product of cart) {
      total += product.price * product.qty;
    }
    setTotalPrice(total);
  }, [cart]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Checkout</Text>
      <View style={styles.cartContainer}>
        <Text style={styles.cartTitle}>Cart</Text>
        {cart.length > 0 ? (
          <FlatList
            data={cart}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <CartPopoverProduct key={item._id} item={item} />
            )}
          />
        ) : (
          <Text>No items in cart</Text>
        )}
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total:</Text>
          <Text style={styles.totalText}>${totalPrice}</Text>
        </View>
        <Button
          title="Checkout"
          onPress={handleCheckout}
          disabled={cart.length === 0}
        />
      </View>
      <Modal
        visible={updateCartModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setUpdateCartModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Order created successfully! Thank you for shopping with us!
            </Text>
            <Button
              title="Close"
              onPress={() => {
                setUpdateCartModal(false);
                if (checkCart) setCheckCart(false);
              }}
            />
          </View>
        </View>
      </Modal>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="blue" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 20,
  },
  cartContainer: {
    width: "100%",
    borderWidth: 1,
    borderColor: "black",
    marginBottom: 20,
  },
  cartTitle: {
    fontSize: 20,
    marginVertical: 10,
    alignSelf: "center",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginVertical: 20,
  },
  totalText: {
    fontSize: 20,
  },
});
