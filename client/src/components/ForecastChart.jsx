import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from "recharts";

export default function ForecastChart({ data }) {
  return (
    <div className="bg-gray-800 p-4 rounded-xl shadow-lg">
      <h2 className="text-white text-lg font-semibold mb-4">📉 Forecast vs Actual</h2>
      {data?.length === 0 ? (
        <p className="text-gray-400">No forecast data available.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="date" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="actual" stroke="#00FF7F" strokeWidth={2} name="Actual" />
            <Line type="monotone" dataKey="predicted" stroke="#FFA07A" strokeWidth={2} name="Predicted" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
