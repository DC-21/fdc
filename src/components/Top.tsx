import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function TopBar({ navigation }: { navigation: any }) {
  return (
    <View style={styles.topBar}>
      <View style={styles.leftIconsContainer}>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => navigation.navigate("Cart")}
        >
          <MaterialIcons name="shopping-cart" size={24} color={"black"} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => navigation.navigate("Notifications")}
        >
          <MaterialIcons name="notifications" size={24} color={"black"} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.profileIconContainer}
        onPress={() => navigation.navigate("Profile")}
      >
        <MaterialIcons name="person" size={24} color={"black"} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 60,
    backgroundColor: "#fff",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 1000,
  },
  leftIconsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: "auto",
  },
  profileIconContainer: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "white",
    elevation: 2,
  },
  iconContainer: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    elevation: 0,
    backgroundColor: "transparent",
  },
});
