// firebaseService.js
import { db } from './firebaseConfig';
import { collection, addDoc, getDocs } from 'firebase/firestore';

export const addUserData = async (userData) => {
  try {
    await addDoc(collection(db, 'users'), userData);
    console.log('Document added successfully');
  } catch (error) {
    console.error('Error adding document:', error);
  }
};

export const fetchUserData = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};
