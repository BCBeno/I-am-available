//userDataLoader.js
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebaseconfig';

export const loadCompleteUserData = async (hashtag) => {
  const userRef = doc(db, 'users', hashtag);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) throw new Error('User not found');

  const user = userSnap.data();
  const roleHashtags = user.roles?.map(r => r.hashtag) || [];

  // Fetch all availabilities for the user's roles
  const availabilities = [];
  for (const role of roleHashtags) {
    const q = query(collection(db, 'availabilities'), where('roleHashtag', '==', role));
    const snap = await getDocs(q);
    snap.forEach(docSnap => availabilities.push({ id: docSnap.id, ...docSnap.data() }));
  }

  // Fetch notifications and chats by userHashtag
  const fetchCollection = async (name) => {
    const q = query(collection(db, name), where('userHashtag', '==', hashtag));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  };

  const [notifications, chats] = await Promise.all([
    fetchCollection('notifications'),
    fetchCollection('chats'),
  ]);

  // Fetch all groups, match based on roleHashtag (owner OR member)
  const allGroupsSnap = await getDocs(collection(db, 'groups'));
  const matchedGroups = [];

  allGroupsSnap.forEach((docSnap) => {
    const group = docSnap.data();
    const id = docSnap.id;

    const isOwner = roleHashtags.includes(group.ownerrolehashtag);
    const isMember =
    Array.isArray(group.groupMembers) &&
    group.groupMembers.some(member =>
      roleHashtags.includes(member.userRole)
    );
  
    if (isOwner || isMember) {
      matchedGroups.push({ id, ...group });
    }
  });

  // Format group list into a map (e.g. { groupId: groupData })
  const groupsMap = {};
  matchedGroups.forEach(group => {
    groupsMap[group.id] = group;
  });

  // Final merged user object
  const fullUser = {
    ...user,
    availabilities,
    notifications,
    chats,
    groups: groupsMap,
    groupMemberships: user.groups || [] // legacy reference if needed
  };

  //console.log("✅ Full user loaded from Firestore:", JSON.stringify(fullUser, null, 2));USE THIS FOR DEBUGGING
  console.log(" Full user loaded from Firestore:");
  return fullUser;
};


//EXAMPLE OF RETURNED DATA OF:"loggedInUser"
/*{
  "name": "John Doe",
  "email": "john@example.com",
  "photo": "...",
  "roles": [],
  "availabilities": [],
  "notifications": [],
  "chats": [],
  "groups": mergedGroupsMap,           // For screens that expect full group info example -> groups: { [grouphashtag]: groupData }
  "groupMemberships": user.groups || [] // The raw array of group references from Firestore
  }*/
//Did it like this to mirror the fakeDB structure so no big changes are needed to the screens logic
