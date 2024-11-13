import { Link } from "react-router-dom";
import { Home, Building, Briefcase, User, DollarSign } from "lucide-react";

const Sidebar = () => {
  const Links = [
    { name: "Dashboard", path: "/dashboard", icon: <Home /> },
    { name: "Products", path: "/products", icon: <Building /> },
    { name: "Orders", path: "/orders", icon: <Briefcase /> },
    { name: "Revenue", path: "/revenue", icon: <DollarSign /> },
    { name: "Profile", path: "/profile", icon: <User /> },
  ];

  return (
    <div className="text-slate-900 md:flex hidden w-40 p-6 shadow-md border-r min-h-screen">
      <ul className="space-y-3">
        {Links.map((item, index) => (
          <Link
            to={item.path}
            key={index}
            className={`flex items-center space-x-2 px-2 py-2 rounded-lg transition duration-200 
              ${
                location.pathname === item.path
                  ? "bg-green-600 text-white"
                  : "hover:bg-gray-300 text-slate-900"
              }`}
          >
            <span>{item.icon}</span>
            <span className="text-sm font-medium">{item.name}</span>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
