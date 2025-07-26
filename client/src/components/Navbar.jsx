import React from 'react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Navbar = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = () => {
      const storedUserInfo = localStorage.getItem('userInfo');
      if (storedUserInfo) {
        setUserInfo(JSON.parse(storedUserInfo));
      } else {
        setUserInfo(null);
        setPendingCount(0);
      }
    };

    const fetchPendingCount = async () => {
      const storedUser = JSON.parse(localStorage.getItem('userInfo'));
      if (storedUser && storedUser.isAdmin) {
        try {
          const config = { headers: { Authorization: `Bearer ${storedUser.token}` } };
          // Updated URL to use the proxy
          const { data } = await axios.get('/api/users/pending', config);
          setPendingCount(data.length);
        } catch (error) {
          console.error('Could not fetch pending count', error);
          setPendingCount(0);
        }
      }
    };

    checkUser();
    fetchPendingCount();

    window.addEventListener('storage', checkUser);
    
    return () => {
      window.removeEventListener('storage', checkUser);
    };
  }, [navigate]);

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    setUserInfo(null);
    setPendingCount(0);
    navigate('/login');
  };

  const navLinkClasses = "font-bold px-3 py-2 text-black hover:bg-white rounded-md transition-colors duration-200";
  const adminLinkClasses = "relative font-bold px-3 py-2 text-red-600 hover:bg-white rounded-md transition-colors duration-200";

  return (
    <>
      {/* This empty div acts as a spacer to push the page content down */}
      <div className="h-24" /> 
      
      <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center justify-between bg-yellow-400 border-4 border-white rounded-full shadow-lg h-16 px-6 w-auto min-w-[750px]">
          
          {/* Left Side */}
          <Link to="/" className="text-2xl font-bold text-black hover:text-red-600 transition-colors duration-200">
            DHAN-BHAAG
          </Link>
          
          {/* Center Links */}
          <div className="flex items-center gap-2">
            <Link to="/events" className={navLinkClasses}>Events</Link>
            {userInfo && (
              <>
                <Link to="/my-runs" className={navLinkClasses}>My Runs</Link>
                <Link to="/members" className={navLinkClasses}>Members</Link>
              </>
            )}
            {userInfo && userInfo.isAdmin && (
              <>
                <Link to="/admin/create-event" className={navLinkClasses}>Create</Link>
                <Link to="/admin/approve-members" className={adminLinkClasses}>
                  Approve
                  {pendingCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white font-sans text-xs ring-2 ring-yellow-400">
                      {pendingCount}
                    </span>
                  )}
                </Link>
              </>
            )}
          </div>
          
          {/* Right Side Auth */}
          <div className="flex items-center">
              {userInfo ? (
              <div className="flex items-center gap-3">
                <span className="font-bold text-black text-sm">Hi, {userInfo.name.split(' ')[0]}</span>
                <button
                  onClick={logoutHandler}
                  className="font-bold bg-red-600 text-white text-xs px-3 py-1 rounded-full border-2 border-white hover:bg-white hover:text-red-600 transition-colors duration-200"
                >
                  Exit
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className={navLinkClasses}>Login</Link>
                <Link to="/register" className="font-bold bg-black text-white text-sm px-4 py-2 rounded-full border-2 border-white hover:bg-white hover:text-black transition-colors duration-200">
                  Register
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
};

export default Navbar;
