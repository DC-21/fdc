import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import Loader from "../../components/Loader";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

type LoginScreenProps = {
  navigation: StackNavigationProp<any>;
};

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://192.168.43.241:4000/api/auth/login",
        {
          email,
          password,
        }
      );

      console.log(response);

      if (response.status === 200) {
        const userData = response.data.user;
        // Save user data to AsyncStorage
        await AsyncStorage.setItem("userData", JSON.stringify(userData));
        Alert.alert("Success", "Logged in successfully!");

        // Navigate to Home or any other screen
        navigation.navigate("Home");
      }
    } catch (error: any) {
      console.error("Login Error:", error);
      console.log(error || error.message);

      Alert.alert("Error", error.response?.data?.message || "Failed to login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Loader loading={loading} message="Logging in, please wait..." />
      <View style={styles.card}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.registerLink}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  card: {
    width: "90%",
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    width: "100%",
    height: 50,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "white",
    marginVertical: 10,
  },
  button: {
    width: "100%",
    backgroundColor: "#1e293b",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  registerContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  registerText: {
    fontSize: 16,
    color: "#333",
  },
  registerLink: {
    fontSize: 16,
    color: "#1e293b",
    fontWeight: "bold",
  },
});

export default LoginScreen;
