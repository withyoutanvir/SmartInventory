import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import VanillaTilt from "vanilla-tilt";
import Typed from "typed.js";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Package, AlertTriangle, Gauge } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const typedRef = useRef(null);

  const [summary, setSummary] = useState({
    totalSales: 154000,
    topSKU: "SKU-1124",
    lowStock: 12,
    forecastAccuracy: 91,
  });

  useEffect(() => {
    VanillaTilt.init(document.querySelectorAll(".tilt-card"), {
      max: 15,
      speed: 400,
      glare: true,
      "max-glare": 0.2,
    });

    if (typedRef.current) {
      const typed = new Typed(typedRef.current, {
        strings: ["Smart Forecasting", "AI Restocking", "Real-Time Analytics"],
        typeSpeed: 60,
        backSpeed: 40,
        loop: true,
      });
      return () => typed.destroy();
    }
  }, []);

  const pieData = [
    { name: "In Stock", value: 400 },
    { name: "Low Stock", value: 200 },
    { name: "Out of Stock", value: 100 },
  ];

  const COLORS = ["#06b6d4", "#3b82f6", "#f87171"];

  const barData = [
    { name: "Mon", sales: 120 },
    { name: "Tue", sales: 200 },
    { name: "Wed", sales: 150 },
    { name: "Thu", sales: 300 },
    { name: "Fri", sales: 250 },
    { name: "Sat", sales: 180 },
    { name: "Sun", sales: 100 },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-gray-900 to-gray-800 text-white relative">
      {/* Navbar */}
      <header className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[95%] z-50 bg-gray-800/70 backdrop-blur-lg shadow-lg rounded-2xl py-5">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-21">
          <h1 className="text-xl font-bold text-cyan-400">SmartInventory</h1>
          <nav className="space-x-4">
            <a href="#home" className="text-gray-200 hover:text-cyan-400 transition">Home</a>
            <a href="#features" className="text-gray-200 hover:text-cyan-400 transition">Features</a>
            <a href="#about" className="text-gray-200 hover:text-cyan-400 transition">About</a>
            <a href="#analytics" className="text-gray-200 hover:text-cyan-400 transition">Analytics</a>
            <a href="#dashboard" className="text-gray-200 hover:text-cyan-400 transition">Dashboard</a>
            <a href="#testimonials" className="text-gray-200 hover:text-cyan-400 transition">Testimonials</a>
            <a href="#contact" className="text-gray-200 hover:text-cyan-400 transition">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="h-screen flex flex-col justify-center items-center text-center px-6 relative">
        <div className="absolute top-0 left-0 w-full h-full -z-10">
          <div className="w-full h-full bg-gradient-to-br from-cyan-600/20 to-blue-800/20 animate-pulse" />
          <div className="absolute top-20 left-20 w-64 h-64 bg-blue-400 blur-3xl opacity-20 rounded-full animate-spin-slow" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500 blur-3xl opacity-20 rounded-full animate-ping" />
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">📦 Smart Inventory</h1>
          <span ref={typedRef} className="block text-xl md:text-2xl text-cyan-400 font-semibold h-8 mb-6" />
          <p className="text-gray-300 max-w-xl mx-auto mb-6">
            Revolutionize your stock management with intelligent forecasting, automated restocking, and real-time insights.
          </p>
          <div className="flex gap-4 justify-center">
            <button onClick={() => navigate("/login")} className="bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-6 rounded-lg shadow-lg transition transform hover:scale-105">Login</button>
            <button onClick={() => navigate("/register")} className="bg-white hover:bg-gray-100 text-cyan-600 py-2 px-6 rounded-lg shadow-lg transition transform hover:scale-105">Register</button>
          </div>
        </motion.div>
      </section>


      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-900 text-center">
        <h2 className="text-3xl font-bold text-cyan-400 mb-12">🚀 Why Choose Smart Inventory?</h2>
        <div className="grid md:grid-cols-3 gap-10 px-6">
          {["Real-Time Forecasting", "Smart Restocking", "Deep Analytics"].map((title, i) => (
            <motion.div key={i} whileInView={{ opacity: 1, scale: 1 }} initial={{ opacity: 0, scale: 0.9 }} transition={{ delay: i * 0.2 }} className="bg-gray-800 p-6 rounded-2xl shadow-xl tilt-card">
              <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
              <p className="text-gray-400 text-sm">AI-driven insights to power your business operations more efficiently.</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-800 text-center px-6">
        <motion.div whileInView={{ x: 0, opacity: 1 }} initial={{ x: -100, opacity: 0 }} transition={{ duration: 1 }} className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-cyan-400 mb-4">🤖 About Our AI</h2>
          <p className="text-gray-300">We leverage machine learning algorithms to bring predictive accuracy and operational excellence to your inventory strategy.</p>
        </motion.div>
      </section>

      {/* Dashboard Section */}
      <section id="dashboard" className="py-24 px-6 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.h2 className="text-4xl font-bold text-center text-cyan-400 mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>📊 Smart Dashboard Overview</motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <SummaryCard title="Total Sales" value={`₹ ${summary.totalSales}`} icon={<TrendingUp />} />
            <SummaryCard title="Top SKU" value={summary.topSKU} icon={<Package />} />
            <SummaryCard title="Low Stock Items" value={summary.lowStock} icon={<AlertTriangle />} />
            <SummaryCard title="Forecast Accuracy" value={`${summary.forecastAccuracy}%`} icon={<Gauge />} />
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div className="bg-gray-800 p-6 rounded-2xl shadow-xl" initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <h3 className="text-lg font-semibold text-cyan-300 mb-4">Stock Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
            <motion.div className="bg-gray-800 p-6 rounded-2xl shadow-xl" initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <h3 className="text-lg font-semibold text-cyan-300 mb-4">Weekly Sales Trends</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barData}>
                  <XAxis dataKey="name" stroke="#cbd5e1" />
                  <YAxis stroke="#cbd5e1" />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#0ea5e9' }} labelStyle={{ color: '#e0f2fe' }} />
                  <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-800 text-center px-6">
        <h2 className="text-3xl font-bold text-cyan-400 mb-12">💬 What Our Clients Say</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {[
            "SmartInventory helped us reduce stockouts by 40%!",
            "The dashboard's forecasting feature is a game changer.",
          ].map((text, i) => (
            <motion.div key={i} whileHover={{ scale: 1.02 }} className="bg-gray-900 rounded-xl p-6 shadow-lg">
              <p className="text-gray-300">{text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-900 text-center px-6">
        <motion.div whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 30 }} transition={{ duration: 0.6 }} className="max-w-xl mx-auto">
          <h2 className="text-3xl font-bold text-cyan-400 mb-4">📬 Get in Touch</h2>
          <p className="text-gray-300 mb-6">Let us know how we can help you grow smarter.</p>
          <button onClick={() => navigate("/register")} className="bg-cyan-600 hover:bg-cyan-700 text-white py-3 px-8 rounded-lg shadow-lg transition transform hover:scale-105">Contact Us</button>
        </motion.div>
      </section>
    </div>
  );
}

function SummaryCard({ title, value, icon }) {
  return (
    <motion.div whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 200 }} className="bg-gray-800 p-5 rounded-xl shadow-lg flex items-center space-x-4">
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