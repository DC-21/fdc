import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import categoriesData from "../../data/categoriesData";
import Nav from "../../components/Nav";
import { UserData } from "../../types/interface";
import { ENDPOINT } from "../../api";

interface AddProductsProps {
  navigation: any;
}

const AddProducts: React.FC<AddProductsProps> = ({ navigation }) => {
  const [category, setCategory] = useState<string>(categoriesData[0].name);
  const [productName, setProductName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [secondImageUri, setSecondImageUri] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await AsyncStorage.getItem("userData");
        if (user) setUserData(JSON.parse(user));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  const pickImage = async (
    setImageUri: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
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
      if (!result.canceled) setImageUri(result.assets[0].uri);
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const uploadImages = async () => {
    try {
      const formData = new FormData();

      if (imageUri) {
        formData.append("avatar", {
          uri: imageUri,
          name: "avatar.jpg",
          type: "image/jpeg",
        } as any);
      }

      if (secondImageUri) {
        formData.append("image2", {
          uri: secondImageUri,
          name: "image2.jpg",
          type: "image/jpeg",
        } as any);
      }

      const response = await axios.post(
        `${ENDPOINT}/api/uploads/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("Response:", response.data);

      // Check if both images are uploaded and set the URLs
      const { avatar, image2 } = response.data;

      if (avatar && image2) {
        return { image1: avatar, image2: image2 };
      } else {
        throw new Error("Failed to upload images");
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      Alert.alert("Upload Error", "Failed to upload images. Please try again.");
      return null;
    }
  };

  const handleAddProduct = async () => {
    if (!productName || !description || !quantity || !price) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    if (!imageUri) {
      Alert.alert("Error", "Please select at least one image.");
      return;
    }

    setIsLoading(true);

    try {
      const uploadedImages = await uploadImages();

      if (uploadedImages) {
        const productData = {
          name: productName,
          category,
          description,
          quantity: parseFloat(quantity),
          price: parseFloat(price),
          userId: userData?.id ?? "",
          image1: uploadedImages.image1,
          image2: uploadedImages.image2,
        };

        const response = await axios.post(
          `${ENDPOINT}/api/products/new-product`,
          productData,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );

        if (response.status === 201) {
          Alert.alert("Success", "Product added successfully!");
          setProductName("");
          setDescription("");
          setQuantity("");
          setPrice("");
          setImageUri(null);
          setSecondImageUri(null);
          navigation.navigate("Products");
        } else {
          Alert.alert("Error", "Failed to add product. Please try again.");
        }
      }
    } catch (error: any) {
      console.error("Error adding product:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "An error occurred while adding the product."
      );
    } finally {
      setIsLoading(false);
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
              enabled={!isLoading}
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
            editable={!isLoading}
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter product description"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            editable={!isLoading}
          />

          <Text style={styles.label}>Quantity/Weight</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter quantity or weight"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
            editable={!isLoading}
          />

          <Text style={styles.label}>Price (K)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter price"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            editable={!isLoading}
          />

          <Text style={styles.label}>Product Image *</Text>
          <TouchableOpacity
            style={styles.imagePlaceholder}
            onPress={() => !isLoading && pickImage(setImageUri)}
            disabled={isLoading}
          >
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.selectedImage} />
            ) : (
              <>
                <MaterialIcons name="image" size={50} color="#ccc" />
                <Text style={styles.imagePlaceholderText}>Select Image</Text>
              </>
            )}
          </TouchableOpacity>

          <Text style={styles.label}>Second Image (Optional)</Text>
          <TouchableOpacity
            style={styles.imagePlaceholder}
            onPress={() => !isLoading && pickImage(setSecondImageUri)}
            disabled={isLoading}
          >
            {secondImageUri ? (
              <Image
                source={{ uri: secondImageUri }}
                style={styles.selectedImage}
              />
            ) : (
              <>
                <MaterialIcons name="image" size={50} color="#ccc" />
                <Text style={styles.imagePlaceholderText}>
                  Select Second Image
                </Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.submitButton,
              isLoading && styles.submitButtonDisabled,
            ]}
            onPress={handleAddProduct}
            disabled={isLoading}
          >
            <Text style={styles.submitButtonText}>
              {isLoading ? "Adding Product..." : "Add Product"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Nav navigation={navigation} />
    </View>
  );
};

export default AddProducts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EFEFEF",
  },
  scrollContainer: {
    alignItems: "center",
    padding: 20,
    paddingBottom: 100,
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: "#333",
  },
  input: {
    height: 45,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    fontSize: 14,
    marginBottom: 15,
  },
  textArea: {
    height: 100,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
  },
  picker: {
    height: Platform.OS === "ios" ? 200 : 45,
    width: "100%",
  },
  imagePlaceholder: {
    height: 150,
    backgroundColor: "#f3f3f3",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 15,
  },
  selectedImage: {
    width: "100%",
    height: "100%",
    borderRadius: 5,
  },
  imagePlaceholderText: {
    fontSize: 16,
    color: "#888",
  },
  submitButton: {
    backgroundColor: "#33B5FF",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: "#ccc",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
