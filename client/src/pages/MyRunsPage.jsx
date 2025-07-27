import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Spinner from '../components/Spinner';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || '';

const MyRunsPage = () => {
  const [runs, setRuns] = useState([]);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
    },
  };

  const fetchRuns = async () => {
    try {
      // Updated URL to use the proxy
      const { data } = await axios.get(`${API_BASE_URL}/api/runs/myruns`, config);
      setRuns(data);
    } catch (err) {
      console.error('Failed to fetch runs', err);
      toast.error('Could not load your runs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRuns();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Updated URL to use the proxy
      await axios.post('/api/runs', { distance, duration, notes }, config);
      toast.success('Run logged successfully!');
      setDistance('');
      setDuration('');
      setNotes('');
      fetchRuns();
    } catch (err) {
      toast.error('Failed to add run. Please check your inputs.');
      console.error('Failed to create run', err);
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this run?')) {
      try {
        // Updated URL to use the proxy
        await axios.delete(`/api/runs/${id}`, config);
        toast.success('Run deleted.');
        fetchRuns();
      } catch (err) {
        toast.error('Failed to delete run.');
        console.error('Failed to delete run', err);
      }
    }
  };

  const formInputClasses = "w-full bg-black text-white p-3 border-2 border-white focus:border-yellow-400 focus:outline-none font-sans";
  const formButtonClasses = "w-full font-bold bg-yellow-400 text-black text-xl px-8 py-3 border-2 border-white hover:bg-white transition-colors duration-200";

  return (
    <div className="container mx-auto px-4 py-8">
       <h1 className="text-6xl md:text-7xl font-bold text-center text-white mb-12 drop-shadow-[3px_3px_0_rgba(229,62,62,1)]">
        My Run Log
      </h1>
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* --- Add Run Form --- */}
        <div className="lg:col-span-1">
          <div className="border-4 border-white p-8 bg-black shadow-[8px_8px_0px_rgba(250,204,21,1)]">
             <h2 className="text-4xl font-bold text-center text-white mb-8">Log a New Run</h2>
            <form onSubmit={submitHandler}>
              <div className="mb-6">
                <label className="block text-white mb-2 font-bold tracking-wider" htmlFor="distance">Distance (km)</label>
                <input type="number" id="distance" className={formInputClasses} value={distance} onChange={(e) => setDistance(e.target.value)} required />
              </div>
              <div className="mb-6">
                <label className="block text-white mb-2 font-bold tracking-wider" htmlFor="duration">Duration (minutes)</label>
                <input type="number" id="duration" className={formInputClasses} value={duration} onChange={(e) => setDuration(e.target.value)} required />
              </div>
              <div className="mb-8">
                <label className="block text-white mb-2 font-bold tracking-wider" htmlFor="notes">Notes (Optional)</label>
                <textarea id="notes" rows="3" className={formInputClasses} value={notes} onChange={(e) => setNotes(e.target.value)}></textarea>
              </div>
              <button type="submit" className={formButtonClasses}>
                Add Run
              </button>
            </form>
          </div>
        </div>

        {/* --- Run List --- */}
        <div className="lg:col-span-2">
          <h2 className="text-4xl font-bold text-white mb-6">Your Run History</h2>
          {loading ? <Spinner /> : (
            <div className="space-y-4">
              {runs.length > 0 ? runs.map((run) => (
                <div key={run._id} className="bg-black border-2 border-white p-4 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-lg text-white">{new Date(run.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p className="text-gray-300 font-sans">{run.distance} km in {run.duration} minutes</p>
                    {run.notes && <p className="text-sm text-yellow-400 mt-1 font-sans"><em>"{run.notes}"</em></p>}
                  </div>
                  <button onClick={() => deleteHandler(run._id)} className="font-bold bg-red-600 text-white text-xs px-3 py-1 border-2 border-white hover:bg-white hover:text-red-600 transition-colors duration-200">
                    Delete
                  </button>
                </div>
              )) : (
                <div className="text-center py-16">
                    <p className="text-2xl font-bold text-gray-400">No runs logged yet.</p>
                    <p className="text-gray-500 mt-2">Use the form to add your first run!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyRunsPage;
