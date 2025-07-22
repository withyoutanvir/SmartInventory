import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function TopSKUsBarChart({ data }) {
  // Normalize data for Recharts
  const transformedData = data.map(item => ({
    sku: item._id,
    sales: item.totalQty,
  }));

  return (
    <div className="bg-gray-900 p-4 rounded-xl shadow-lg">
      <h2 className="text-white text-lg font-semibold mb-4"> Top 5 Selling SKUs</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={transformedData}
          layout="vertical"
          margin={{ left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis type="number" stroke="#ccc" />
          <YAxis type="category" dataKey="sku" stroke="#ccc" />
          <Tooltip
            contentStyle={{ backgroundColor: "#1f2937", border: "none", color: "#fff" }}
            cursor={{ fill: "#374151" }}
            formatter={(value) => [`${value} units`, "Sales"]}
          />
          <Bar dataKey="sales" fill="#32CD32" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
