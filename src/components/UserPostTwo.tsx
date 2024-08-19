"use client";

import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
  increment,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { timeAgo } from "./TimeAgo";

interface Comment {
  id: string;
  userName: string;
  content: string;
  timestamp: any;
  likes: number;
}

interface Post {
  id: string;
  userName: string | null;
  userTitle: string;
  content: string;
  createdAt: FirebaseFirestore.Timestamp;
  likes: number;
  comments: Comment[];
}

export default function UserPostTwo() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Post[];
      setPosts(postsData);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center">
      {posts.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}
    </div>
  );
}

const handleAddPost = async () => {
  try {
    await addDoc(collection(db, "posts"), {
      title: "My New Post",
      content: "Post content goes here...",
      createdAt: serverTimestamp(),
      // other fields...
    });
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

function PostItem({ post }: { post: Post }) {
  return (
    <div className="bg-slate-300 p-4 rounded-2xl mb-4 w-full max-w-xl mx-auto">
      <PostHeader post={post} />
      <p className="mt-4">{post.content}</p>
      <PostActions postId={post.id} />
    </div>
  );
}

function PostHeader({ post }: { post: Post }) {
  return (
    <div className="flex flex-row items-center">
      <div className="bg-blue-200 rounded-full border border-red-500 h-14 w-14 m-1"></div>
      <div className="flex flex-col ml-2">
        <h2 className="font-bold">{post.userName ?? "Anonymous"}</h2>
        <p className="text-gray-500 text-xs">
          {post.createdAt ? timeAgo(post.createdAt.toDate()) : "Just now"}
        </p>
      </div>
    </div>
  );
}

function PostActions({ postId }: { postId: string }) {
  const handleLike = async (postId: string) => {
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      likes: increment(1),
    });
  };
  return (
    <div className="flex flex-row gap-4 justify-center mt-4">
      <button
        className="hover:bg-white rounded-md w-36 transition-all"
        onClick={() => handleLike(postId)}
      >
        Like
      </button>
      <button className="hover:bg-white rounded-md w-36 transition-all">
        Comment
      </button>
    </div>
  );
}
