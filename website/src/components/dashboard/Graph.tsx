import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Graph = () => {
  const data = [
    { time: "Jan", products: 30, sales: 2400 },
    { time: "Feb", products: 50, sales: 3000 },
    { time: "Mar", products: 80, sales: 4500 },
    { time: "Apr", products: 60, sales: 3500 },
    { time: "May", products: 90, sales: 5000 },
    { time: "Jun", products: 70, sales: 4200 },
  ];

  return (
    <div className="px-0">
      <div className="bg-[#272a37] text-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">
          Products Sold vs Sales Over Time
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="products" stroke="#82ca9d" />
            <Line type="monotone" dataKey="sales" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Graph;
