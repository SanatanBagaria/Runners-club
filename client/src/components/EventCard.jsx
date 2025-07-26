import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const EventCard = ({ event }) => {
  const [currentEvent, setCurrentEvent] = useState(event);
  const storedUserInfo = localStorage.getItem('userInfo');
  const userInfo = storedUserInfo ? JSON.parse(storedUserInfo) : null;
  const isAttending = currentEvent.attendees.includes(userInfo?._id);

  const rsvpHandler = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userInfo) {
      toast.error('Please log in to RSVP.');
      return;
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      // Updated URL to use the proxy
      const { data } = await axios.post(
        `/api/events/${currentEvent._id}/rsvp`,
        {},
        config
      );

      setCurrentEvent(data);
      toast.success(isAttending ? 'RSVP Canceled' : 'You are going!');
    } catch (error) {
      console.error('RSVP failed:', error);
      toast.error('Failed to update RSVP.');
    }
  };

  const eventDate = new Date(currentEvent.date).toLocaleDateString('en-IN', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
  });

  const eventTime = new Date(currentEvent.date).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <Link
      to={`/events/${currentEvent._id}`}
      className="block bg-black border-4 border-white p-4 group transition-all duration-200 shadow-[6px_6px_0px_rgba(255,255,255,1)] hover:shadow-[8px_8px_0px_rgba(250,204,21,1)] hover:-translate-y-1 hover:-translate-x-1"
    >
      <div className="flex flex-col justify-between h-full">
        <div>
          <h2 className="text-3xl font-bold text-white transition-colors duration-200">{currentEvent.title}</h2>
          <p className="text-gray-300 mt-2 font-sans">{eventDate} at {eventTime}</p>
          <p className="text-gray-400 font-sans">{currentEvent.location}</p>
          <div className="mt-4 flex gap-2">
            <span className="font-bold bg-white text-black text-xs px-3 py-1 -skew-x-12">
              {currentEvent.distance}
            </span>
            <span className="font-bold bg-white text-black text-xs px-3 py-1 -skew-x-12">
              {currentEvent.pace} Pace
            </span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t-2 border-dashed border-gray-500">
          <div className="flex justify-between items-center">
            <span className="font-sans font-bold text-white">{currentEvent.attendees.length} Going</span>
            {userInfo && (
              <button
                onClick={rsvpHandler}
                className={`font-bold px-4 py-2 text-sm border-2 border-white transition-all duration-200 shadow-[3px_3px_0px_rgba(255,255,255,1)] hover:shadow-[3px_3px_0px_rgba(0,0,0,1)]
                  ${isAttending ? 'bg-red-600 text-white' : 'bg-yellow-400 text-black'}`}
              >
                {isAttending ? 'Cancel' : 'RSVP'}
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
