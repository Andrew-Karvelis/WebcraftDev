"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { timeAgo } from "./TimeAgo";

export default function UserPost() {
  const [isClicked, setIsClicked] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [currPostId, setCurrPostId] = useState<number | null>(null);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => {
      setIsClicked(false);
    }, 100);
  };

  const handleOpen = (postId: number) => {
    setModalOpen(true);
    setCurrPostId(postId);
  };
  const handleClose = () => {
    setModalOpen(false);
    setCurrPostId(null);
  };

  const currPost = userPosts.find((post) => post.id === currPostId);

  return (
    <div className="flex flex-col justify-center items-center">
      {userPosts.map((post) => (
        <div
          key={post.id}
          className="bg-slate-300 p-4 flex-col rounded-2xl mb-4 w-full max-w-xl mx-auto"
        >
          <div className="flex flex-row items-center">
            <div className="bg-blue-200 rounded-full border border-red-500 h-14 w-14 m-1"></div>
            <div className="flex flex-col ml-2">
              <h2 className="font-bold ">{post.userName}</h2>
              <h3 className="text-gray-600 text-sm">{post.userTitle}</h3>
              <p className="text-gray-500 text-xs">{timeAgo(post.timestamp)}</p>
            </div>
          </div>

          <div className="mt-4">
            <p>{post.post}</p>
          </div>

          <div className="flex flex-col mt-4">
            <div className="flex flex-row gap-4 justify-end">
              <div>{post.likes}</div>
              <div>{post.comments.length}</div>
            </div>
            <div className="flex flex-row gap-4 justify-center mt-4">
              <button
                className={`hover:bg-gray-300 rounded-md w-36 transition-all ${
                  isClicked &&
                  "transform translate-y-0.5 transition-all duration-0"
                }`}
                onClick={handleClick}
              >
                Like
              </button>
              <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogTrigger asChild>
                  <button
                    className={`hover:bg-gray-300 rounded-md w-36 transition-all ${
                      isClicked &&
                      "transform translate-y-0.5 transition-all duration-0"
                    }`}
                    onClick={() => handleOpen(post.id)}
                  >
                    Comment
                  </button>
                </DialogTrigger>
                <DialogContent className="w-full max-w-2xl p-4 md:p-8 lg:p-12 mx-auto h-full max-h-[80vh] overflow-y-auto">
                  {currPost && (
                    <>
                      <DialogHeader>
                        <DialogTitle className="text-center border-b-2 pb-4">
                          {currPost.userName}'s Post
                        </DialogTitle>
                        <DialogDescription className="border-b-2 p-2">
                          {currPost.post}
                        </DialogDescription>
                      </DialogHeader>
                      {currPost.comments.map((comment) => (
                        <div key={comment.id}>
                          <div className="flex flex-row items-center">
                            <div className="bg-blue-200 rounded-full border border-red-500 h-10 w-10 m-1"></div>
                            <div className="flex flex-col ml-2">
                              <div className="text-sm bg-slate-300 rounded-sm p-2">
                                <h2 className="font-bold">
                                  {comment.userName}
                                </h2>
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
                                  onClick={handleClick}
                                >
                                  Like
                                </button>
                                <div>{comment.likes}THUMB</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                  <textarea
                    className="w-full h-24 p-2 border resize-none border-gray-300 rounded-md mt-2"
                    placeholder="Write a comment..."
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

interface Comment {
  userName: string;
  likes: number;
  comment: string;
  timestamp: string;
}

interface Post {
  id: number;
  userName: string;
  userTitle: string;
  post: string;
  timestamp: string;
  likes: number;
  comments: Comment[];
}

const userPosts = [
  {
    id: 1,
    userName: "JoeMan",
    userTitle: "Backend Bandit",
    post: "I am chillin",
    timestamp: "2024-07-31",
    likes: 23,
    comments: [
      {
        id: 1,
        userName: "Alex D.",
        likes: 3,
        comment: "Great post!",
        timestamp: "2024-07-31",
      },
    ],
  },
  {
    id: 2,
    userName: "Trum Pet",
    userTitle: "Frontend Flash",
    post: "The rock be cookin",
    timestamp: "2024-07-31T14:00:00Z",
    likes: 17,
    comments: [
      {
        id: 1,
        userName: "Sam T.",
        likes: 1,
        comment: "Interesting perspective!",
        timestamp: "2024-07-31",
      },
    ],
  },
  {
    id: 3,
    userName: "Boss",
    userTitle: "The Boss",
    post: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dignissimos, repellat quam odit illo sapiente possimus temporibus ipsam excepturi repudiandae. Quia a ex quasi nostrum voluptatum expedita magnam placeat fuga deserunt.",
    timestamp: "2024-07-31",
    likes: 15,
    comments: [
      {
        id: 1,
        userName: "Sam B",
        likes: 2,
        comment: "Interesting!",
        timestamp: "2024-07-31",
      },
      {
        id: 2,

        userName: "Adam C",
        likes: 0,
        comment: "Good work mate!",
        timestamp: "2024-07-31",
      },
      {
        id: 3,

        userName: "Crew Sader",
        likes: 5,
        comment: "Try JavaScript instead for a successful life!",
        timestamp: "2024-07-31",
      },
      {
        id: 4,
        userName: "Sam B",
        likes: 2,
        comment: "Interesting!",
        timestamp: "2024-07-31",
      },
      {
        id: 5,

        userName: "Adam C",
        likes: 0,
        comment: "Good work mate!",
        timestamp: "2024-07-31",
      },
      {
        id: 6,

        userName: "Crew Sader",
        likes: 5,
        comment: "Try JavaScript instead for a successful life!",
        timestamp: "2024-07-31",
      },
    ],
  },
];
