import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 text-white p-2 rounded shadow-lg text-sm">
        <p>{label}</p>
        <p>Sales: ₹{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export default function SalesTrendChart({ data }) {
  return (
    <div className="bg-gray-900 p-4 rounded-xl shadow-lg">
      <h2 className="text-white text-lg font-semibold mb-4">
        📈 7-Day Sales Trend
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <defs>
            <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1E90FF" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#1E90FF" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="date" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#1E90FF"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 6 }}
            fillOpacity={1}
            fill="url(#salesGradient)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
