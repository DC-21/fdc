import { Bell, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/profile");
  };
  return (
    <nav className="px-6 py-4 w-full flex justify-between items-center bg-white shadow-md">
      <p className="text-xl font-semibold text-green-600">Farmers Connect</p>
      <div className="flex gap-6 items-center">
        <button className="relative">
          <Bell className="w-6 h-6 text-gray-600 hover:text-green-500 transition" />
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-semibold leading-none text-white transform bg-red-600 rounded-full -translate-y-1/2 translate-x-1/2">
            3
          </span>
        </button>
        <button onClick={handleNavigate}>
          <User className="w-6 h-6 text-gray-600 hover:text-green-500 transition" />
        </button>
        <button className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
