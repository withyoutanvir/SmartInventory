import React, { useEffect, useState } from "react";
import ForecastChart from "../components/ForecastChart";
import axios from "../api/axios"; // make sure this points to your Axios config

const Forecast = () => {
  const [forecastData, setForecastData] = useState([]);
  const sku = "SKU004"; // ← You can make this dynamic later
  const days = 7;

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const res = await axios.get(`/api/forecast?sku=${sku}&days=${days}`);
        setForecastData(res.data);
      } catch (err) {
        console.error("Error fetching forecast:", err);
      }
    };

    fetchForecast();
  }, []);

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-4">📈 Forecast: {sku}</h1>
      <ForecastChart data={forecastData} />
    </div>
  );
};

export default Forecast;
