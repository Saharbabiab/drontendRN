import React from "react";
import { UserProvider, useUserContext } from "./utils/userContext";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomePage from "./pages/HomeScreen";
import LoginPage from "./pages/Login";
import SignUpPage from "./pages/signuplogin";
import ProductsPage from "./pages/products";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomePage} />
          <Stack.Screen name="Login" component={LoginPage} />
          <Stack.Screen name="SignUp" component={SignUpPage} />
          <Stack.Screen name="Products" component={ProductsPage} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}
