import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GroupsList = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch('http://localhost:8800/group');
        if (!response.ok) {
          throw new Error('Failed to fetch groups');
        }
        const data = await response.json();
        setGroups(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  const handleGroupClick = (groupId) => {
    navigate(`/group/${groupId}`);
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-6xl mx-auto mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
      {groups.map((group) => (
        <div
          key={group.id}
          className="group relative bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 rounded-xl p-6 shadow-lg cursor-pointer transition-transform transform hover:scale-105"
          onClick={() => handleGroupClick(group.id)}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-gray-800 to-transparent opacity-0 group-hover:opacity-30 rounded-xl transition-opacity"></div>
          <h3 className="text-2xl font-bold text-gray-800 group-hover:text-white transition-colors">
            {group.name}
          </h3>
          <p className="text-gray-700 mt-2 group-hover:text-gray-100 transition-colors">
            {group.description}
          </p>
          <div className="absolute bottom-4 right-4 text-gray-500 group-hover:text-white transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GroupsList;
