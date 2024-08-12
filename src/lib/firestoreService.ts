// lib/firestoreService.ts
import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

export async function addPost(content: string) {
  try {
    const docRef = await addDoc(collection(db, 'posts'), {
      content,
      createdAt: new Date(),
    });
    console.log('Document written with ID: ', docRef.id);
  } catch (error) {
    console.error('Error adding document: ', error);
  }
}
