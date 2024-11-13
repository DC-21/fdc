import Graph from "./Graph";
import { DollarSign, ShoppingBag, Users, Package } from "lucide-react";

interface CardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

const Home = () => {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card
          icon={<Package className="text-green-500" />}
          label="Total Products"
          value="4"
        />
        <Card
          icon={<ShoppingBag className="text-blue-500" />}
          label="Total Sales"
          value="14"
        />
        <Card
          icon={<DollarSign className="text-yellow-500" />}
          label="Total Revenue"
          value="K10"
        />
        <Card
          icon={<Users className="text-red-500" />}
          label="Total Users"
          value="5"
        />
      </div>
      <Graph />
    </div>
  );
};

const Card = ({ icon, label, value }: CardProps) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
    <div className="text-4xl">{icon}</div>
    <div>
      <p className="text-gray-500 text-sm font-medium">{label}</p>
      <p className="text-2xl font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);

export default Home;
