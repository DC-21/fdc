import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  Success: undefined;
  Failure: undefined;
};

type TransactionVerificationProps = {
  navigation: StackNavigationProp<any>;
};

const TransactionVerification: React.FC<TransactionVerificationProps> = ({
  navigation,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);

  useEffect(() => {
    const verifyTransaction = async () => {
      setLoading(true);
      try {
        setTimeout(() => {
          const success = true;

          if (success) {
            setIsVerified(true);
            Alert.alert("Success", "Transaction verified successfully!", [
              {
                text: "OK",
                onPress: () => navigation.navigate("Success"),
              },
            ]);
          } else {
            setIsVerified(false);
            Alert.alert("Failure", "Transaction verification failed", [
              {
                text: "OK",
                onPress: () => navigation.navigate("Failure"),
              },
            ]);
          }
        }, 2000); // Simulate a 2-second delay
      } catch (error) {
        console.error("Error verifying transaction", error);
        Alert.alert("Error", "An error occurred during verification");
      } finally {
        setLoading(false);
      }
    };

    verifyTransaction();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Transaction Verification</Text>

      {/* Loader while verifying */}
      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : (
        <Text style={styles.message}>
          {isVerified === null
            ? "Verifying transaction..."
            : isVerified
            ? "Transaction Verified"
            : "Transaction Failed"}
        </Text>
      )}

      {!loading && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.buttonText}>Go Back to Home</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  message: {
    fontSize: 18,
    color: "#333",
    marginTop: 20,
  },
  button: {
    marginTop: 30,
    padding: 15,
    backgroundColor: "#007BFF",
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default TransactionVerification;
