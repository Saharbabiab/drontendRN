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

export default function SignUpPage() {
  const { user, setUser, setCart } = useUserContext();
  const navigation = useNavigation();

  useEffect(() => {
    if (user) {
      navigation.navigate("Home");
    }
  }, [user]);

  const [action, setAction] = useState("login");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
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
      if (action === "login") {
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
          setCart(response.data.cart);
        }
      } else {
        const response = await axios.post(
          "http://localhost:3001/api/users/signup",
          formData
        );
        setAction("login");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {action === "login" ? "Login" : "Sign Up"}
      </Text>
      <View style={styles.formContainer}>
        {action === "signup" && (
          <View style={styles.formGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              value={formData.name}
              onChangeText={(value) => handleChange("name", value)}
              required
            />
          </View>
        )}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your username"
            value={formData.username}
            onChangeText={(value) => handleChange("username", value)}
            required
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            value={formData.password}
            onChangeText={(value) => handleChange("password", value)}
            secureTextEntry
            required
          />
        </View>
        <Button
          title={action === "login" ? "Login" : "Sign Up"}
          onPress={handleSubmit}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TouchableOpacity
          onPress={() => setAction(action === "login" ? "signup" : "login")}
        >
          <Text style={styles.toggleText}>
            {action === "login"
              ? "Don't have an account? Sign Up"
              : "Already have an account? Login"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
  },
  formGroup: {
    width: "100%",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
  toggleText: {
    color: "blue",
    marginTop: 20,
    textDecorationLine: "underline",
  },
});
