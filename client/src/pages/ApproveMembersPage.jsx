import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ApproveMembersPage = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get admin user info for API calls
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
    },
  };

  // --- Fetch pending users ---
  const fetchPendingUsers = async () => {
    try {
      // Updated URL to use the proxy
      const { data } = await axios.get('/api/users/pending', config);
      setPendingUsers(data);
    } catch (err) {
      toast.error('Could not load pending users.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  // --- Handle user approval ---
  const approveHandler = async (userId) => {
    try {
      // Updated URL to use the proxy
      await axios.put(`/api/users/${userId}/approve`, {}, config);
      toast.success('User approved!');
      // Refresh the list by filtering out the approved user
      setPendingUsers(pendingUsers.filter((user) => user._id !== userId));
    } catch (err) {
      toast.error('Failed to approve user.');
      console.error(err);
    }
  };

  if (loading) {
    return <p>Loading pending members...</p>; // Or your Spinner component
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Approve New Members</h1>
      {pendingUsers.length === 0 ? (
        <p className="text-gray-500">No new members are pending approval.</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg">
          <ul className="divide-y divide-gray-200">
            {pendingUsers.map((user) => (
              <li key={user._id} className="px-6 py-4 flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold text-gray-800">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <button
                  onClick={() => approveHandler(user._id)}
                  className="bg-green-500 text-white px-4 py-1.5 rounded-md hover:bg-green-600 font-semibold"
                >
                  Approve
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ApproveMembersPage;
