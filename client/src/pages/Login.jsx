import { Box } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

export default function Login() {
  const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';
  console.log('🌐 API_URL used:', API_URL); // ✅ Confirm .env is working

  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log(' Submitting login to:', `${API_URL}/auth/login`);
    console.log(' Payload:', form);

    try {
      const res = await axios.post(`${API_URL}/auth/login`, form);
      console.log(' Login success:', res.data);
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      console.error(' Login error:', err);
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-gray-800 p-8 rounded-xl shadow-lg">
        <div className="text-center space-y-4 mb-6">
          <Box className="mx-auto w-16 h-16 text-cyan-400" />
          <h1 className="text-3xl font-bold">Smart Inventory</h1>
          <p className="text-gray-400 text-sm">
            Real-time analytics. Intelligent restocking. One login away.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-center mb-2">Login</h2>
        <p className="text-center text-gray-400 mb-6">Enter your credentials to continue</p>

        {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="text-right text-sm">
            <Link to="/forgot-password" className="text-red-400 hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg font-semibold text-white transition ${
              loading
                ? 'bg-cyan-300 cursor-not-allowed'
                : 'bg-cyan-500 hover:bg-cyan-400'
            }`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Don’t have an account?{' '}
          <Link to="/register" className="text-cyan-400 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
