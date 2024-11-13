import {
  Image,
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import categoriesData from "../data/categoriesData";
import Nav from "../components/Nav";
import { Product } from "../types/interface";

interface ProductsProps {
  navigation: any;
}

export default function Products({ navigation }: ProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://192.168.43.241:4000/api/products/"
        );
        const data: Product[] = response.data.map((product: Product) => ({
          ...product,
        }));
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const Categories = ({ data, navigation }: { data: any; navigation: any }) => (
    <TouchableOpacity style={styles.circleWrapper}>
      <View style={styles.circle}>
        <Image source={data.image} style={styles.img} />
      </View>
      <Text style={styles.textCat}>{data.name}</Text>
    </TouchableOpacity>
  );

  const renderProductItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productCardContainer}
      onPress={() =>
        navigation.navigate("ProductDetail", { productId: item.id })
      }
    >
      <Image style={styles.productImage} source={{ uri: item.image1 }} />
      <View style={styles.productDetails}>
        <Text style={styles.productCategory}>{item.category}</Text>
        <Text style={styles.productName}>{item.name}</Text>
        <View style={styles.priceWrapper}>
          <Text style={styles.productPrice}>K{item.price.toFixed(2)}</Text>
          <View style={styles.addButton}>
            <MaterialIcons name="add" size={20} color="white" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <MaterialIcons name="search" size={22} color={"gray"} />
        <TextInput style={styles.input} placeholder="Search for Product..." />
      </View>
      <View style={styles.wrapper}>
        {categoriesData.map((data) => (
          <Categories key={data.id} data={data} navigation={navigation} />
        ))}
      </View>
      <View style={styles.products}>
        <FlatList
          data={products}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.productListContainer}
        />
      </View>
      <Nav navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EFEFEF",
    alignItems: "center",
    justifyContent: "flex-start",
    height: "100%",
  },
  products: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    width: "100%",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
    paddingHorizontal: 10,
    marginBottom: 20,
    height: 40,
    backgroundColor: "#fff",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "gray",
  },
  input: {
    width: "100%",
    height: 40,
    paddingHorizontal: 10,
    fontSize: 16,
    color: "#000",
  },
  wrapper: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    paddingHorizontal: 20,
  },
  circleWrapper: {
    alignItems: "center",
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  img: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
  },
  textCat: {
    fontSize: 13,
  },
  productListContainer: {
    paddingBottom: 20,
  },
  productCardContainer: {
    flex: 0.48,
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 20,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  productImage: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  productDetails: {
    marginTop: 6,
    paddingHorizontal: 8,
  },
  productCategory: {
    fontSize: 12,
    color: "#999",
    marginBottom: 1,
  },
  productName: {
    fontSize: 16,
    marginBottom: 0,
  },
  priceWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 2,
    marginBottom: 3,
  },
  productPrice: {
    fontSize: 16,
    color: "green",
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "green",
    borderRadius: 12,
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
  },
});
