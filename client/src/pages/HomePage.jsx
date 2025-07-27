import React from 'react';
import { Link } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || '';

const HomePage = () => {
  return (
    // Add a custom box-shadow to the main container
    <div className="text-center flex flex-col items-center justify-center min-h-[70vh] px-4 bg-black border-4 border-white mx-auto max-w-4xl shadow-[8px_8px_0px_rgba(250,204,21,1)]">
      {/* Use a standard drop-shadow color */}
      <h1 className="text-7xl md:text-8xl font-bold text-white drop-shadow-[4px_4px_0_rgba(250,204,21,1)]">
        IIT Dhanbad Running Club!
      </h1>
      {/* Increase top margin for more spacing */}
      <p className="text-lg md:text-xl text-gray-300 mt-8 max-w-2xl font-sans font-extrabold">
        Your central hub for runs, community, and progress in IIT Dhanbad.
      </p>
      {/* Increase top margin for more spacing */}
      <div className="mt-12">
        {/* Use `rounded-full` for a rounder button */}
        <Link to="/events" className="font-bold bg-yellow-400 text-black text-xl md:text-2xl px-10 py-4 rounded-full border-4 border-white hover:bg-white transition-colors duration-200">
          See Upcoming Runs
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
