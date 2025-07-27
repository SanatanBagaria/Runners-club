import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || '';

const MembersPage = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        // Updated URL to use the proxy
        const { data } = await axios.get(`${API_BASE_URL}/api/users`, config);
        setMembers(data);
      } catch (error) {
        console.error('Failed to fetch members', error);
        toast.error('Could not load members.');
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-6xl md:text-7xl font-bold text-center text-white mb-12 drop-shadow-[3px_3px_0_rgba(229,62,62,1)]">
        Club Members
      </h1>
      <div className="max-w-2xl mx-auto bg-black border-4 border-white p-4 shadow-[8px_8px_0px_rgba(250,204,21,1)]">
        <ul className="divide-y-2 divide-dashed divide-gray-500">
          {members.map((member) => (
            <li key={member._id} className="py-4">
              <p className="text-2xl font-bold text-white">{member.name}</p>
              <p className="text-sm text-gray-400 font-sans">
                Member since: {new Date(member.createdAt).toLocaleDateString('en-IN')}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MembersPage;
