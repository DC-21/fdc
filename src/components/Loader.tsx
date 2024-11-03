import React from "react";
import { StyleSheet, View, ActivityIndicator, Text } from "react-native";

const Loader: React.FC<{ loading: boolean; message?: string }> = ({
  loading,
  message,
}) => {
  if (!loading) return null;

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#1e293b" />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  message: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
  },
});

export default Loader;
