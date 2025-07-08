import { useEffect, useState } from "react";
import axios from "../api/axios";
import { format } from "date-fns";
import {
  TrendingUp,
  Package,
  AlertTriangle,
  Gauge,
} from "lucide-react";
import { motion } from "framer-motion";
import { useDataRefresh } from "../context/DataRefreshContext";

// Component Imports
import SalesTrendChart from "../components/SalesTrendChart";
import TopSKUsBarChart from "../components/TopSKUsBarChart";
import ReorderTable from "../components/ReorderTable";
import ForecastChart from "../components/ForecastChart";
import ProfitChart from "../components/ProfitChart";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [recentSales, setRecentSales] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [topSKUs, setTopSKUs] = useState([]);
  const [reorderData, setReorderData] = useState([]);
  const [loading, setLoading] = useState(true);

  const { refreshFlag } = useDataRefresh();

  useEffect(() => {
    fetchData();
  }, [refreshFlag]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [summaryRes, salesRes, trendRes, topSKUsRes, reorderRes] =
        await Promise.all([
          axios.get("/analytics/summary"),
          axios.get("/data/recent"),
          axios.get("/analytics/daily-sales"),
          axios.get("/analytics/top-skus"),
          axios.get("/forecast/reorder"),
        ]);

      setSummary(summaryRes.data);
      setRecentSales(salesRes.data);
      setTrendData(trendRes.data);
      setTopSKUs(topSKUsRes.data);
      setReorderData(reorderRes.data.reorder || []);
    } catch (err) {
      console.error("Dashboard fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white min-h-screen">
      <h1 className="text-3xl font-extrabold">📊 Dashboard</h1>

      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <Card title="Total Sales" value={`₹ ${summary?.totalSales || 0}`} icon={<TrendingUp />} />
        <Card title="Top SKU" value={summary?.topSKU || "N/A"} icon={<Package />} />
        <Card title="Low Stock Items" value={summary?.lowStock || 0} icon={<AlertTriangle />} />
        <Card title="Forecast Accuracy" value={(summary?.forecastAccuracy || 0) + "%"} icon={<Gauge />} />
      </div>

      {/* Charts Section */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <SalesTrendChart data={trendData} />
        <TopSKUsBarChart data={topSKUs} />
        <ProfitChart />
      </motion.div>

      {/* Reorder Table */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <ReorderTable data={reorderData} />
      </motion.div>

      {/* Forecast Chart */}
      <ForecastChart data={trendData} />

      {/* Recent Sales */}
      <div className="bg-gray-900 rounded-2xl shadow-lg p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">🧾 Recent Sales</h2>
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : (
          <table className="w-full table-auto text-left">
            <thead>
              <tr className="text-sm text-gray-400 border-b border-gray-700">
                <th className="py-2">Date</th>
                <th>SKU</th>
                <th>Qty</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {recentSales.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-4 text-center text-gray-400">
                    No sales data found.
                  </td>
                </tr>
              ) : (
                recentSales.map((sale, idx) => {
                  let formattedDate = "Invalid date";
                  try {
                    const date = new Date(sale.date);
                    if (!isNaN(date.getTime())) {
                      formattedDate = format(date, "dd MMM yyyy");
                    }
                  } catch (e) {
                    console.error("Invalid date:", sale.date);
                  }

                  return (
                    <tr key={idx} className="border-b border-gray-800 text-gray-200">
                      <td className="py-2">{formattedDate}</td>
                      <td>{sale.sku}</td>
                      <td>{sale.quantity}</td>
                      <td>₹ {sale.price}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// Summary Card Component
function Card({ title, value, icon }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="bg-gray-800 p-5 rounded-xl shadow-lg flex items-center space-x-4"
    >
      <div className="p-3 bg-gradient-to-tr from-blue-600 to-purple-600 text-white rounded-full">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-400">{title}</p>
        <h2 className="text-2xl font-bold text-white">{value}</h2>
      </div>
    </motion.div>
  );
}
