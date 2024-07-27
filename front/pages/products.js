import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from "react-native";
import axios from "axios";
import useNavigation from "@react-navigation/native";
import { Button } from "react-native-elements";
import { Picker } from "@react-native-picker/picker";
import { useUserContext } from "../utils/userContext";
import ProductCard from "../components/ProductCard";
import AddProduct from "../components/AddProduct";
import MyPagination from "../components/MyPagination";

export default function ProductsPage({ navigation }) {
  const { user } = useUserContext();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [sort, setSort] = useState("default");

  const handleChange = (itemValue) => {
    setSort(itemValue);
  };

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/products/getProductsByPageAndSort/${page}/${sort}`
        );
        if (!response)
          return console.log("something went wrong while getting products");
        setProducts(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    setIsLoading(true);
    getProducts();
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, [page, sort]);

  useEffect(() => {
    setTotalPages(Math.ceil(totalProducts / 6));
  }, [totalProducts]);

  useEffect(() => {
    const getTotalProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/products/getTotalProducts"
        );
        if (!response)
          return console.log(
            "something went wrong while getting total products"
          );
        setTotalProducts(response.data);
        setTotalPages(Math.ceil(response.data / 6));
      } catch (err) {
        console.log(err);
      }
    };
    getTotalProducts();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Products</Text>
      <View style={styles.headerContainer}>
        <Picker
          selectedValue={sort}
          style={styles.picker}
          onValueChange={handleChange}
        >
          <Picker.Item label="Best Selling" value="best-selling" />
          <Picker.Item label="Newest" value="newest" />
          <Picker.Item label="Oldest" value="oldest" />
          <Picker.Item label="Price Ascending" value="price-asc" />
          <Picker.Item label="Price Descending" value="price-desc" />
          <Picker.Item label="Default" value="default" />
        </Picker>
        <AddProduct
          products={products}
          setProducts={setProducts}
          setTotalProducts={setTotalProducts}
        />
      </View>
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={styles.spinner}
        />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.productCardContainer}>
              <ProductCard product={item} setProducts={setProducts} />
            </View>
          )}
          contentContainerStyle={styles.productsContainer}
        />
      )}
      <View style={styles.paginationContainer}>
        <MyPagination page={page} setPage={setPage} totalPages={totalPages} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: 150,
  },
  spinner: {
    marginVertical: 20,
  },
  productsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  productCardContainer: {
    width: "45%",
    padding: 10,
  },
  paginationContainer: {
    padding: 25,
  },
});
