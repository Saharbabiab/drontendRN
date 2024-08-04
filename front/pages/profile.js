import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
} from "react-native";
import axios from "axios";
import { useUserContext } from "../utils/userContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import dayjs from "dayjs";

export default function ProfilePage({ navigation }) {
  const { user, setUser, api } = useUserContext();
  const [orders, setOrders] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [openEditMessage, setOpenEditMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [editMessage, setEditMessage] = useState("");
  const [severity, setSeverity] = useState("success");
  const [title, setTitle] = useState("success");
  const [startD, setStartD] = useState(new Date("2024-02-01"));
  const [endD, setEndD] = useState(new Date());
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [showDatePickerstart, setShowDatePickerstart] = useState(false);
  const [showDatePickerend, setShowDatePickerend] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value || "", // Ensure that value is always a string
    }));
  };

  const handleEditOpen = () => {
    setFormData({
      name: user.name || "", // Ensure name is a string
      password: "",
      newPassword: "",
      confirmNewPassword: "",
    });
    setShowEditModal(true);
  };

  const handleNameChange = async () => {
    try {
      if (formData.name === user.name) return;

      const response = await axios.put(`${api}/users/updateName/`, {
        userId: user._id,
        name: formData.name,
      });

      if (!response) {
        console.log("something went wrong while updating name");
        return;
      }

      setUser({ ...user, name: formData.name });
      setSeverity("success");
      setTitle("Success");
      setMessage("Name updated successfully");
      setOpenEditMessage(true);
      setTimeout(() => {
        setOpenEditMessage(false);
      }, 3000);
    } catch (err) {
      console.log(err);
    }
  };

  const handlePasswordChange = async () => {
    if (formData.newPassword !== formData.confirmNewPassword) {
      setEditMessage("Passwords do not match");
      setSeverity("error");
      setTitle("Error");
      setOpenEditMessage(true);
      setTimeout(() => {
        setOpenEditMessage(false);
      }, 2000);
      return;
    }

    try {
      const response = await axios.put(`${api}/users/updatePassword/`, {
        userId: user._id,
        oldPw: formData.password,
        newPw: formData.newPassword,
      });

      if (!response) {
        setShowEditModal(false);
        setSeverity("error");
        setTitle("Error");
        setMessage("Something went wrong while updating password");
        setOpenEditMessage(true);
        setTimeout(() => {
          setOpenEditMessage(false);
        }, 2000);
        return;
      }

      if (response.data === "old password is not correct") {
        setSeverity("error");
        setTitle("Error");
        setEditMessage("Old password is incorrect");
        setOpenEditMessage(true);
        setTimeout(() => {
          setOpenEditMessage(false);
        }, 2000);
        return;
      }

      setShowEditModal(false);
      setMessage("Password updated successfully");
      setSeverity("success");
      setTitle("Success");
      setOpenEditMessage(true);
      setTimeout(() => {
        setOpenEditMessage(false);
      }, 3000);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    let total = 0;
    if (orders && orders.length) {
      for (let i = 0; i < orders.length; i++) {
        total += orders[i].totalPrice;
      }
    }
    setTotalPrice(total);
  }, [orders]);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const response = await axios.get(
          `${api}/users/getOrdersByIdAndDates/${
            user._id
          }/${startD.getTime()}/${endD.getTime()}`
        );

        if (!response) {
          console.log("something went wrong while getting orders");
          return;
        }

        setOrders(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    if (!user) {
      navigation.navigate("SignupLogin");
    } else {
      setFormData({
        name: user.name || "", // Ensure name is a string
        password: "",
        newPassword: "",
      });
      getOrders();
    }
  }, [user, startD, endD]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      {openEditMessage && (
        <View style={styles.alertContainer}>
          <Text
            style={[
              styles.alertText,
              severity === "success" ? styles.success : styles.error,
            ]}
          >
            {title}: {message}
          </Text>
        </View>
      )}
      <View style={styles.infoContainer}>
        <Text style={styles.subTitle}>Personal Info</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={formData.name}
          onChangeText={(value) => handleChange("name", value)}
        />
        <View style={styles.buttonContainer}>
          <Button title="Save" onPress={handleNameChange} />
          <Button title="Edit Password" onPress={handleEditOpen} />
        </View>
        <Modal
          visible={showEditModal}
          animationType="slide"
          onRequestClose={() => setShowEditModal(false)}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Current Password"
              secureTextEntry
              value={formData.password || ""} // Ensure password is a string
              onChangeText={(value) => handleChange("password", value)}
            />
            <TextInput
              style={styles.input}
              placeholder="New Password"
              secureTextEntry
              value={formData.newPassword || ""} // Ensure newPassword is a string
              onChangeText={(value) => handleChange("newPassword", value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm New Password"
              secureTextEntry
              value={formData.confirmNewPassword || ""} // Ensure confirmNewPassword is a string
              onChangeText={(value) =>
                handleChange("confirmNewPassword", value)
              }
            />
            {openEditMessage && (
              <View style={styles.alertContainer}>
                <Text
                  style={[
                    styles.alertText,
                    severity === "error" ? styles.error : styles.success,
                  ]}
                >
                  {title}: {editMessage}
                </Text>
              </View>
            )}
            <Button title="Save" onPress={handlePasswordChange} />
            <Button title="Close" onPress={() => setShowEditModal(false)} />
          </View>
        </Modal>
      </View>
      <View style={styles.ordersContainer}>
        <Text style={styles.subTitle}>My Orders</Text>
        <View style={styles.datePickers}>
          <Button
            title="Start Date"
            onPress={() => setShowDatePickerstart(true)}
          />
          {showDatePickerstart && (
            <DateTimePicker
              value={startD}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setStartD(selectedDate || startD);
                setShowDatePickerstart(false);
              }}
            />
          )}
          <Button title="End Date" onPress={() => setShowDatePickerend(true)} />
          {showDatePickerend && (
            <DateTimePicker
              value={endD}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setEndD(selectedDate || endD);
                setShowDatePickerend(false);
              }}
            />
          )}
        </View>

        <FlatList
          data={orders}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity>
              <View style={styles.orderItem}>
                <Text>Order ID: {item._id}</Text>
                <Text>
                  Total Products: {item.items ? item.items.length : 0}
                </Text>
                <Text>Total Price: ${item.totalPrice}</Text>
                <Text>
                  Date: {dayjs(item.createdAt).format("DD/MM/YY, HH:mm")}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
        <Text>Total: ${totalPrice.toFixed(2)}</Text>
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
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  subTitle: {
    fontSize: 20,
    marginBottom: 10,
  },
  infoContainer: {
    width: "100%",
  },
  input: {
    borderWidth: 1,
    borderColor: "black",
    padding: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
  },
  alertContainer: {
    padding: 10,
    marginVertical: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  alertText: {
    fontSize: 16,
  },
  success: {
    color: "green",
  },
  error: {
    color: "red",
  },
  ordersContainer: {
    width: "100%",
  },
  orderItem: {
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
  },
  datePickers: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
});
