// src/pages/dashboard.tsx
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth } from "../firebase/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { fetchSkills, fetchUsersBySkill, submitRequest } from "../api";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "../components/RequestCard";
import Link from "next/link";
import { LayoutDashboard, Users } from "lucide-react";
import { User } from "../models/user";
import { ISkill } from "../models/ISkill";
import { IUser } from "@/models/IUser";

const Dashboard: React.FC = () => {
  const router = useRouter();
  const { username } = router.query;
  const [selectedSkill, setSelectedSkill] = useState<string>("");
  const [skills, setSkills] = useState<ISkill[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filteredUsers, setFilteredUsers] = useState<IUser[]>([]);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    const getSkills = async () => {
      try {
        const skillsData: ISkill[] = await fetchSkills();
        // console.log("Skills:", skillsData);
        setSkills(skillsData);
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };

    getSkills();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/auth");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/auth");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleSkillChange = async (skill: string) => {
    setSelectedSkill(skill);
    setLoading(true);
    try {
      const users: IUser[] = await fetchUsersBySkill(skill);
      console.log("Users:", users[0].skills);
      setFilteredUsers(users);
    } catch (error) {
      console.error("Error fetching users by skill:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestClick = (user: IUser) => {
    setSelectedUser(user);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedUser(null);
    setDescription("");
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(event.target.value);
  };

  const navigateToPeopleRequest = () => {
    if (username) {
      router.push({
        pathname: "/peopleRequest",
        query: { username: username as string },
      });
    } else {
      console.error("Username is not available");
    }
  };

  const handleSubmitRequest = async () => {
    if (selectedUser && username && description) {
      const requestData = {
        createdBy: username as string,
        createdFor: selectedUser.username,
        title: `Request from ${username} to ${selectedUser.username}`,
        description,
      };

      try {
        await submitRequest(requestData);
        alert("Request submitted successfully");
        handleClosePopup();
      } catch (error) {
        alert("Failed to submit request");
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg rounded-r-lg">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">MyDashboard</h1>
        </div>
        <nav className="mt-6">
          <ul>
            <li>
              <Link
                href="/dashboard"
                className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <LayoutDashboard className="w-6 h-6" />
                <span className="ml-3">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                href={{
                  pathname: "/activities",
                  query: { username: username as string },
                }}
                className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <Users className="w-6 h-6" />
                <span className="ml-3">My Activities</span>
              </Link>
            </li>
            <li>
              <Link
                href={{
                  pathname: "/profile",
                  query: { username: username as string },
                }}
                className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <Users className="w-6 h-6" />
                <span className="ml-3">Profile</span>
              </Link>
            </li>
            <li>
              <Link
                href={{
                  pathname: "/peopleRequest",
                  query: { username: username as string },
                }}
                className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <Users className="w-6 h-6" />
                <span className="ml-3">Request to me</span>
              </Link>
            </li>
            <li>
              <button
                onClick={handleSignOut}
                className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded-lg w-full text-left"
              >
                <Users className="w-6 h-6" />
                <span className="ml-3">Sign Out</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, <span style={{ color: "white" }}>{username}</span>
          </h1>
          {/* <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-red-500 text-white rounded-lg"
          >
            Sign Out
          </button> */}
        </header>

        <section className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Select a Skill
          </h2>
          <select
            value={selectedSkill}
            onChange={(e) => handleSkillChange(e.target.value)}
            className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          >
            <option value="" className="text-gray-400">
              Select a skill
            </option>
            {Array.isArray(skills) &&
              skills.map((skill) => (
                <option key={skill._id} value={skill.name}>
                  {skill.name}
                </option>
              ))}
          </select>
        </section>

        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <p className="text-center col-span-3">Loading users...</p>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{user.username}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Username: {user.username}</p>
                    <p className="text-sm">Skills: {selectedSkill}</p>
                    <button
                      onClick={() => handleRequestClick(user)}
                      className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                    >
                      Request
                    </button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-center col-span-3">
                No users found for the selected skill.
              </p>
            )}
          </div>
        </div>

        {showPopup && selectedUser && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-black">
                Request {selectedUser.username}
              </h3>
              <textarea
                value={description}
                onChange={handleDescriptionChange}
                placeholder="Describe your request"
                className="w-full p-2 border border-gray-300 rounded-lg mb-4 text-black"
              />
              <div className="flex justify-end space-x-4">
                <button
                  onClick={handleSubmitRequest}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                >
                  Submit Request
                </button>
                <button
                  onClick={handleClosePopup}
                  className="px-4 py-2 bg-gray-300 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
