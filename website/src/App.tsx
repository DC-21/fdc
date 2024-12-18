import { Route, Routes } from "react-router-dom";
import Login from "./components/auth/Login";
import Home from "./components/dashboard/Home";
import Layout from "./components/Layout";
import Products from "./components/dashboard/Products";
import ProductDetails from "./components/dashboard/ProductDetails";
import Profile from "./components/dashboard/Profile";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />

      <Route
        path="/products"
        element={
          <Layout>
            <Products />
          </Layout>
        }
      />

      <Route
        path="/product/:id"
        element={
          <Layout>
            <ProductDetails />
          </Layout>
        }
      />

      <Route
        path="/profile"
        element={
          <Layout>
            <Profile />
          </Layout>
        }
      />
    </Routes>
  );
}

export default App;
