import React, { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import Chart from "../components/Chart";
import axios from "../api/axios";

const Analytics = () => {
  const [stats, setStats] = useState({});
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [csvFile, setCsvFile] = useState(null);
  const [csvMode, setCsvMode] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const res = await axios.get("/api/analytics");
      setStats(res.data.summary);
      setTrendData(res.data.trend);
      setCsvMode(false);
    } catch (err) {
      console.error("Error fetching analytics:", err);
      setErrorMsg("Failed to fetch live analytics.");
    } finally {
      setLoading(false);
    }
  };

  const handleCSVUpload = async () => {
    if (!csvFile) return alert("Please select a CSV file first.");

    const formData = new FormData();
    formData.append("file", csvFile);

    try {
      setLoading(true);
      setErrorMsg("");
      const res = await axios.post("/api/analytics/upload-csv", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.trend?.length > 0) {
        setTrendData(res.data.trend);
        setCsvMode(true);
      } else {
        setErrorMsg("No valid data found in CSV.");
      }
    } catch (err) {
      console.error("CSV upload failed:", err);
      const serverError = err.response?.data?.error || "CSV upload failed.";
      setErrorMsg(serverError);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-white p-6">Loading...</p>;

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white min-h-screen">
      <h1 className="text-3xl font-extrabold">📈 Business Analytics</h1>

      {/* CSV Upload Controls */}
      <div className="flex items-center space-x-4 mb-4">
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setCsvFile(e.target.files[0])}
          className="bg-gray-800 px-3 py-1 rounded text-sm text-white"
        />
        <button
          onClick={handleCSVUpload}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
        >
          Upload CSV
        </button>
        {csvMode && (
          <button
            onClick={fetchAnalytics}
            className="text-sm text-blue-300 underline"
          >
            Switch to Live Data
          </button>
        )}
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="bg-red-600 text-white px-4 py-2 rounded">
          {errorMsg}
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard
          title="Monthly Revenue"
          value={`₹${stats.revenue || 0}`}
          growth={stats.revenueGrowth}
        />
        <StatCard title="Total Orders" value={stats.orders || 0} />
        <StatCard title="Top Product" value={stats.topProduct || "N/A"} />
      </div>

      {/* Chart */}
      <Chart
        data={trendData}
        title={csvMode ? "📤 CSV Sales Trend" : "📊 Monthly Sales Trend"}
      />
    </div>
  );
};

export default Analytics;
