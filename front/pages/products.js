import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, ScrollView } from "react-native";
import axios from "axios";
import { useUserContext } from "../utils/userContext";
import ProductCard from "../components/ProductCard";
import AddProduct from "../components/AddProduct";
import { Button } from "react-native-elements";

export default function ProductsPage() {
  const { user } = useUserContext();
  const [products, setProducts] = useState([]);
  const [showAddProduct, setShowAddProduct] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/api/products/getProducts`)
      .then((response) => {
        setProducts(response.data);
        console.log(response.data);
      });
  }, [showAddProduct]);

  return (
    <View>
      <AddProduct
        setShowAddProduct={setShowAddProduct}
        setProducts={setProducts}
      />
      <ScrollView style={styles.scrollStyle}>
        <Text style={styles.heading}>Products</Text>
        <View style={styles.productsContainer}>
          {products != null ? (
            <FlatList
              data={products}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <ProductCard product={item} setProducts={setProducts} />
              )}
            />
          ) : (
            <Text>No products found</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 15,
    justifyContent: "space-around",
    alignItems: "center",
  },
  heading: {
    fontSize: 24,
    color: "blue",
  },
  addProduct: {
    justifyContent: "center",
    alignItems: "center",
  },
  productsContainer: {
    flexDirection: "column",
    margin: 15,
    width: "100%",
    alignItems: "center",
    justifyContent: "space-evenly",
    flexWrap: "wrap",
    flex: 3,
  },
  productContainer: {
    alignItems: "center",
    flexDirection: "row",
    width: "20%",
    flex: 1,
  },
  quantityText: {
    margin: 10,
  },
  scrollStyle: {
    height: "100%",
    width: "100%",
    flex: 5,
    flexDirection: "row",
  },
});
