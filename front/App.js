import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { UserProvider } from "./utils/userContext";
import Navbar from "./components/Navbar"; // Make sure Navbar is compatible with React Native

export default function App({ Component, pageProps }) {
  return (
    <UserProvider>
      <View style={styles.container}>
        <Navbar />
        <Text>My App</Text>
        <Component {...pageProps} />
      </View>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
