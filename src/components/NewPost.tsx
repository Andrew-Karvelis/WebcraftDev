"use client";
import React, { useState } from "react";
import { Send, Image } from "lucide-react";
import { addPost } from "../lib/firestoreService";

export default function NewPost() {
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    if (!content.trim()) return;
    await addPost(content);
    setContent("");
  };
// ADD CHECK IF USER IS AUTHENTICATED HERE
  return (
    <div className="bg-slate-300 p-4 rounded-2xl mb-4 w-full max-w-xl mx-auto">
      <div className="flex items-center">
        <div className="bg-blue-500 rounded-full border border-red-500 h-14 w-14 m-1">
          YOU
        </div>
        <div className="relative flex ml-2 h-10 items-center">
          <textarea
            className="relative resize-none w-[400px] focus:outline-none rounded-sm p-2 mr-2"
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button
            className="absolute bottom-[-5px] right-12"
            onClick={handleSubmit}
          >
            <Send className="w-5 h-5" />
          </button>
          <button className="h-5 w-5">
            <Image />
          </button>
        </div>
      </div>
    </div>
  );
}
