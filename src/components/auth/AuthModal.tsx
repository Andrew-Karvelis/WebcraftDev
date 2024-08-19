"use client";
import React, { useState } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { X } from "lucide-react";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

interface AuthModalProps {
  onClose: () => void;
}

export default function AuthModal({ onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const auth = getAuth();

  const handleAuth = async () => {
    setLoading(true);
    setError(null);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        console.log("User signed in");
      } else {
        if (!username) {
          setError("Please provide a username.");
          setLoading(false);
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        // Save the username to Firestore
        await setDoc(doc(db, "users", user.uid), {
          username,
          email: user.email,
        });
        await updateProfile(user, { displayName: username });

        console.log("User signed up with username:", username);
      }
      onClose();
    } catch (error) {
      const errorCode = (error as { code: string }).code;
      const errorMessage = (error as { message: string }).message;
      console.error("Authentication error", errorCode, errorMessage);
      setError(`Authentication failed. ${errorMessage}.`);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // For login, check if email and password are filled
    if (isLogin) {
      if (email && password) {
        handleAuth();
      } else {
        setError("Please fill in all fields.");
        console.log("Please fill in all fields");
      }
    } else {
      // For signup, check if email, password, and username are filled
      if (email && password && username) {
        handleAuth();
      } else {
        setError("Please fill in all fields.");
        console.log("Please fill in all fields");
      }
    }
  };

  const toggleModal = () => setIsLogin(!isLogin);

  return (
    <div>
      <div className="fixed inset-0 bg-black bg-opacity-80 z-40"></div>

      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white rounded border border-black w-[600px] h-[600px] relative">
          {" "}
          {/* Updated height */}
          <button onClick={onClose} className="absolute top-5 right-5">
            <X className="hover:text-red-600 cursor-pointer duration-300" />
          </button>
          <h2 className="font-bold text-2xl text-center pt-12">
            {isLogin ? "Log in to WebCraft" : "Sign up to WebCraft"}
          </h2>
          <div className="absolute bg-gray-300 w-[300px] h-1 rounded left-0 right-0 mx-auto mt-4"></div>
          <form className="flex flex-col items-center mt-16">
            {!isLogin && ( // Only show username field during signup
              <>
                <span className="mt-4 text-center">Username</span>
                <input
                  id="username"
                  type="text"
                  placeholder="Enter a username"
                  className="bg-white rounded mt-4 border border-black w-80 p-1"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </>
            )}
            <span className="mt-4 text-center">Email</span>
            <input
              id="email"
              type="email"
              placeholder="example@example.com"
              className="bg-white rounded mt-4 border border-black w-80 p-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <span className="mt-4">Password</span>
            <input
              id="password"
              type="password"
              className="bg-white rounded mt-4 border border-black w-80 p-1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              onClick={handleClick}
              className="bg-green-400 w-[200px] h-[36px] rounded-sm mt-4 font-bold text-xl text-white shadow"
            >
              {isLogin ? "Login" : "Signup"}
            </button>
          </form>
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
          <div className="text-center text-blue-500 mt-4">
            <button onClick={toggleModal}>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
