import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const StatCard = ({ title, value, growth }) => {
  const isPositive = growth >= 0;

  return (
    <div className="bg-[#1F1F2F] text-white rounded-2xl shadow-lg p-5 w-full hover:scale-[1.02] transition-transform duration-200 ease-in-out">
      <div className="text-sm text-gray-400">{title}</div>

      <div className="text-3xl font-extrabold mt-1 mb-2 text-white">{value}</div>

      {growth !== undefined && (
        <div className={`flex items-center text-sm ${isPositive ? "text-green-400" : "text-red-400"}`}>
          {isPositive ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
          {Math.abs(growth)}% this month
        </div>
      )}
    </div>
  );
};

export default StatCard;
