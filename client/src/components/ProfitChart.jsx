import { PieChart } from "react-minimal-pie-chart";

export default function ProfitChart() {
  return (
    <div className="bg-[#1F1F2F] p-4 rounded-xl shadow w-full max-w-sm">
      <h2 className="text-lg text-white mb-2">💰 Profit</h2>
      <PieChart
        data={[
          { title: "Current", value: 500, color: "#FF6B6B" },
          { title: "Target", value: 450, color: "#00C49F" },
          { title: "Lost", value: 300, color: "#FFBB28" },
        ]}
        lineWidth={20}
        label={({ dataEntry }) => dataEntry.title}
        labelStyle={{ fontSize: "5px", fill: "#fff" }}
        radius={40}
      />
    </div>
  );
}
