import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Chart = ({ data = [], title = "Forecast" }) => {
  // Auto-detect appropriate Y-axis key
  const yKey =
    data.length > 0
      ? Object.keys(data[0]).find((key) =>
          ["total", "sales", "value"].includes(key)
        ) || "total"
      : "total";

  return (
    <div className="bg-white shadow-md rounded-2xl p-4 w-full">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">{title}</h2>

      {data.length === 0 ? (
        <p className="text-center text-gray-500">No data to display</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey={yKey}
              stroke="#1E90FF"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default Chart;
