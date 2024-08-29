import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import { Send, ThumbsUp } from "lucide-react";
import { timeAgo } from "../TimeAgo";
import { Post, Comment } from "@/types/interfaces";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  doc,
  updateDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebaseConfig";
import { addComment } from "@/lib/firestoreService";
import { useAuthState } from "react-firebase-hooks/auth";

interface CommentModalProps {
  post: Post;
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
}

export default function CommentModal({
  post,
  modalOpen,
  setModalOpen,
}: CommentModalProps) {
  const [user] = useAuthState(auth);
  const [content, setContent] = useState<string>("");

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert("You must be logged in to comment!");
      return;
    }

    if (!content.trim()) {
      alert("Comment cannot be left empty!");
      return;
    }

    try {
      await addComment({
        postId: post.id,
        content: content.trim(),
        userId: user.uid,
        userName: user.displayName || user.email,
      });
      setContent("");
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("An error occurred while submitting the comment.");
    }
  };

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogContent className="w-full max-w-2xl p-4 md:p-8 lg:p-12 mx-auto h-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center border-b-2 pb-4 text-green-500">
            {post.userName}'s Post
          </DialogTitle>
          <DialogDescription className="border-b-2 p-4 text-red-500">
            {post.content}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 max-h-[70vh] overflow-y-auto">
          {post.comments?.map((comment) => (
            <div key={comment.id} className="flex">
              <div className="bg-blue-200 rounded-full border border-red-500 h-10 w-10 m-1"></div>
              <div className="flex flex-col ml-2">
                <div className="text-sm bg-slate-300 rounded-sm p-2">
                  <h2 className="font-bold">{comment.userName}</h2>
                  <p>{comment.content}</p>
                </div>
                <div className="flex flex-row text-xs gap-4">
                  <p className="text-gray-500 text-xs">
                    {timeAgo(comment.timestamp?.toDate())}
                  </p>
                  <button className="hover:bg-gray-300 rounded-md transition-all">
                    Like
                  </button>
                  <div className="flex items-center">
                    {comment.likes}
                    <ThumbsUp className="h-4 ml-1" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center mt-4">
          <div className="bg-blue-600 rounded-full border border-red-500 h-10 w-10 mr-3 text-center">
            YOU
          </div>
          <textarea
            className="relative w-[600px] h-24 p-2 mb-2 border resize-none border-gray-300 rounded-md overflow-y-auto"
            placeholder="Write a comment..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button
            onClick={handleSubmitComment}
            className="absolute bottom-3 right-6"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
