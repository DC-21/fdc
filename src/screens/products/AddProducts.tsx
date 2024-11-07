import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import categoriesData from "../../data/categoriesData";
import Nav from "../../components/Nav";

interface AddProductsProps {
  navigation: any;
}

const AddProducts: React.FC<AddProductsProps> = ({ navigation }) => {
  // State variables for form inputs
  const [category, setCategory] = useState<string>(categoriesData[0].name);
  const [productName, setProductName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [image, setImage] = useState<string | null>(null);

  // Handler for image selection
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission denied",
        "We need camera roll permissions to select an image."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Handler for form submission
  const handleAddProduct = async () => {
    if (!productName || !description || !quantity || !price) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    const newProduct = {
      productName,
      category,
      description,
      quantity: parseFloat(quantity),
      price: parseFloat(price),
      image, // Use the selected image URI
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:4000/products",
        newProduct
      );
      if (response.status === 201) {
        Alert.alert("Success", "Product added successfully!");
        navigation.navigate("Products");
      } else {
        Alert.alert("Error", "Failed to add product. Please try again.");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      Alert.alert("Error", "An error occurred while adding the product.");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Text style={styles.title}>Add New Product</Text>
          <Text style={styles.label}>Category</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={category}
              onValueChange={(itemValue) => setCategory(itemValue)}
              style={styles.picker}
            >
              {categoriesData.map((cat) => (
                <Picker.Item label={cat.name} value={cat.name} key={cat.id} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Product Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter product name"
            value={productName}
            onChangeText={setProductName}
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter product description"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />

          <Text style={styles.label}>Quantity/Weight</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter quantity or weight"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Price (K)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter price"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Product Image (Optional)</Text>
          <TouchableOpacity style={styles.imagePlaceholder} onPress={pickImage}>
            {image ? (
              <Image source={{ uri: image }} style={styles.selectedImage} />
            ) : (
              <>
                <MaterialIcons name="image" size={50} color="#ccc" />
                <Text style={styles.imagePlaceholderText}>Select Image</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleAddProduct}
          >
            <Text style={styles.submitButtonText}>Add Product</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Nav navigation={navigation} />
    </View>
  );
};

export default AddProducts;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#EFEFEF" },
  scrollContainer: { alignItems: "center", padding: 20, paddingBottom: 100 },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: { fontSize: 16, marginBottom: 5, color: "#333" },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
  },
  picker: { height: 50, width: "100%" },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  textArea: { height: 100, textAlignVertical: "top", paddingTop: 10 },
  imagePlaceholder: {
    height: 150,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#fafafa",
  },
  imagePlaceholderText: { color: "#ccc", marginTop: 10, fontSize: 16 },
  selectedImage: { width: "100%", height: "100%", borderRadius: 5 },
  submitButton: {
    backgroundColor: "#33c37d",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  submitButtonText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
});
