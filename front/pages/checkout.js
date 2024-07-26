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
import { useNavigation, useRoute } from "@react-navigation/native";
import { useUserContext } from "../utils/userContext";
import CartPopoverProduct from "../components/CartPopoverProduct";

export default function CheckoutPage() {
  const { user, cart, setCart } = useUserContext();
  const navigation = useNavigation();
  const route = useRoute();
  const [totalPrice, setTotalPrice] = useState(0);
  const [updateCartModal, setUpdateCartModal] = useState(false);
  const [checkCart, setCheckCart] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async (productId) => {
    try {
      const response = await axios.delete(
        `http://localhost:3001/api/users/removeFromCart/${productId}`,
        { data: { userId: user._id } }
      );
      if (!response) console.log("something went wrong while deleting product");
      else if (response.data === "Product not found")
        console.log("Product not found");
      else if (response.data === "User not found")
        console.log("User not found");
      else if (response.status === 200) {
        const newCart = cart.filter((item) => item.productId !== productId);
        setCart(newCart);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  useEffect(() => {
    if (user === null) {
      navigation.navigate("SignupLogin");
    } else {
      cart.map(async (p) => {
        const productDetails = await getProduct(p.productId);
        if (
          !productDetails ||
          productDetails.inStock == 0 ||
          productDetails.inStock < p.qty ||
          productDetails == 404
        ) {
          setUpdateCartModal(true);
        }
      });
    }
  }, [user, cart, checkCart]);

  const updateCart = async () => {
    const updatedCart = [];
    for (const product of cart) {
      try {
        const productDetails = await getProduct(product.productId);
        if (
          !productDetails ||
          productDetails.inStock === 0 ||
          productDetails === 404
        ) {
          await handleDelete(product.productId);
        } else if (productDetails.inStock < product.qty) {
          const newQty =
            productDetails.inStock > 0 ? productDetails.inStock : 0;
          updatedCart.push({ productId: product.productId, qty: newQty });
        } else {
          updatedCart.push(product);
        }
        const res = await axios.put(
          "http://localhost:3001/api/users/updateCart",
          { userId: user._id, cart: updatedCart }
        );
        if (res.data == "User not found") console.log("user not found");
      } catch (error) {
        console.error("Error updating cart:", error);
      }
    }
    setCart(updatedCart);
    setUpdateCartModal(false);
    setCheckCart(false);
  };

  const handleProceedToPay = async () => {
    setCheckCart(true);
    if (checkCart === false) {
      try {
        setLoading(true);
        const newOrder = await axios.post(
          "http://localhost:3001/api/orders/create",
          { items: cart, totalPrice: totalPrice }
        );
        if (newOrder.status === 200) {
          setCart([]);
          const updateUser = [
            await axios.put("http://localhost:3001/api/users/updateCart", {
              userId: user._id,
              cart: [],
            }),
            await axios.put(
              `http://localhost:3001/api/users/addOrder/${newOrder.data._id}`,
              {
                userId: user._id,
              }
            ),
          ];
          user.orders.push(newOrder.data._id);
          Promise.all(updateUser)
            .then(() => {
              console.log("user updated");
            })
            .catch((error) => {
              console.error("Error updating user:", error);
            });

          setTimeout(() => {
            setLoading(false);
            navigation.navigate("Order", { orderId: newOrder.data._id });
          }, 2000);
        }
      } catch (error) {
        console.error("Error creating order:", error);
        setLoading(false);
      }
    }
  };

  const getProduct = async (productId) => {
    try {
      const res = await axios.get(
        `http://localhost:3001/api/products/getById/${productId}`
      );
      return res.data;
    } catch (error) {
      console.error("Error fetching product:", error);
      return error.response.status;
    }
  };

  useEffect(() => {
    if (user) {
      let total = 0;
      const productPromises = cart.map(async (p) => {
        const productDetails = await getProduct(p.productId);
        if (productDetails) total += productDetails.price * p.qty;
      });
      Promise.all(productPromises).then(() => {
        setTotalPrice(total);
      });
    }
  }, [user, cart]);

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
      <Modal
        visible={updateCartModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setUpdateCartModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Cart</Text>
            <Text>Some products are unavailable</Text>
            <Text>
              Unfortunately, some products in your cart ran out of stock or are
              unavailable. Please update your cart and try again.
            </Text>
            <Button title="Update" onPress={updateCart} />
          </View>
        </View>
      </Modal>
      <Text style={styles.title}>Checkout Page</Text>
      <View style={styles.cartContainer}>
        <Text style={styles.cartTitle}>Cart ({cart.length} Products)</Text>
        <FlatList
          data={cart}
          keyExtractor={(item) => item.productId}
          renderItem={({ item }) => (
            <CartPopoverProduct
              key={item.productId}
              productId={item.productId}
              qty={item.qty}
            />
          )}
        />
      </View>
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total: {totalPrice}$</Text>
        <Button
          title="Proceed to Pay"
          onPress={handleProceedToPay}
          disabled={cart.length === 0}
        />
      </View>
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
