import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Spinner from '../components/Spinner';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || '';

const EventDetailsPage = () => {
  const { id }  = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const storedUserInfo = localStorage.getItem('userInfo');
  const userInfo = storedUserInfo ? JSON.parse(storedUserInfo) : null;

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        // Updated URL to use the proxy
        const { data } = await axios.get(`${API_BASE_URL}/api/events/${id}`);
        setEvent(data);
      } catch (error) {
        console.error('Failed to fetch event', error);
        toast.error('Could not load event details.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const deleteHandler = async () => {
    if (window.confirm('Are you sure you want to delete this event? This cannot be undone.')) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        // Updated URL to use the proxy
        await axios.delete(`${API_BASE_URL}/api/events/${id}`, config);
        toast.success('Event deleted successfully!');
        navigate('/events');
      } catch (error) {
        console.error('Failed to delete event', error);
        toast.error('Could not delete the event.');
      }
    }
  };

  if (loading) return <Spinner />;
  if (!event) return <p className="text-center text-white">Event not found.</p>;

  const isEmbeddable = event.routeUrl && (event.routeUrl.includes('strava.com/routes') || event.routeUrl.includes('google.com/maps'));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-6xl font-heading text-white drop-shadow-[3px_3px_0_#e53e3e]">{event.title}</h1>
          <p className="text-lg text-gray-300 font-sans font-bold mt-2">
            {new Date(event.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        {userInfo && userInfo.isAdmin && userInfo._id === event.user && (
          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/admin/event/${id}/edit`)}
              className="font-marker bg-yellow-400 text-black px-4 py-2 border-2 border-white hover:bg-white transition-colors duration-200"
            >
              Edit
            </button>
            <button
              onClick={deleteHandler}
              className="font-marker bg-red-600 text-white px-4 py-2 border-2 border-white hover:bg-white hover:text-red-600 transition-colors duration-200"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 bg-black border-4 border-white p-2">
          {isEmbeddable ? (
            <iframe
              src={event.routeUrl.replace('/routes/', '/routes/embed/')}
              width="100%"
              height="450"
              frameBorder="0"
              allowFullScreen
              scrolling="no"
              title="Route Map"
            ></iframe>
          ) : (
            <div className="bg-black h-96 flex items-center justify-center">
              <p className="text-gray-500 font-bold">No route map provided.</p>
            </div>
          )}
        </div>
        <div className="space-y-8">
            <div className="bg-black border-4 border-white p-6">
                <h3 className="text-3xl font-heading text-white mb-4">Details</h3>
                <div className="space-y-2 text-white font-sans font-bold">
                    <p><strong>Location:</strong> {event.location}</p>
                    <p><strong>Distance:</strong> {event.distance}</p>
                    <p><strong>Pace:</strong> {event.pace}</p>
                </div>
            </div>
             <div className="bg-black border-4 border-white p-6">
                <h3 className="text-3xl font-heading text-white mb-4">Who's Going? ({event.attendees.length})</h3>
                {event.attendees.length > 0 ? (
                    <ul className="space-y-2">
                    {event.attendees.map((attendee) => (
                        <li key={attendee._id} className="text-lg font-marker text-white">
                        {attendee.name}
                        </li>
                    ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 font-sans font-bold">No one has RSVP'd yet.</p>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;
