import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Button,
  Alert,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useUserContext } from "../../utils/userContext";
import OrderItem from "../../components/OrderItem";

export default function Order() {
  const { user } = useUserContext();
  const navigation = useNavigation();
  const route = useRoute();
  const { orderId } = route.params;
  const [order, setOrder] = useState({});

  useEffect(() => {
    if (!user) navigation.navigate("SignupLogin");

    if (user && !user.orders.includes(orderId)) navigation.navigate("Home");

    const getOrder = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/orders/getOrderById/${orderId}`
        );
        if (!response.data)
          return console.log("something went wrong while getting order");
        setOrder(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    if (orderId) {
      getOrder();
    }
  }, [orderId]);

  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(2);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year}, ${hours}:${minutes}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Summary</Text>
      <View style={styles.orderInfo}>
        <Text style={styles.orderText}>Order ID: {order._id}</Text>
        <Text style={styles.orderText}>
          Order Date: {order.createdAt && formatDate(order.createdAt)}
        </Text>
      </View>
      <View style={styles.itemsContainer}>
        <Text style={styles.itemsTitle}>Items:</Text>
        <FlatList
          data={order.items}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <OrderItem
              key={item._id}
              productId={item.productId}
              qty={item.qty}
            />
          )}
        />
      </View>
      <View style={styles.totalContainer}>
        <Text style={styles.totalPrice}>Total Price: {order.totalPrice}$</Text>
        <View style={styles.buttonContainer}>
          <Button title="Go Home" onPress={() => navigation.navigate("Home")} />
          <Button
            title="Back to Profile"
            onPress={() => navigation.navigate("Profile")}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    alignSelf: "center",
    color: "#007bff",
  },
  orderInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
    width: "100%",
  },
  orderText: {
    fontSize: 16,
  },
  itemsContainer: {
    width: "100%",
  },
  itemsTitle: {
    fontSize: 20,
    marginBottom: 10,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  totalPrice: {
    fontSize: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "50%",
  },
});
