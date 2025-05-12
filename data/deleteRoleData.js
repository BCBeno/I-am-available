import {
  deleteDoc,
  doc,
  collection,
  getDocs,
  query,
  where,
  updateDoc
} from 'firebase/firestore';
import { db } from '../firebaseconfig';

export const deleteRoleData = async (roleHashtag) => {
  try {
    const ownedGroupIds = new Set();

    // 1. Delete hashtag document
    await deleteDoc(doc(db, 'hashtags', roleHashtag)).catch(() =>
      console.warn(`⚠️ No hashtag doc to delete for ${roleHashtag}`)
    );

    // 2. Identify groups owned by this role (via ownerrolehashtag)
    const ownedGroupsSnap = await getDocs(
      query(collection(db, 'groups'), where('ownerrolehashtag', '==', roleHashtag))
    );
    for (const docSnap of ownedGroupsSnap.docs) {
      ownedGroupIds.add(docSnap.id);
    }

    // 3. Delete notifications referencing those owned groups
    const notificationsSnap = await getDocs(collection(db, 'notifications'));
    for (const docSnap of notificationsSnap.docs) {
      const groupPath = docSnap.data().group;
      if (!groupPath) continue;

      const groupId = groupPath.split('/')[2];
      if (ownedGroupIds.has(groupId)) {
        await deleteDoc(doc(db, 'notifications', docSnap.id));
        console.log(`🔔 Deleted notification tied to owned group: ${groupId}`);
      }
    }

    // 4. Delete the actual owned groups
    for (const groupId of ownedGroupIds) {
      await deleteDoc(doc(db, 'groups', groupId));
      console.log(`🧹 Deleted group owned by role: ${groupId}`);
    }

    // 5. Delete availabilities for this role
    const availSnap = await getDocs(
      query(collection(db, 'availabilities'), where('roleHashtag', '==', roleHashtag))
    );
    await Promise.all(availSnap.docs.map((d) => deleteDoc(d.ref)));

    // 6. Delete chats involving this role
    const chatSnap = await getDocs(collection(db, 'chats'));
    const relatedChats = chatSnap.docs.filter((d) =>
      (d.data().participants || []).includes(roleHashtag)
    );
    await Promise.all(relatedChats.map((d) => deleteDoc(d.ref)));

    // 7. Remove this role from groupMembers arrays in all groups
    const groupsSnap = await getDocs(collection(db, 'groups'));
    for (const docSnap of groupsSnap.docs) {
      const groupData = docSnap.data();
      const newMembers = (groupData.groupMembers || []).filter(
        (m) => m.userRole !== roleHashtag
      );
      if (newMembers.length !== (groupData.groupMembers || []).length) {
        await updateDoc(doc(db, 'groups', docSnap.id), {
          groupMembers: newMembers,
        });
        console.log(`👥 Removed role ${roleHashtag} from groupMembers of ${docSnap.id}`);
      }
    }

    console.log(`✅ Completed full deletion for role: ${roleHashtag}`);
  } catch (err) {
    console.error(`❌ Error during deletion of role ${roleHashtag}:`, err);
  }
};
