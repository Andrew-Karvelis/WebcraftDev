"use client";

import React, { useState, useEffect } from "react";
import { ThumbsUp, MessageSquareIcon, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { timeAgo } from "./TimeAgo";

interface Comment {
  id: string;
  userName: string;
  content: string;
  createdAt: FirebaseFirestore.Timestamp;
  likes:number;
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

export default function UserPost() {
  const [isClicked, setIsClicked] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [currPostId, setCurrPostId] = useState<number | null>(null);
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

  const handleOpen = (postId: number) => {
    setModalOpen(true);
    setCurrPostId(postId);
  };

  const handleClose = () => {
    setModalOpen(false);
    setCurrPostId(null);
  };

  return (
    <div className="flex flex-col justify-center items-center">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-slate-300 p-4 rounded-2xl mb-4 w-full max-w-xl mx-auto"
        >
          <div className="flex flex-row items-center">
            <div className="bg-blue-200 rounded-full border border-red-500 h-14 w-14 m-1"></div>
            <div className="flex flex-col ml-2">
              <h2 className="font-bold ">{post.userName ?? "Anonymous"}</h2>
              <h3 className="text-gray-600 text-sm">{post.userTitle}</h3>
              <p className="text-gray-500 text-xs">
                {timeAgo(post.createdAt.toDate())}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <p>{post.content}</p>
          </div>

          <div className="flex flex-col mt-4">
            <div className="flex flex-row gap-4 justify-end">
              <div className="flex gap-2">
                {post.likes} <ThumbsUp />
              </div>
              <div className="flex gap-2">
                {post.comments?.length} <MessageSquareIcon />
              </div>
            </div>
            <div className="flex flex-row gap-4 justify-center mt-4">
              <button
                className={`hover:bg-white relative rounded-md w-36 overflow-hidden transition-all
                }`}
              >
                <span className="absolute inset-0  opacity-50"></span>
                <span className="relative z-10">Like</span>
              </button>
              <button
                className={`hover:bg-white rounded-md w-36 transition-all ${
                  isClicked &&
                  "transform translate-y-0.5 transition-all duration-300"
                }`}
                // onClick={() => handleOpen(post.id)}
              >
                Comment
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogTrigger asChild>
          <button className="hidden">Open Dialog</button>
        </DialogTrigger>
        <DialogContent className="w-full max-w-2xl p-4 md:p-8 lg:p-12 mx-auto h-full max-h-[90vh] overflow-y-auto">
          {currPost && (
            <>
              <DialogHeader>
                <DialogTitle className="text-center border-b-2 pb-4 text-green-500">
                  {currPost.userName}'s Post
                </DialogTitle>
                <DialogDescription className="border-b-2 p-4 text-red-500">
                  {currPost.post}
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-2  max-h-[70vh]">
                {currPost.comments.map((comment) => (
                  <div key={comment.id} className="flex">
                    <div className="bg-blue-200 rounded-full border border-red-500 h-10 w-10 m-1"></div>
                    <div className="flex flex-col ml-2">
                      <div className="text-sm bg-slate-300 rounded-sm p-2">
                        <h2 className="font-bold">{comment.userName}</h2>
                        <p>{comment.comment}</p>
                      </div>
                      <div className="flex flex-row text-xs gap-4">
                        <p className="text-gray-500 text-xs">
                          {timeAgo(comment.timestamp)}
                        </p>
                        <button
                          className={`hover:bg-gray-300 rounded-md transition-all ${
                            isClicked &&
                            "transform translate-y-0.5 transition-all duration-0"
                          }`}
                        >
                          Like
                        </button>
                        <div className="flex">
                          {comment.likes}
                          <ThumbsUp className="h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          <div className="absolute bottom-0 right-2 flex">
            <div className="bg-blue-600 rounded-full border border-red-500 h-10 w-10 mr-3 text-center">
              YOU
            </div>
            <textarea
              className="relative w-[600px] h-24 p-2 mb-2 border resize-none border-gray-300 rounded-md overflow-y-auto"
              placeholder="Write a comment..."
            />
            <button className="absolute bottom-3 right-6">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </DialogContent>
      </Dialog> */}
    </div>
  );
}
