import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Register = () => {
  const [user, setUser] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const validate = () => {
    if (!user.name.trim()) return 'Name is required';
    if (!user.email.trim()) return 'Email is required';
    if (!emailRegex.test(user.email)) return 'Invalid email format';
    if (!user.password) return 'Password is required';
    if (user.password.length < 6) return 'Password must be at least 6 characters';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', user);
      localStorage.setItem('token', response.data.token); // Use the response
      setError(null);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="chat-form min-h-screen flex items-center justify-center bg-gray-100">
      <div className="form-container max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Register</h1>
        {error && (
          <p className="error-message text-red-500 mb-4 text-center font-medium">{error}</p>
        )}
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Name </label> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <input
              type="text"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              className="form-input w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Email </label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <input
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="form-input w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Password  </label>&nbsp;
            <input
              type="password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              className="form-input w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
              required
              minLength={6}
            />
          </div> <br />
          <button
            type="submit"
            className="form-button w-full bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition shadow-md"
          >
            Register
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:underline font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;