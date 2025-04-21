// src/app/auth.tsx
import { useState, FormEvent } from "react";
import { auth } from "../firebase/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useRouter } from "next/router";
import { createUser, fetchUser } from "../api";
// import { useUser } from '../app/page';

// Define form event handler types
const AuthPage: React.FC = () => {
  // const { setUsername } = useUser();
  const [email, setEmail] = useState<string>("");
  const [username, setUsernameInput] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState<boolean>(true); // Toggle between login and signup
  const router = useRouter();

  const validateUsername = (username: string) => {
    const regex = /^[a-zA-Z0-9_]{3,30}$/;
    return regex.test(username);
  };

  // Handle user registration
  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !username || !password) {
      setError("All fields are required.");
      return;
    }
    if (!validateUsername(username)) {
      setError(
        "Usernames must be between 3 to 30 characters, consisting only of alphanumeric characters and underscores."
      );
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User signed up:", userCredential.user);

      console.log(
        "Creating user:",
        username,
        email,
        `${firstName} ${lastName}`
      );
      // Send username and email to the server
      await createUser({
        username: username,
        name: `${firstName} ${lastName}`,
        email: email,
      });

      router.push({
        pathname: "/dashboard",
        query: { username },
      });
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  // Handle user login
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError("All fields are required.");
      return;
    }
    try {
      // Fetch email using username
      const response = await fetchUser(username);
      const email = response.email;
      // const email = username;

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User logged in:", userCredential.user);
      router.push({
        pathname: "/dashboard",
        query: { username },
      });
    } catch (error) {
      console.error("Error logging in:", error);
      setError("Error logging in. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          {isLogin ? "Login" : "Sign Up"}
        </h2>
        <form onSubmit={isLogin ? handleLogin : handleSignUp}>
          {!isLogin && (
            <>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-bold mb-2 text-gray-800"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded text-black"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="firstName"
                  className="block text-sm font-bold mb-2 text-gray-800"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded text-black"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="lastName"
                  className="block text-sm font-bold mb-2 text-gray-800"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded text-black"
                />
              </div>
            </>
          )}
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-bold mb-2 text-gray-800"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsernameInput(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded text-black"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-bold mb-2 text-gray-800"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded text-black"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="w-full text-white hover:underline"
            >
              {isLogin ? "Create an account" : "Already have an account? Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
