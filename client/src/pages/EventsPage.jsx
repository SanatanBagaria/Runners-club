import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EventCard from '../components/EventCard';
import Spinner from '../components/Spinner';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || '';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Updated URL to use the proxy
        const { data } = await axios.get(`${API_BASE_URL}/api/events`);
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
        toast.error('Could not load events.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-black border-4 border-white p-8 shadow-[8px_8px_0px_rgba(250,204,21,1)]">
        <h1 className="text-6xl md:text-7xl font-bold text-center text-white mb-12 drop-shadow-[3px_3px_0_rgba(229,62,62,1)]">
          Upcoming Runs & Events
        </h1>
        {loading ? (
          <Spinner />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.length > 0 ? (
              events.map((event) => (
                <EventCard key={event._id} event={event} />
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <p className="text-2xl font-bold text-gray-400">No upcoming events scheduled.</p>
                <p className="text-gray-500 mt-2">Check back soon!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
