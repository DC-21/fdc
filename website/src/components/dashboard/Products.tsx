import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image1: string;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    // Fetch products from the API
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/products/");
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const filterByCategory = (category: string | null) => {
    setSelectedCategory(category);
    if (category) {
      setFilteredProducts(
        products.filter((product) => product.category === category)
      );
    } else {
      setFilteredProducts(products);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Products</h1>

      {/* Filter buttons */}
      <div className="mb-6 flex gap-4">
        <button
          className={`px-4 py-2 rounded ${
            selectedCategory === null
              ? "bg-green-500 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => filterByCategory(null)}
        >
          All
        </button>
        <button
          className={`px-4 py-2 rounded ${
            selectedCategory === "Vegetables"
              ? "bg-green-500 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => filterByCategory("Vegetables")}
        >
          Vegetables
        </button>
        <button
          className={`px-4 py-2 rounded ${
            selectedCategory === "Dairy"
              ? "bg-green-500 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => filterByCategory("Dairy")}
        >
          Dairy
        </button>
        <button
          className={`px-4 py-2 rounded ${
            selectedCategory === "Fruits"
              ? "bg-green-500 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => filterByCategory("Fruits")}
        >
          Fruits
        </button>

        <button
          className={`px-4 py-2 rounded ${
            selectedCategory === "Grains"
              ? "bg-green-500 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => filterByCategory("Grains")}
        >
          Grains
        </button>
      </div>

      {/* Product list */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Link to={`/product/${product.id}`} key={product.id}>
            <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col items-center transition-transform transform hover:scale-105">
              <div className="w-full h-56 bg-gray-200 flex items-center justify-center overflow-hidden">
                <img
                  src={product.image1}
                  alt={product.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="w-full p-4 text-start">
                <h2 className="text-lg font-semibold">{product.name}</h2>
                <p className="text-gray-600">{product.category}</p>
                <p className="text-green-500 font-bold mt-2">
                  Price K{product.price}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Products;
