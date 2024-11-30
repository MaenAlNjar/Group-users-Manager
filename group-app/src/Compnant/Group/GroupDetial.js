import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const GroupDetail = () => {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [usersNotInGroup, setUsersNotInGroup] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const groupResponse = await fetch(`http://localhost:8800/group/group/${id}`);
        if (!groupResponse.ok) {
          throw new Error("Failed to fetch group");
        }
        const groupData = await groupResponse.json();
        setGroup(groupData);

        const usersResponse = await fetch(`http://localhost:8800/group/usereNotInGroup/${id}`);
        if (!usersResponse.ok) {
          throw new Error("Failed to fetch users not in group");
        }
        const usersData = await usersResponse.json();
        setUsersNotInGroup(usersData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupDetails();
  }, [id]);

  const handleDrop = async (event) => {
    const userId = event.dataTransfer.getData("text/plain");
    try {
      const response = await fetch("http://localhost:8800/group/addUser", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, groupId: id }),
      });
      if (!response.ok) {
        throw new Error("Failed to add user to group");
      }

      const addedUser = usersNotInGroup.find((user) => user.id === userId);
      setGroup((prev) => ({
        ...prev,
        users: [...prev.users, addedUser],
      }));
      setUsersNotInGroup((prev) => prev.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Error adding user to group:", error.message);
    }
  };

  const handleDragStart = (event, userId) => {
    event.dataTransfer.setData("text/plain", userId);
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-7xl mx-auto mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Group Details Section */}
      <div
        className="bg-white p-6 rounded-lg shadow-lg"
        onDragOver={(event) => event.preventDefault()} // Allow dropping
        onDrop={handleDrop} // Handle drop event 
      >
        <h2 className="text-2xl font-bold text-gray-800">{group.name}</h2>
        <p className="text-gray-600 mt-4">{group.description}</p>
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-gray-800">Users in this group:</h3>
          <ul className="mt-4 space-y-4">
            {group.users.map((user) => (
              <li key={user.id} className="p-4 bg-gray-50 rounded-lg shadow-md">
                <p className="font-semibold text-gray-800">{user.name}</p>
                <p className="text-gray-600">{user.email}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Users Not in Group Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800">Users not in this group:</h3>
        <ul className="mt-4 space-y-4">
          {usersNotInGroup.map((user) => (
            <li
              key={user.id}
              className="p-4 bg-gray-50 rounded-lg shadow-md cursor-pointer"
              draggable
              onDragStart={(event) => handleDragStart(event, user.id)} 
            >
              <p className="font-semibold text-gray-800">{user.name}</p>
              <p className="text-gray-600">{user.email}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GroupDetail;
