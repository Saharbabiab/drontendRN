// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   Button,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   Alert,
//   Modal,
// } from "react-native";
// import axios from "axios";
// import { useUserContext } from "../utils/userContext";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import dayjs from "dayjs";

// export default function Profile({ navigation }) {
//   const { user, setUser } = useUserContext();
//   const [orders, setOrders] = useState([]);
//   const [totalPrice, setTotalPrice] = useState(0);
//   const [openEditMessage, setOpenEditMessage] = useState(false);
//   const [message, setMessage] = useState("");
//   const [editMessage, setEditMessage] = useState("");
//   const [severity, setSeverity] = useState("success");
//   const [title, setTitle] = useState("success");
//   const [topBuyer, setTopBuyer] = useState({});
//   const [startD, setStartD] = useState(new Date("2024-02-01"));
//   const [endD, setEndD] = useState(new Date());
//   const [formData, setFormData] = useState({
//     name: "",
//     password: "",
//     newPassword: "",
//     confirmNewPassword: "",
//   });
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [isTopBuyer, setIsTopBuyer] = useState(false);

//   const handleChange = (name, value) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleEditOpen = () => {
//     setFormData({
//       name: user.name,
//       password: "",
//       newPassword: "",
//       confirmNewPassword: "",
//     });
//     setShowEditModal(true);
//   };

//   const handleNameChange = async () => {
//     try {
//       if (formData.name === user.name) return;

//       const response = await axios.put(
//         `http://localhost:3001/api/users/updateName/`,
//         {
//           userId: user._id,
//           name: formData.name,
//         }
//       );

//       if (!response)
//         return console.log("something went wrong while updating name");
//       setUser({ ...user, name: formData.name });
//       setSeverity("success");
//       setTitle("Success");
//       setMessage("Name updated successfully");
//       setOpenEditMessage(true);
//       setTimeout(() => {
//         setOpenEditMessage(false);
//       }, 3000);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const handlePasswordChange = async () => {
//     if (formData.newPassword !== formData.confirmNewPassword) {
//       setEditMessage("Passwords do not match");
//       setSeverity("error");
//       setTitle("Error");
//       setOpenEditMessage(true);
//       setTimeout(() => {
//         setOpenEditMessage(false);
//       }, 2000);
//       return;
//     }
//     try {
//       const response = await axios.put(
//         `http://localhost:3001/api/users/updatePassword/`,
//         {
//           userId: user._id,
//           oldPw: formData.password,
//           newPw: formData.newPassword,
//         }
//       );

//       if (!response) {
//         setShowEditModal(false);
//         setSeverity("error");
//         setTitle("Error");
//         setMessage("Something went wrong while updating password");
//         setOpenEditMessage(true);
//         setTimeout(() => {
//           setOpenEditMessage(false);
//         }, 2000);
//         return console.log("Something went wrong while updating password");
//       }

//       if (response.data === "old password is not correct") {
//         setSeverity("error");
//         setTitle("Error");
//         setEditMessage("Old password is incorrect");
//         setOpenEditMessage(true);
//         setTimeout(() => {
//           setOpenEditMessage(false);
//         }, 2000);
//         return;
//       }

//       setShowEditModal(false);
//       setMessage("Password updated successfully");
//       setSeverity("success");
//       setTitle("Success");
//       setOpenEditMessage(true);
//       setTimeout(() => {
//         setOpenEditMessage(false);
//       }, 3000);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   useEffect(() => {
//     let total = 0;
//     if (orders) {
//       orders.forEach((o) => {
//         total += o.totalPrice;
//       });
//     }
//     setTotalPrice(total);
//   }, [orders]);

//   useEffect(() => {
//     const getOrders = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:3001/api/users/getOrdersByIdAndDates/${
//             user._id
//           }/${startD.getTime()}/${endD.getTime()}`
//         );
//         if (!response)
//           return console.log("something went wrong while getting orders");
//         setOrders(response.data);
//       } catch (err) {
//         console.log(err);
//       }
//     };

//     if (!user) {
//       navigation.navigate("SignupLogin");
//     } else {
//       setFormData({
//         name: user.name,
//         password: "",
//         newPassword: "",
//       });
//       getOrders();
//     }
//   }, [user, startD, endD]);

//   useEffect(() => {
//     const getTopBuyer = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:3001/api/users/getTopBuyer`
//         );
//         if (!response)
//           return console.log("something went wrong while getting top buyer");
//         setTopBuyer(response.data);
//       } catch (err) {
//         console.log(err);
//       }
//     };

//     getTopBuyer();
//   }, []);

//   useEffect(() => {
//     if (topBuyer[0] && topBuyer[0]._id === user._id) {
//       setIsTopBuyer(true);
//     }
//   }, [topBuyer]);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Profile</Text>
//       {openEditMessage && (
//         <View style={styles.alertContainer}>
//           <Text
//             style={[
//               styles.alertText,
//               severity === "success" ? styles.success : styles.error,
//             ]}
//           >
//             {title}: {message}
//           </Text>
//         </View>
//       )}
//       <View style={styles.infoContainer}>
//         <Text style={styles.subTitle}>Personal Info</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Name"
//           value={formData.name}
//           onChangeText={(value) => handleChange("name", value)}
//         />
//         <View style={styles.buttonContainer}>
//           <Button title="Save" onPress={handleNameChange} />
//           <Button title="Edit Password" onPress={handleEditOpen} />
//         </View>
//         <Modal
//           visible={showEditModal}
//           animationType="slide"
//           onRequestClose={() => setShowEditModal(false)}
//         >
//           <View style={styles.modalContainer}>
//             <Text style={styles.modalTitle}>Edit Password</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Current Password"
//               secureTextEntry
//               value={formData.password}
//               onChangeText={(value) => handleChange("password", value)}
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="New Password"
//               secureTextEntry
//               value={formData.newPassword}
//               onChangeText={(value) => handleChange("newPassword", value)}
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="Confirm New Password"
//               secureTextEntry
//               value={formData.confirmNewPassword}
//               onChangeText={(value) =>
//                 handleChange("confirmNewPassword", value)
//               }
//             />
//             {openEditMessage && (
//               <View style={styles.alertContainer}>
//                 <Text
//                   style={[
//                     styles.alertText,
//                     severity === "error" ? styles.error : styles.success,
//                   ]}
//                 >
//                   {title}: {editMessage}
//                 </Text>
//               </View>
//             )}
//             <Button title="Save" onPress={handlePasswordChange} />
//             <Button title="Close" onPress={() => setShowEditModal(false)} />
//           </View>
//         </Modal>
//         {isTopBuyer && (
//           <View style={styles.alertContainer}>
//             <Text style={styles.alertText}>
//               Congratulations! You are our top buyer, with a total purchase of $
//               {topBuyer[0].totalPurchases}.
//             </Text>
//           </View>
//         )}
//       </View>
//       <View style={styles.ordersContainer}>
//         <Text style={styles.subTitle}>My Orders</Text>
//         <View style={styles.datePickers}>
//           <DateTimePicker
//             value={startD}
//             mode="date"
//             display="default"
//             onChange={(event, date) => setStartD(date)}
//           />
//           <DateTimePicker
//             value={endD}
//             mode="date"
//             display="default"
//             onChange={(event, date) => setEndD(date)}
//           />
//         </View>
//         <FlatList
//           data={orders}
//           keyExtractor={(item) => item._id}
//           renderItem={({ item }) => (
//             <TouchableOpacity
//               onPress={() =>
//                 navigation.navigate("OrderDetails", { orderId: item._id })
//               }
//             >
//               <View style={styles.orderItem}>
//                 <Text>Order ID: {item._id}</Text>
//                 <Text>Total Products: {item.items.length}</Text>
//                 <Text>Total Price: ${item.totalPrice}</Text>
//                 <Text>
//                   Date: {dayjs(item.createdAt).format("DD/MM/YY, HH:mm")}
//                 </Text>
//               </View>
//             </TouchableOpacity>
//           )}
//         />
//         <Text>Total: ${totalPrice.toFixed(2)}</Text>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: "#fff",
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 20,
//     textAlign: "center",
//   },
//   subTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     padding: 10,
//     borderRadius: 5,
//     marginBottom: 10,
//   },
//   buttonContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 20,
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: "center",
//     padding: 20,
//     backgroundColor: "#fff",
//   },
//   modalTitle: {
//     fontSize: 22,
//     fontWeight: "bold",
//     marginBottom: 20,
//   },
//   ordersContainer: {
//     marginTop: 20,
//   },
//   datePickers: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 20,
//   },
//   orderItem: {
//     padding: 15,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 5,
//     marginBottom: 10,
//   },
//   alertContainer: {
//     padding: 10,
//     marginVertical: 10,
//   },
//   alertText: {
//     textAlign: "center",
//   },
//   success: {
//     color: "green",
//   },
//   error: {
//     color: "red",
//   },
// });
