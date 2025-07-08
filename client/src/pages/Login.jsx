import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  const handleResetSubmit = (e) => {
    e.preventDefault();
    alert(`Password reset link would be sent to: ${resetEmail}`);
    setShowReset(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-blue-500 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Login</h2>

        {error && <p className="text-red-500 text-sm text-center mb-3">{error}</p>}

        {showReset ? (
          <>
            <form onSubmit={handleResetSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="Enter your registered email"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
              >
                Send Reset Link
              </button>
            </form>
            <p className="text-sm text-center mt-4 text-gray-600">
              Remembered your password?{' '}
              <span
                onClick={() => setShowReset(false)}
                className="text-blue-500 hover:underline cursor-pointer"
              >
                Go back
              </span>
            </p>
          </>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
              >
                Log In
              </button>
            </form>

            <div className="text-sm text-center mt-4 text-gray-600">
              <span
                onClick={() => setShowReset(true)}
                className="text-blue-500 hover:underline cursor-pointer"
              >
                Forgot your password?
              </span>
            </div>

            <p className="text-sm text-center mt-3 text-gray-600">
              Don't have an account?{' '}
              <span
                onClick={() => navigate('/register')}
                className="text-blue-500 hover:underline cursor-pointer"
              >
                Register
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
