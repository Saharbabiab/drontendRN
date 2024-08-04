import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, ScrollView } from "react-native";
import axios from "axios";
import { useUserContext } from "../utils/userContext";
import ProductCard from "../components/ProductCard";
import AddProduct from "../components/AddProduct";
import { Button } from "react-native-elements";

export default function ProductsPage() {
  const { user, api } = useUserContext();
  const [products, setProducts] = useState([]);
  const [showAddProduct, setShowAddProduct] = useState(false);

  useEffect(() => {
    axios.get(`${api}/products/getProducts`).then((response) => {
      setProducts(response.data);
      console.log(response.data);
    });
  }, [showAddProduct]);

  return (
    <ScrollView contentContainerStyle={styles.scrollStyle}>
      <AddProduct
        setShowAddProduct={setShowAddProduct}
        setProducts={setProducts}
      />

      <Text style={styles.heading}>Products</Text>
      {products != null ? (
        <FlatList
          horizontal={true}
          data={products}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <ProductCard
              key={item._id}
              product={item}
              setProducts={setProducts}
            />
          )}
        />
      ) : (
        <Text>No products found</Text>
      )}
    </ScrollView>
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
  listStyle: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  quantityText: {
    margin: 10,
  },
  scrollStyle: {
    flexGrow: 1,
  },
});
