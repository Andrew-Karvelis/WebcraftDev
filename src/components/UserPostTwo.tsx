"use client";

import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  updateDoc,
  doc,
  increment,
  arrayRemove,
  arrayUnion,
  getDocs,
  onSnapshot,
} from "firebase/firestore";

import { db, auth } from "@/lib/firebaseConfig";
import { timeAgo } from "./TimeAgo";
import { MessageSquareIcon, Send, ThumbsDown, ThumbsUp } from "lucide-react";
import { ThumbsUp as SolidThumbsUp } from "lucide-react";
import CommentModal from "./ui/CommentModal";
import { Post, Comment } from "@/types/interfaces";

export default function UserPostTwo() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [currPostId, setCurrPostId] = useState<string | null>(null);
  useEffect(() => {
    const fetchPostsAndComments = () => {
      const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
  
      const unsubscribePosts = onSnapshot(q, (snapshot) => {
        const postsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Post[];
  
        // Fetch comments for each post with real-time updates
        postsData.forEach((post, index) => {
          const commentsRef = collection(db, "posts", post.id, "comments");
          const unsubscribeComments = onSnapshot(commentsRef, (commentsSnapshot) => {
            const comments = commentsSnapshot.docs.map((commentDoc) => ({
              id: commentDoc.id,
              ...commentDoc.data(),
            })) as Comment[];
  
            // Update the postsData with the fetched comments
            postsData[index].comments = comments;
            setPosts([...postsData]); // Ensure state updates correctly
          });
  
          // Clean up the comments listener
          return () => unsubscribeComments();
        });
      });
  
      // Clean up the posts listener
      return () => unsubscribePosts();
    };
  
    fetchPostsAndComments();
  }, []);

  const handleOpenModal = (postId: string) => {
    console.log("this ran");
    setCurrPostId(postId);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrPostId(null);
  };

  const selectedPost = posts.find((post) => post.id === currPostId);

  return (
    <div className="flex flex-col justify-center items-center">
      {posts.map((post) => (
        <PostItem key={post.id} post={post} handleOpenModal={handleOpenModal} />
      ))}

      {modalOpen && selectedPost && (
        <CommentModal
          post={selectedPost}
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
        />
      )}
    </div>
  );
}

function PostItem({
  post,
  handleOpenModal,
}: {
  post: Post;
  handleOpenModal: (postId: string) => void;
}) {
  return (
    <div className="bg-slate-300 p-4 rounded-2xl mb-4 w-full max-w-xl mx-auto">
      <PostHeader post={post} />
      <p className="mt-4">{post.content}</p>
      <PostActions post={post} handleOpenModal={handleOpenModal} />
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

function PostActions({
  post,
  handleOpenModal,
}: {
  post: Post;
  handleOpenModal: (postId: string) => void;
}) {
  const [isLiked, setIsLiked] = useState(false);
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (currentUser && post.likedBy?.includes(currentUser.uid)) {
      setIsLiked(true);
    }
  }, [currentUser, post.likedBy]);

  const handleLike = async () => {
    if (!currentUser) return;

    const postRef = doc(db, "posts", post.id);

    if (isLiked) {
      await updateDoc(postRef, {
        likes: increment(-1),
        likedBy: arrayRemove(currentUser.uid),
      });
      setIsLiked(false);
    } else {
      await updateDoc(postRef, {
        likes: increment(1),
        likedBy: arrayUnion(currentUser.uid),
      });
      setIsLiked(true);
    }
  };
  return (
    <div className="flex flex-col mt-4">
      <div className="flex flex-row gap-4 justify-end mr-2">
        <div className="flex gap-2 items-center">
          {isLiked ? (
            <SolidThumbsUp fill="lime" className="text-black" />
          ) : (
            <ThumbsUp />
          )}
          <span>{post.likes}</span>
        </div>
        <div className="flex gap-2 items-center">
          <MessageSquareIcon />
          <span>{post.comments?.length}</span>
        </div>
      </div>
      <div className="flex flex-row gap-4 justify-center mt-4">
        <button
          className="hover:bg-white rounded-md w-36 transition-all"
          onClick={handleLike}
        >
          Like
        </button>
        <button
          className="hover:bg-white rounded-md w-36 transition-all"
          onClick={() => handleOpenModal(post.id)}
        >
          Comment
        </button>
      </div>
    </div>
  );
}
