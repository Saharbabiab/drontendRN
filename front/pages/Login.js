import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { useUserContext } from "../utils/userContext";
import { useNavigation } from "@react-navigation/native";

export default function LoginPage({ navigation }) {
  const { user, setUser, setCart } = useUserContext();

  useEffect(() => {
    if (user) {
      navigation.navigate("Home");
    }
  }, [user]);

  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/users/login",
        formData
      );
      if (response.data == "username is incorrect") {
        setError("username is incorrect");
      } else if (response.data == "password is incorrect") {
        setError("password is incorrect");
      } else {
        setUser(response.data);
        const res = await axios.get("http://localhost:3001/api/users/getCart");
        setCart(res.data);
        console.log(res.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        onChangeText={(text) => handleChange("username", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={(text) => handleChange("password", text)}
        secureTextEntry
      />
      <Button title="Login" onPress={handleSubmit} />
      <Text style={styles.error}>{error}</Text>
      <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
        <Text style={styles.link}>Don't have an account? Sign up here</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: "80%",
    padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "black",
  },
  error: {
    color: "red",
    marginBottom: 20,
  },
  link: {
    color: "blue",
  },
});
