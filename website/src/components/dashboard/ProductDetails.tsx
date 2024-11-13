import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image1: string;
  image2: string;
  fullname: string;
  quantity: number;
}

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/products/${id}`
        );
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <p>Loading...</p>;

  // Carousel settings for slick
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        {/* Image Carousel */}
        <Slider {...settings}>
          <div>
            <img
              src={product.image1}
              alt={`${product.name} primary`}
              className="w-full h-80 object-cover rounded-md"
            />
          </div>
          <div>
            <img
              src={product.image2}
              alt={`${product.name} secondary`}
              className="w-full h-80 object-cover rounded-md"
            />
          </div>
        </Slider>

        <h1 className="text-2xl font-semibold mt-4">{product.name}</h1>
        <p className="text-gray-600 mt-2">Category: {product.category}</p>
        <p className="text-green-500 font-bold text-xl mt-2">
          Price: K{product.price}
        </p>

        {/* Display seller's name */}
        <p className="text-gray-700 mt-2">Seller: {product.fullname}</p>

        {/* Display quantity */}
        <p className="text-gray-500 mt-1">
          Available Quantity: {product.quantity}
        </p>

        {/* Display description */}
        {product.description && (
          <p className="mt-4 text-gray-800">{product.description}</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
