import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { AddCommentParams, AddPostParams } from "@/types/interfaces";

export async function addPost({ content, userId, userName }: AddPostParams) {
  try {
    const docRef = await addDoc(collection(db, "posts"), {
      userId,
      userName,
      content,
      createdAt: serverTimestamp(),
      likes: 0,
      likedBy: [],
      comments: [],
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding document: ", error);
  }
}

export async function addComment({
  postId,
  content,
  userId,
  userName,
}: AddCommentParams) {
  try {
    const commentRef = collection(db, "posts", postId, "comments");
    await addDoc(commentRef, {
      content,
      userId,
      userName,
      timestamp: serverTimestamp(),
      likes: 0,
    });
    console.log("Comment added successfully");
  } catch (error) {
    console.error("Error adding comment: ", error);
  }
}
