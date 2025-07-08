import React, { useEffect, useState } from "react";
import ForecastChart from "../components/ForecastChart";

import axios from "axios";

const Forecast = () => {
  const [forecastData, setForecastData] = useState([]);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const res = await axios.get("/api/forecast");
        setForecastData(res.data.forecast);
      } catch (err) {
        console.error("Error fetching forecast:", err);
      }
    };

    fetchForecast();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Sales Forecast</h1>
      <ForecastChart data={forecastData} />
    </div>
  );
};

export default Forecast;
