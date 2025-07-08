import React from "react";

export default function ReorderTable({ data }) {
  if (!Array.isArray(data)) {
    data = [];
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-6">
      <h2 className="text-lg font-semibold mb-4">📦 Reorder Suggestions</h2>
      {data.length === 0 ? (
        <p className="text-gray-500">All stock levels look good.</p>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-sm text-gray-600 border-b">
              <th className="py-2">SKU</th>
              <th>Current Stock</th>
              <th>Forecasted Demand</th>
              <th>Suggested Reorder</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr key={idx} className="border-b text-gray-700">
                <td className="py-2">{item.sku}</td>
                <td>{item.currentStock}</td>
                <td>{item.forecastedDemand}</td>
                <td className="font-semibold text-blue-600">{item.reorderQty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
