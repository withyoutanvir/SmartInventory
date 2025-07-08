import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from "recharts";

export default function ForecastChart({ data }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">📉 Forecast vs Actual Sales</h2>
      {data?.length === 0 ? (
        <p className="text-gray-500">No forecast data available.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="actual" stroke="#32CD32" strokeWidth={2} name="Actual" />
            <Line type="monotone" dataKey="predicted" stroke="#FF7F50" strokeWidth={2} name="Predicted" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
