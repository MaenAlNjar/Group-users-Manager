import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GroupsList from "../Group/GroupList.js";

const Dashboard = () => {
  const [userName, setUserName] = useState("");
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserName(parsedUser.name || "Guest"); 
      } catch (error) {
        console.error("Failed to parse user data from localStorage:", error);
      }
    }
  }, []);

  const handleCreateGroup = async () => {
    if (!groupName || !groupDescription) {
      alert("Please provide a name and description for the group.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8800/group/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: groupName,
          description: groupDescription,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create group");
      }

      alert("Group created successfully!");
      setGroupName("");
      setGroupDescription("");
    } catch (error) {
      console.error("Error creating group:", error);
      alert("An error occurred while creating the group.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 flex justify-center items-center flex-col gap-6">
      <div className="bg-white  rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
          Dashboard
        </h2>
        <p className="text-center text-gray-700">
          Welcome, <span className="font-bold text-blue-600">{userName}</span>!
        </p>
      
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-96">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Create New Group
        </h3>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Group Name</label>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="Enter group name"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Description</label>
          <textarea
            value={groupDescription}
            onChange={(e) => setGroupDescription(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="Enter group description"
          />
        </div>
        <button
          onClick={handleCreateGroup}
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg"
        >
          {loading ? "Creating..." : "Create Group"}
        </button>
      </div>

      <div className="mt-6 ">
      <p className="text-center mt-4 text-gray-600">
          Here you can manage your profile and other details.
        </p>
        <GroupsList />
      </div>
    </div>
  );
};

export default Dashboard;
