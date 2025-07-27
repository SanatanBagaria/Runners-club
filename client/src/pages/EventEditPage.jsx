import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Spinner from '../components/Spinner';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || '';

const EventEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [distance, setDistance] = useState('');
  const [pace, setPace] = useState('');
  const [routeUrl, setRouteUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        // Updated URL to use the proxy
        const { data } = await axios.get(`${API_BASE_URL}/api/events/${id}`);
        setTitle(data.title);
        const formattedDate = new Date(data.date).toISOString().slice(0, 16);
        setDate(formattedDate);
        setLocation(data.location);
        setDistance(data.distance);
        setPace(data.pace);
        setRouteUrl(data.routeUrl || '');
      } catch (err) {
        toast.error('Could not load event data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      // Updated URL to use the proxy
      await axios.put(
        `${API_BASE_URL}/api/events/${id}`,
        { title, date, location, distance, pace, routeUrl },
        config
      );
      toast.success('Event updated successfully!');
      navigate(`/events/${id}`);
    } catch (err) {
      toast.error('Failed to update event.');
      console.error(err);
    }
  };

  const formInputClasses = "w-full bg-black text-white p-3 border-2 border-white focus:border-yellow-400 focus:outline-none font-sans";
  const formButtonClasses = "w-full font-bold bg-yellow-400 text-black text-xl px-8 py-3 border-2 border-white hover:bg-white transition-colors duration-200";

  if (loading) return <Spinner />;

  return (
    <div className="max-w-xl mx-auto mt-10">
      <div className="border-4 border-white p-8 bg-black shadow-[8px_8px_0px_rgba(229,62,62,1)]">
        <h1 className="text-5xl font-bold text-center text-white mb-8">Edit Run Event</h1>
        <form onSubmit={submitHandler}>
          <div className="mb-6">
            <label className="block text-white mb-2 font-bold tracking-wider" htmlFor="title">Title</label>
            <input type="text" id="title" className={formInputClasses} value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="mb-6">
            <label className="block text-white mb-2 font-bold tracking-wider" htmlFor="date">Date and Time</label>
            <input type="datetime-local" id="date" className={`${formInputClasses} text-gray-400 [color-scheme:dark]`} value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
          <div className="mb-6">
            <label className="block text-white mb-2 font-bold tracking-wider" htmlFor="location">Location</label>
            <input type="text" id="location" className={formInputClasses} value={location} onChange={(e) => setLocation(e.target.value)} required />
          </div>
          <div className="mb-6">
            <label className="block text-white mb-2 font-bold tracking-wider" htmlFor="distance">Distance (e.g., 5K, 10 Miles)</label>
            <input type="text" id="distance" className={formInputClasses} value={distance} onChange={(e) => setDistance(e.target.value)} required />
          </div>
          <div className="mb-6">
            <label className="block text-white mb-2 font-bold tracking-wider" htmlFor="pace">Pace (e.g., Beginner, Intermediate)</label>
            <input type="text" id="pace" className={formInputClasses} value={pace} onChange={(e) => setPace(e.target.value)} required />
          </div>
          <div className="mb-8">
            <label className="block text-white mb-2 font-bold tracking-wider" htmlFor="routeUrl">Route Map URL (Optional)</label>
            <input type="url" id="routeUrl" className={formInputClasses} value={routeUrl} onChange={(e) => setRouteUrl(e.target.value)} />
          </div>
          <button type="submit" className={formButtonClasses}>
            Update Event
          </button>
        </form>
      </div>
    </div>
  );
};

export default EventEditPage;
