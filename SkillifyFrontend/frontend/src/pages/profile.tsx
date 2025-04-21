import React, { useEffect, useState } from "react";
import { auth } from "../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import { fetchUser, updateUser, fetchSkills } from "../api"; // Assuming updateUser is defined in api
import UserProfile from "../components/UserProfile"; // Assuming UserProfile is in components
import { ISkill } from "@/models/ISkill";
import { all } from "axios";

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const { username } = router.query;
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [newSkill, setNewSkill] = useState("");
  const [allSkills, setAllSkills] = useState<ISkill[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        const userData = await fetchUser(username as string);
        const skills = await fetchSkills();
        setAllSkills(skills);

        // Map user skills to skill names
        const userSkills = userData.skills.map((skillId: string) => {
          const skill = skills.find((s) => s._id === skillId);
          return skill ? skill.name : "Unknown skill";
        });

        setUser({ ...userData, skills: userSkills });
      } else {
        router.push("/auth");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [username, router]);

  const handleNewSkillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewSkill(e.target.value);
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() === "") return;

    try {
      const updatedUser = {
        ...user,
        skills: [...user.skills, newSkill.trim()],
      };
      console.log("Updated user:", updatedUser);
      await updateUser(updatedUser);
      setUser(updatedUser);
      setNewSkill("");
    } catch (error) {
      console.error("Error adding skill:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>No user data available.</div>;
  }

  return (
    <div className="h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <UserProfile user={user} />
        <form onSubmit={handleAddSkill} className="mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Add a new skill:
            </label>
            <input
              type="text"
              value={newSkill}
              onChange={handleNewSkillChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-black"
            />
          </div>
          <button
            type="submit"
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg"
          >
            Save
          </button>
        </form>
        <div className="mt-4">
          <button
            onClick={() =>
              router.push({
                pathname: "/dashboard",
                query: { username: username as string },
              })
            }
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
