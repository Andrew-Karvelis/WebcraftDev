import React from "react";
import UserPost from "@/components/UserPost";
import Navbar from "@/components/ui/Navbar";
import NewPost from "@/components/NewPost";

export default function Home() {
  return (
    <div className="bg-yellow-100">
      <Navbar />
      <div className="pt-20">
        <NewPost />
        <UserPost />
      </div>
    </div>
  );
}
