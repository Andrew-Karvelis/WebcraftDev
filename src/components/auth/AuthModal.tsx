"use client";
import React, { useState } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { X } from "lucide-react";

interface AuthModalProps {
  onClose: () => void;
}

export default function AuthModal({ onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        await createUserWithEmailAndPassword(auth, email, password);
        console.log("User signed up");
      }
      onClose();
    } catch (error) {
      const errorCode = (error as { code: string }).code;
      const errorMessage = (error as { message: string }).message;
      console.error("Authentication error", errorCode, errorMessage);
      setError("Authentication failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (email && password) {
      handleAuth();
    } else {
      setError("Please fill in both fields.");
    }
  };

  const toggleModal = () => setIsLogin(!isLogin);

  return (
    <div>
      <div className="fixed inset-0 bg-black bg-opacity-80 z-40"></div>

      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white rounded border border-black w-[600px] h-[500px] relative">
          <button onClick={onClose} className="absolute top-5 right-5"><X  className="hover:text-red-600 cursor-pointer duration-300"/></button>
          <h2 className="font-bold text-2xl text-center pt-12">
            {isLogin ? "Log in to WebCraft" : "Sign up to WebCraft"}
          </h2>
          <div className="absolute bg-gray-300 w-[300px] h-1 rounded left-0 right-0 mx-auto mt-4"></div>
          <form className="flex flex-col items-center mt-16">
            <span className="ml-4 mt-4">Email</span>
            <input
              id="email"
              type="email"
              placeholder="example@example.com"
              className="bg-white rounded ml-4 mt-4 border border-black w-80 p-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <span className="ml-4 mt-4">Password</span>
            <input
              id="password"
              type="password"
              className="bg-white rounded ml-4 mt-4 border border-black w-80 p-1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleClick}
            className="bg-green-400 w-[200px] h-[36px] rounded-sm mt-4 font-bold text-xl text-white shadow">
              {isLogin ? "Login" : "Signup"}
            </button>
          </form>
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
