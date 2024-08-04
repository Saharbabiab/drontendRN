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

export default function SignUpPage({ navigation }) {
  const { user, setUser, setCart, api } = useUserContext();

  useEffect(() => {
    if (user) {
      navigation.navigate("Home");
    }
  }, [user]);

  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    password: "",
  });

  const handleChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.username || !formData.name || !formData.password) {
      setError("Please fill out all fields");
      return;
    }
    if (formData.password.length < 5) {
      setError("Password must be at least 5 characters");
      return;
    } else if (formData.password.length > 20) {
      setError("Password must be less than 20 characters");
      return;
    }
    try {
      const response = await axios.post(`${api}/users/signup`, {
        username: formData.username,
        name: formData.name,
        password: formData.password,
      });
      if (response.data == "username already exists") {
        setError("username already exists");
      } else {
        setUser(response.data);
        const res = await axios.get(`${api}/users/getCart`);
        setCart(res.data);
        navigation.navigate("Home");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        onChangeText={(text) => handleChange("username", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="name"
        onChangeText={(text) => handleChange("name", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={(text) => handleChange("password", text)}
      />
      <Button title="Sign Up" onPress={handleSubmit} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.subheading}>Already have an account? Login</Text>
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
    color: "blue",
  },
  subheading: {
    fontSize: 20,
    color: "green",
  },
  input: {
    width: 200,
    margin: 10,
    padding: 10,
    borderWidth: 1,
  },
  error: {
    color: "red",
  },
});
