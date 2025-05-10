//userDataLoader.js
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebaseconfig';

export const loadCompleteUserData = async (hashtag) => {
  const userRef = doc(db, 'users', hashtag);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) throw new Error('User not found');

  const user = userSnap.data();
  const userRefPath = `/users/${hashtag}`;

  // Helper to fetch any collection by userHashtag
  const fetchCollection = async (name) => {
    const q = query(collection(db, name), where('userHashtag', '==', hashtag));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  };

  // Fetch availabilities, notifications, chats
  const [availabilities, notifications, chats] = await Promise.all([
    fetchCollection('availabilities'),
    fetchCollection('notifications'),
    fetchCollection('chats'),
  ]);

  // Fetch groups where user is OWNER
  const ownedGroupsQuery = query(
    collection(db, 'groups'),
    where('owner', '==', userRefPath)
  );
  const ownedGroupsSnap = await getDocs(ownedGroupsQuery);
  const ownedGroups = ownedGroupsSnap.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));

  // Fetch groups where user is MEMBER
  const allGroupsSnap = await getDocs(collection(db, 'groups'));
  const memberGroups = [];
  allGroupsSnap.forEach((docSnap) => {
    const groupData = docSnap.data();
    const members = groupData.groupMembers || [];
    const isMember = members.some(m => m.userReference === userRefPath);
    if (isMember) {
      memberGroups.push({ id: docSnap.id, ...groupData });
    }
  });

  // Merge groups (avoid duplicates)
  const mergedGroupsMap = {};
  [...ownedGroups, ...memberGroups].forEach(group => {
    mergedGroupsMap[group.id] = group;
  });

  const fullUser = {
    ...user,
    availabilities,
    notifications,
    chats,
    groups: mergedGroupsMap,
  };

  console.log("✅ Full user loaded from Firestore:", JSON.stringify(fullUser, null, 2));

  return fullUser;
};
