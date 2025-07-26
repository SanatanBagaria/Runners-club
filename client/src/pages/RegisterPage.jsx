import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      // Updated URL to use the proxy
      await axios.post('/api/users/register', { name, email, password }, config);
      
      toast.success('Registration successful! An admin will approve your account shortly.');
      navigate('/login');
    } catch (err) {
      const message = err.response?.data?.message || 'An error occurred';
      toast.error(message);
    }
  };

  const formInputClasses = "w-full bg-black text-white p-3 border-2 border-white focus:border-yellow-400 focus:outline-none font-sans";
  const formButtonClasses = "w-full font-bold bg-yellow-400 text-black text-xl px-8 py-3 border-2 border-white hover:bg-white transition-colors duration-200";

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="border-4 border-white p-8 bg-black shadow-[8px_8px_0px_rgba(229,62,62,1)]">
        <h1 className="text-5xl font-bold text-center text-white mb-8">Register</h1>
        <form onSubmit={submitHandler}>
          <div className="mb-6">
            <label className="block text-white mb-2 font-bold tracking-wider" htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              className={formInputClasses}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-white mb-2 font-bold tracking-wider" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className={formInputClasses}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-8">
            <label className="block text-white mb-2 font-bold tracking-wider" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className={formInputClasses}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={formButtonClasses}>
            Sign Up
          </button>
        </form>
         <div className="text-center mt-6">
            <p className="text-gray-400 font-sans">
                Already have an account?{' '}
                <Link to="/login" className="text-yellow-400 hover:text-white font-bold">Login here</Link>
            </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
