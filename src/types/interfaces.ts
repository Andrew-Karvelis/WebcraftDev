export interface Comment {
  id: string;
  userName: string;
  userTitle: string;
  content: string;
  timestamp: any;
  likes: number;
  likedBy: string[];
}

export interface Post {
  id: string;
  userName: string | null;
  userTitle: string;
  content: string;
  createdAt: FirebaseFirestore.Timestamp;
  likes: number;
  comments: Comment[];
  likedBy: string[];
}

export interface AddPostParams {
  content: string;
  userId: string;
  userName: string | null;
}

export interface AddCommentParams {
  content: string;
  userId: string;
  userName: string | null;
  postId: string;
}
