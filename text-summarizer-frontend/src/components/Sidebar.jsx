import React, { useEffect, useState } from 'react';
import axios from '../axios';

const Sidebar = ({ setSelectedSummary, reload }) => {
  const [summaries, setSummaries] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get the authenticated user first
    axios.get('/user').then((res) => {
      setUser(res.data);

      // Depending on admin or not, fetch summaries
      const url = res.data.is_admin ? '/admin/summaries' : '/summaries';
      axios.get(url).then((res) => {
        setSummaries(res.data);
      });
    });
  }, [reload]);

  return (
    <aside className="w-72 bg-white dark:bg-gray-800 p-4 shadow-md space-y-4 border-r">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-indigo-600 dark:text-indigo-300">
          📚 Summaries
        </h2>
      </div>
      <ul className="space-y-2">
        {summaries.map((s) => (
          <li
            key={s.id}
            onClick={() => setSelectedSummary(s)}
            className="cursor-pointer p-2 rounded hover:bg-indigo-100 dark:hover:bg-gray-700"
          >
            {user?.is_admin && s.user ? (
              <div className="text-xs text-gray-400 dark:text-gray-300">
                <strong>{s.user.name}:</strong> {s.summary_text.slice(0, 30)}...
              </div>
            ) : (
              <span>{s.summary_text.slice(0, 30)}...</span>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
