import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-green-100 px-6">
      <div className="text-center bg-white p-10 rounded-2xl shadow-xl max-w-xl">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          📦 Smart Inventory System
        </h1>
        <p className="text-gray-600 mb-6 text-sm md:text-base">
          AI-powered inventory forecasting, sales trends, and stock optimization for modern retailers.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition duration-200"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-6 rounded-lg transition duration-200"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
