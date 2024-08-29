import React from "react";
import Navbar from "@/components/ui/Navbar";
import NewPost from "@/components/NewPost";
import UserPostTwo from "@/components/UserPostTwo";

export default function Home() {
  return (
    <div className="bg-[#242424]">
      <Navbar />
      <div className="pt-20">
        <NewPost />
        <UserPostTwo />
      </div>
    </div>
  );
}
