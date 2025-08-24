import { useState } from 'react';
import axios from 'axios';
import '../styles/register.css';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from "react-hot-toast"; // Import toast

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    city: '',
    role: '',
  });
const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${backendURL}/api/v1/users/register`, formData);

      toast.success('Registration successful! You can now log in.'); // 🔥 Success toast
      navigate('/login'); // Redirect to login page
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.'); // 🔥 Error toast
    }
  };

  return (
    <div className="auth-page">
      <Toaster position="top-right" reverseOrder={false} /> {/* Toast container */}
      <div className="auth-card">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            required
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select role
            </option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit">Register</button>
        </form>

        <p className="switch-text">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
