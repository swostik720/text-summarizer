import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, UserCircle } from 'lucide-react';
import Sidebar from './components/Sidebar';
import SummaryForm from './components/SummaryForm';
import SummaryDetail from './components/SummaryDetail';
import axios from './axios';

function SummaryApp() {
  const [selectedSummary, setSelectedSummary] = useState(null);
  const [reload, setReload] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('/user');
        setUser(res.data);
      } catch (err) {
        console.error('Error fetching user:', err);
        navigate('/');
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      const loginToken = localStorage.getItem("loginToken");
      if (!loginToken) return;

      const response = await fetch("http://127.0.0.1:8000/api/logout", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${loginToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        localStorage.removeItem("loginToken");
        setUser(null);
        navigate("/");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white transition-colors">
      <Sidebar setSelectedSummary={setSelectedSummary} reload={reload} />
      <main className="flex-1 p-6 overflow-y-auto relative">
        <div className="flex justify-end items-center gap-4 mb-4">
          {user && (
            <div className="relative group">
              <UserCircle className="w-7 h-7 text-indigo-600 dark:text-indigo-300 cursor-pointer" />
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                {user.name}
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="text-red-500 hover:text-red-600"
            title="Logout"
          >
            <LogOut className="w-6 h-6" />
          </button>
        </div>

        {!selectedSummary ? (
          <SummaryForm onSummaryCreated={() => setReload(!reload)} />
        ) : (
          <SummaryDetail
            summary={selectedSummary}
            onBack={() => setSelectedSummary(null)}
            onUpdate={() => setReload(!reload)}
          />
        )}
      </main>
    </div>
  );
}

export default SummaryApp;
