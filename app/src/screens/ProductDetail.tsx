import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  ScrollView,
  Dimensions,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

interface Product {
  name: string;
  image1: string;
  image2: string;
  description: string;
  price: number;
  quantity: number;
  fullname: string;
}

const ProductDetail = ({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) => {
  const { productId } = route.params;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://192.168.43.241:4000/api/products/${productId}`
        );
        console.log("this is product data", response);
        setProduct(response.data);
        setTotalAmount(response.data.price);
      } catch (error) {
        console.error("Error fetching product data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  useEffect(() => {
    if (product) {
      setTotalAmount(product.price * selectedQuantity);
    }
  }, [selectedQuantity, product]);

  useEffect(() => {
    if (autoPlay && product?.image1 && product?.image2) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % 2);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [autoPlay, product]);

  const addToCart = async () => {
    try {
      const cart = await AsyncStorage.getItem("cart");
      const parsedCart = cart ? JSON.parse(cart) : [];
      const existingProductIndex = parsedCart.findIndex(
        (item: Product) => item.name === product?.name
      );

      if (existingProductIndex > -1) {
        parsedCart[existingProductIndex].selectedQuantity += selectedQuantity;
      } else {
        parsedCart.push({
          ...product,
          selectedQuantity,
          availableQuantity: product?.quantity,
        });
      }

      await AsyncStorage.setItem("cart", JSON.stringify(parsedCart));
      navigation.navigate("Cart");
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#008000" style={styles.loader} />
    );
  }

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Product not found</Text>
      </View>
    );
  }

  const { name, image1, image2, description, price, quantity, fullname } =
    product;

  const images = [image1, image2];

  return (
    <ScrollView style={styles.container}>
      {images.length > 0 && (
        <View style={styles.carouselContainer}>
          <Image source={{ uri: images[currentIndex] }} style={styles.image} />
          <View style={styles.carouselNav}>
            <TouchableOpacity
              style={styles.arrowButton}
              onPress={() =>
                setCurrentIndex(
                  (currentIndex - 1 + images.length) % images.length
                )
              }
            >
              <Text style={styles.arrowText}>{"<"}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.arrowButton}
              onPress={() =>
                setCurrentIndex((currentIndex + 1) % images.length)
              }
            >
              <Text style={styles.arrowText}>{">"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.contentContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.description}>{description}</Text>

        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Price:</Text>
          <Text style={styles.priceValue}>K{price}</Text>
        </View>

        <View style={styles.quantityContainer}>
          <Text style={styles.quantityLabel}>Quantity available:</Text>
          <Text style={styles.quantityValue}>{quantity}</Text>
        </View>

        <View style={styles.quantityContainer}>
          <Text style={styles.description}>Select Quantity:</Text>
          <View style={styles.quantityInputContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => {
                if (selectedQuantity > 1) {
                  setSelectedQuantity(selectedQuantity - 1);
                }
              }}
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.quantityInput}
              value={String(selectedQuantity)}
              keyboardType="numeric"
              onChangeText={(text) => {
                const newQuantity = Math.min(
                  Math.max(Number(text), 1),
                  quantity
                );
                setSelectedQuantity(newQuantity);
              }}
            />
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => {
                if (selectedQuantity < quantity) {
                  setSelectedQuantity(selectedQuantity + 1);
                }
              }}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.totalAmount}>Total Amount: K{totalAmount}</Text>

        <View style={styles.sellerContainer}>
          <Text style={styles.seller}>Sold by:</Text>
          <Text style={styles.sellerName}>{fullname}</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={addToCart}>
          <Text style={styles.buttonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    paddingHorizontal: 20,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: width - 40,
    height: 300,
    borderRadius: 14,
    resizeMode: "cover",
    borderWidth: 2,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  carouselContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  carouselNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    width: "100%",
    top: "40%",
    paddingHorizontal: 10,
  },
  arrowButton: {
    backgroundColor: "green",
    paddingHorizontal: 22,
    paddingVertical: 16,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
  },

  priceLabel: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  priceValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#008000",
  },

  arrowText: {
    color: "#fff",
    fontSize: 18,
  },
  contentContainer: {
    paddingVertical: 20,
  },
  name: {
    fontSize: 26,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
    color: "#666",
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  quantity: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  quantityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  quantityInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  quantityButtonText: {
    fontSize: 20,
    color: "#008000",
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 5,
    width: 60,
    textAlign: "center",
    fontSize: 16,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#008000",
  },
  sellerContainer: {
    marginVertical: 20,
  },
  seller: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  sellerName: {
    fontSize: 16,
    color: "#666",
  },
  button: {
    backgroundColor: "#008000",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
  },
  quantityLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  quantityValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#f00",
  },
});

export default ProductDetail;
