import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useUserContext } from "../utils/userContext";
import ShoppingCart from "./ShoppingCart";

export default function Navbar() {
  const navigation = useNavigation();
  const buttons = [
    { name: "Home", route: "Home", userRequired: null },
    { name: "Login", route: "SignUpLogin", userRequired: false },
    { name: "Profile", route: "Profile", userRequired: true },
    { name: "Products", route: "Products", userRequired: null },
    {
      name: "Logout",
      userRequired: true,
      onClick: () => {
        setUser(null);
        navigation.navigate("Home");
      },
    },
  ];

  const [selected, setSelected] = useState("Home");
  const [cartDisabled, setCartDisabled] = useState(false);
  const { user, setUser, cart } = useUserContext();

  const handleClick = (name) => {
    setSelected(name);
  };

  useEffect(() => {
    const routeName =
      navigation.getState().routes[navigation.getState().index].name;
    const initialSelected =
      buttons.find((button) => button.route === routeName)?.name || "Home";
    setSelected(initialSelected);
    setCartDisabled(routeName === "Checkout");
  }, [navigation]);

  return (
    <View style={styles.navbar}>
      <View style={styles.navContainer}>
        {buttons.map((b) => {
          if (b.userRequired === true && user === null) {
            return null;
          } else if (b.userRequired === false && user !== null) {
            return null;
          } else {
            return (
              <TouchableOpacity
                style={styles.link}
                onPress={() => {
                  handleClick(b.name);
                  if (b.onClick) {
                    b.onClick();
                  } else {
                    navigation.navigate(b.route);
                  }
                }}
                key={b.name}
              >
                <Text style={{ color: selected === b.name ? "black" : "grey" }}>
                  {b.name}
                </Text>
              </TouchableOpacity>
            );
          }
        })}
        {!cartDisabled && (
          <View style={styles.cartDiv}>
            <ShoppingCart />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    height: 60,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  navContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  link: {
    marginHorizontal: 10,
  },
  cartDiv: {
    marginLeft: "auto",
  },
});
