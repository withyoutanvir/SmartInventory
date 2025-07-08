import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";

export default function TopSKUsBarChart({ data }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">🏆 Top 5 Selling SKUs</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis type="category" dataKey="sku" />
          <Tooltip />
          <Bar dataKey="sales" fill="#32CD32" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
