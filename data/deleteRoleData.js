import { deleteDoc, doc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebaseconfig';

export const deleteRoleData = async (roleHashtag) => {
  try {
    // 1. Delete the hashtag entry
    await deleteDoc(doc(db, 'hashtags', roleHashtag));

    // 2. Delete groups owned by this role
    const groupSnap = await getDocs(query(collection(db, 'groups'), where('owner', '==', `/users/${roleHashtag}`)));
    await Promise.all(groupSnap.docs.map(d => deleteDoc(doc(db, 'groups', d.id))));

    // 3. Delete availabilities by this role
    const availSnap = await getDocs(query(collection(db, 'availabilities'), where('userHashtag', '==', roleHashtag)));
    await Promise.all(availSnap.docs.map(d => deleteDoc(doc(db, 'availabilities', d.id))));

    // 4. Delete chats containing this hashtag in participants
    const chatSnap = await getDocs(collection(db, 'chats'));
    const matchingChats = chatSnap.docs.filter(d => (d.data().participants || []).includes(roleHashtag));
    await Promise.all(matchingChats.map(d => deleteDoc(doc(db, 'chats', d.id))));

    console.log(`✅ Successfully deleted all Firestore data related to role hashtag: ${roleHashtag}`);
  } catch (err) {
    console.error(`❌ Failed to delete data for hashtag "${roleHashtag}":`, err);
  }
};
