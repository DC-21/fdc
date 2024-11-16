import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface CartItem {
  id: string;
  name: string;
  image1: string;
  price: number;
  selectedQuantity: number;
  availableQuantity: number;
  description: string;
  fullname: string;
}

interface CartProps {
  navigation: any;
}

export default function Cart({ navigation }: CartProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const items = await AsyncStorage.getItem("cart");

        console.log("this is cart man", items);
        if (items) {
          setCartItems(JSON.parse(items));
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCartItems();
  }, []);

  const updateCart = async (updatedCart: CartItem[]) => {
    try {
      setCartItems(updatedCart);
      await AsyncStorage.setItem("cart", JSON.stringify(updatedCart));
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const handleQuantityChange = (item: CartItem, increment: boolean) => {
    const updatedCart = cartItems.map((cartItem) => {
      if (cartItem.id === item.id) {
        let newQuantity = increment
          ? cartItem.selectedQuantity + 1
          : cartItem.selectedQuantity - 1;

        // Check if new quantity exceeds available quantity
        if (newQuantity > cartItem.availableQuantity) {
          Alert.alert(
            "Maximum Quantity Reached",
            `Only ${cartItem.availableQuantity} items available in stock.`
          );
          newQuantity = cartItem.availableQuantity;
        }

        // Ensure quantity doesn't go below 1
        if (newQuantity < 1) {
          newQuantity = 1;
        }

        return {
          ...cartItem,
          selectedQuantity: newQuantity,
        };
      }
      return cartItem;
    });
    updateCart(updatedCart);
  };

  const removeItem = (itemId: string) => {
    const updatedCart = cartItems.filter((cartItem) => cartItem.id !== itemId);
    updateCart(updatedCart);
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image1 }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>K{item.price.toFixed(2)}</Text>
        <Text style={styles.stockText}>
          Available: {item.availableQuantity}
        </Text>
      </View>
      <View>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeItem(item.id)}
        >
          <Text style={styles.removeButtonText}>Remove</Text>
        </TouchableOpacity>
        <View style={styles.quantityControl}>
          <TouchableOpacity
            style={[
              styles.quantityButton,
              item.selectedQuantity <= 1 && styles.disabledButton,
            ]}
            onPress={() => handleQuantityChange(item, false)}
            disabled={item.selectedQuantity <= 1}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantity}>{item.selectedQuantity}</Text>
          <TouchableOpacity
            style={[
              styles.quantityButton,
              item.selectedQuantity >= item.availableQuantity &&
                styles.disabledButton,
            ]}
            onPress={() => handleQuantityChange(item, true)}
            disabled={item.selectedQuantity >= item.availableQuantity}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.emptyCart}>
        <Text style={styles.emptyCartText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {cartItems.length === 0 ? (
        <View style={styles.emptyCart}>
          <Text style={styles.emptyCartText}>Your cart is empty.</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.id}
          />
          <View style={styles.totalSection}>
            <Text style={styles.totalText}>Total:</Text>
            <Text style={styles.totalAmount}>
              K
              {cartItems
                .reduce(
                  (total, item) => total + item.price * item.selectedQuantity,
                  0
                )
                .toFixed(2)}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={() => navigation.navigate("Checkout")}
          >
            <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#efefef",
    padding: 20,
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  itemPrice: {
    fontSize: 16,
    color: "#888",
  },
  stockText: {
    fontSize: 14,
    color: "#555",
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    backgroundColor: "#eee",
    borderRadius: 5,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#ddd",
    opacity: 0.5,
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  quantity: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 10,
  },
  removeButton: {
    backgroundColor: "#ff6666",
    padding: 5,
    borderRadius: 5,
    marginBottom: 10,
  },
  removeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  emptyCart: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyCartText: {
    fontSize: 18,
    color: "#888",
  },
  totalSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#33c37d",
  },
  checkoutButton: {
    backgroundColor: "#33c37d",
    borderRadius: 5,
    padding: 15,
    alignItems: "center",
    marginTop: 20,
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
