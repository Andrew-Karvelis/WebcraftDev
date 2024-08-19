import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebaseConfig';

interface AddPostParams {
  content: string;
  userId: string;
  userName: string | null;
}

export async function addPost({ content, userId, userName }: AddPostParams) {
  try {
    const docRef = await addDoc(collection(db, 'posts'), {
      userId,
      userName,
      content,
      createdAt: serverTimestamp(),
      likes: 0,
    });
    console.log('Document written with ID: ', docRef.id);
  } catch (error) {
    console.error('Error adding document: ', error);
  }
}