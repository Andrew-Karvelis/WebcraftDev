"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import logo from "../../../public/logo.png";
import AuthSignin from "../auth/AuthModal";
import { getAuth, onAuthStateChanged, signOut, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

export default function Navbar() {
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("auth state changed ", user);
      if (user) {
        setUser(user);

        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUsername(userDoc.data()?.username || null);
        }
      } else {
        setUser(null);
        setUsername(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleOpenLoginModal = () => {
    setOpenLoginModal(true);
  };
  const handleCloseLoginModal = () => {
    setOpenLoginModal(false);
  };

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        setUser(null);
        setUsername(null);
        console.log("User logged out");
      })
      .catch((error) => {
        console.error("Error logging out: ", error);
      });
  };

  return (
    <>
      <nav className="flex justify-around items-center bg-[#242424] w-full h-[68px] fixed text-white z-10">
        <div className="flex gap-2">
          <figure className="w-[48px] ml-4 sm:w-[40px] sm:h-[40px]">
            <Image src={logo} alt="WebCraft Logo" className="invert" />
          </figure>
          <input
            className="rounded-sm mt-1 h-[36px] text-black  pl-1"
            placeholder="Search..."
          />
        </div>

        {user ? (
          <div>
            <span className="mr-8">Welcome, {username ? username : user.email}</span>
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <button
            className="bg-white h-14 w-14 text-red-500"
            onClick={handleOpenLoginModal}
          >
            Login
          </button>
        )}
      </nav>
      {openLoginModal && <AuthSignin onClose={handleCloseLoginModal} />}
    </>
  );
}
