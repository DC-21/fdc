import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import NetInfo from "@react-native-community/netinfo";
import uuid from "react-native-uuid";
import { ENDPOINT } from "../../api";

type RootStackParamList = {
  Checkout: undefined;
  Verification: undefined;
};

type CheckoutScreenProps = {
  navigation: StackNavigationProp<any>;
};

type FormDataType = {
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
};

type ErrorsType = Partial<Record<keyof FormDataType, string>>;

const CheckoutScreen: React.FC<CheckoutScreenProps> = ({ navigation }) => {
  const [formData, setFormData] = useState<FormDataType>({
    firstname: "",
    lastname: "",
    email: "",
    phoneNumber: "",
  });

  const [errors, setErrors] = useState<ErrorsType>({});
  const [cart, setCart] = useState<any[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cartData = await AsyncStorage.getItem("cart");
        const userDataStr = await AsyncStorage.getItem("userData");
        if (cartData) {
          setCart(JSON.parse(cartData));
        }
        if (userDataStr) {
          setUserData(JSON.parse(userDataStr));
        }
      } catch (error) {
        console.error("Error fetching data from AsyncStorage", error);
      }
    };

    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected || false);
    });

    fetchData();

    return () => {
      unsubscribe();
    };
  }, []);

  const validateForm = () => {
    const newErrors: ErrorsType = {};
    if (!formData.firstname) newErrors.firstname = "First name is required";
    if (!formData.lastname) newErrors.lastname = "Last name is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\d+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be numeric";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (name: keyof FormDataType, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (userData && cart.length > 0) {
      const totalAmount = cart.reduce(
        (sum, item) => sum + item.price * item.selectedQuantity,
        0
      );

      const orderId = uuid.v4();

      const orderData = {
        orderId,
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        totalAmount,
        userId: userData.id,
        cart: cart.map((item) => ({
          productId: item.id,
          sellerId: item.userId,
          sellerName: item.fullname,
          name: item.name,
          price: item.price,
          quantity: item.selectedQuantity,
        })),
      };

      try {
        await AsyncStorage.setItem("orderId", orderId);

        if (!isConnected) {
          Alert.alert(
            "Network Issue",
            "The network is offline. Your request will resume when connectivity is restored."
          );
          return;
        }

        setLoading(true);

        const response = await axios.post(
          `${ENDPOINT}/api/orders/new-order`,
          orderData
        );

        if (response.status === 201) {
          await AsyncStorage.removeItem("cart");
          Alert.alert("Success", "Order created successfully!", [
            {
              text: "OK",
              onPress: () => navigation.navigate("Verification"),
            },
          ]);
        } else {
          Alert.alert("Error", "Failed to create order.");
        }
      } catch (error) {
        console.error("Error submitting order:", error);
        Alert.alert("Error", "An error occurred while submitting the order.");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const retryOrder = async () => {
      if (isConnected) {
        const storedOrderId = await AsyncStorage.getItem("orderId");
        if (storedOrderId) {
          handleSubmit();
          await AsyncStorage.removeItem("orderId");
        }
      }
    };

    retryOrder();
  }, [isConnected]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Checkout Details</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          value={formData.firstname}
          onChangeText={(value) => handleInputChange("firstname", value)}
          placeholder="Enter your first name"
        />
        {errors.firstname && (
          <Text style={styles.errorText}>{errors.firstname}</Text>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.input}
          value={formData.lastname}
          onChangeText={(value) => handleInputChange("lastname", value)}
          placeholder="Enter your last name"
        />
        {errors.lastname && (
          <Text style={styles.errorText}>{errors.lastname}</Text>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={formData.email}
          onChangeText={(value) => handleInputChange("email", value)}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          value={formData.phoneNumber}
          onChangeText={(value) => handleInputChange("phoneNumber", value)}
          placeholder="Enter your phone number"
          keyboardType="numeric"
        />
        {errors.phoneNumber && (
          <Text style={styles.errorText}>{errors.phoneNumber}</Text>
        )}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Pay Now</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
  button: {
    marginTop: 20,
    width: "100%",
    padding: 15,
    backgroundColor: "#007BFF",
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CheckoutScreen;
