import React, { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import Chart from "../components/Chart";
import axios from "../api/axios"; 

const Analytics = () => {
  const [stats, setStats] = useState({});
  const [trendData, setTrendData] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get("/analytics");
        setStats(res.data.summary);
        setTrendData(res.data.trend);
      } catch (err) {
        console.error("Error fetching analytics:", err);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white min-h-screen">
      <h1 className="text-3xl font-extrabold">📈 Business Analytics</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard title="Monthly Revenue" value={`₹${stats.revenue || 0}`} growth={stats.revenueGrowth} />
        <StatCard title="Total Orders" value={stats.orders || 0} />
        <StatCard title="Top Product" value={stats.topProduct || "N/A"} />
      </div>

      <Chart data={trendData} title="Monthly Sales Trend" />
    </div>
  );
};

export default Analytics;
