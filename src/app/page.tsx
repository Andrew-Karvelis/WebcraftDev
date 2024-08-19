import React from "react";
import UserPost from "@/components/UserPost";
import Navbar from "@/components/ui/Navbar";
import NewPost from "@/components/NewPost";
import UserPostTwo from "@/components/UserPostTwo";

export default function Home() {
  return (
    <div className="bg-yellow-100">
      <Navbar />
      <div className="pt-20">
        <NewPost />
        <UserPostTwo />
      </div>
    </div>
  );
}
