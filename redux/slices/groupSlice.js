// redux/slices/groupSlice.js
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {
    collection,
    doc,
    getDocs,
    getDoc,
    updateDoc,
    arrayUnion,
    arrayRemove,
    addDoc,
    deleteDoc, setDoc
} from 'firebase/firestore';
import {db} from '../../firebaseconfig';
import {
    addGroupToUserInFirebase,
    removeGroupFromUserInFirebase,
} from './userSlice';

// Fetch all groups
export const fetchGroups = createAsyncThunk(
    'groups/fetchAll',
    async (groupsQuery) => {
        const q = groupsQuery || collection(db, 'groups');
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    }
);

export const createOrUpdateGroup = createAsyncThunk(
    'groups/createOrUpdate',
    async ({groupId, groupData, userHashtag}, thunkAPI) => {
        try {
            const groupRef = doc(db, 'groups', groupId);
            const snap = await getDoc(groupRef);
            if (snap.exists()) {
                await updateDoc(groupRef, groupData);
            } else {
                await setDoc(groupRef, groupData);
                thunkAPI.dispatch(addGroupToUserInFirebase({userHashtag, groupId}));
            }
            return {id: groupId, ...groupData};
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);


// Fetch groups by list of references
export const fetchGroupsByList = createAsyncThunk(
    'groups/fetchByList',
    async (groupRefs) => {
        const groups = [];
        for (const refPath of groupRefs) {
            const groupRef = doc(db, refPath);
            const groupSnap = await getDoc(groupRef);
            if (groupSnap.exists()) {
                groups.push({id: groupSnap.id, ...groupSnap.data()});
            }
        }
        return groups;
    }
);

// Add user to group
export const addUserToGroup = createAsyncThunk(
    'groups/addUserToGroup',
    async ({groupId, userHashtag, notifications}, thunkAPI) => {
        try {
            const groupDocRef = doc(db, 'groups', groupId);
            const userRefPath = `/users/${userHashtag}`;
            const userDocRef = doc(db, userRefPath);
            const groupRefPath = `/groups/${groupId}`;
            const newMember = {userReference: userRefPath, notifications};

            // Add member to group
            await updateDoc(groupDocRef, {
                groupMembers: arrayUnion(newMember)
            });

            thunkAPI.dispatch(addGroupToUserInFirebase({userHashtag, groupId}));

            return {groupId, userReference: userRefPath};
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const deleteGroup = createAsyncThunk(
    'groups/deleteGroup',
    async (groupId, thunkAPI) => {
        try {
            const groupDocRef = doc(db, 'groups', groupId);
            const group = await getDoc(groupDocRef);
            if (group.exists()) {
                const groupMembers = group.data().groupMembers || [];
                for (const member of groupMembers) {
                    await thunkAPI.dispatch(removeUserFromGroup({
                        groupId,
                        userHashtag: member.userReference.split('/')[2],
                    }));
                }
            }
            await deleteDoc(groupDocRef);
            return groupId;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const removeUserFromGroup = createAsyncThunk(
    'groups/removeUserFromGroup',
    async ({groupId, userHashtag}, thunkAPI) => {
        try {
            const state = thunkAPI.getState();
            const group = state.groups.items.find(g => g.id === groupId);
            if (!group) {
                return thunkAPI.rejectWithValue(`Group ${groupId} not found in state`);
            }

            const memberToRemove = group.groupMembers?.find(
                gm => gm.userReference === `/users/${userHashtag}`
            );
            if (!memberToRemove) {
                return thunkAPI.rejectWithValue(
                    `User ${userHashtag} is not a member of group ${groupId}`
                );
            }

            const groupDocRef = doc(db, 'groups', groupId);
            await updateDoc(groupDocRef, {
                groupMembers: arrayRemove(memberToRemove)
            });

            const updatedGroupMembers = group.groupMembers.filter(
                gm => gm.userReference !== memberToRemove.userReference
            );

            const updatedGroup = {
                ...group,
                groupMembers: updatedGroupMembers
            };

            thunkAPI.dispatch(updateGroupInFirestore(updatedGroup));

            thunkAPI.dispatch(
                removeGroupFromUserInFirebase({userHashtag, groupId})
            );

            return {updatedGroup};
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);


const initialState = {
    items: [],
    status: 'idle',
    error: null,
};

export const updateGroupInFirestore = createAsyncThunk(
    'groups/updateGroup',
    async (group, thunkAPI) => {
        const groupDocRef = doc(db, 'groups', group.id);
        await updateDoc(groupDocRef, {
            ...group,
        });
        return group;
    }
);

const groupSlice = createSlice({
    name: 'groups',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchGroups.pending, state => {
                state.status = 'loading';
            })
            .addCase(fetchGroups.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchGroups.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            .addCase(fetchGroupsByList.pending, state => {
                state.status = 'loading';
            })
            .addCase(fetchGroupsByList.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchGroupsByList.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            .addCase(addUserToGroup.pending, state => {
                state.status = 'loading';
            })
            .addCase(addUserToGroup.fulfilled, (state, {payload}) => {
                state.status = 'succeeded';
                const group = state.items.find(g => g.id === payload.groupId);
                if (group) {
                    group.groupMembers = group.groupMembers || [];
                    group.groupMembers.push({
                        userReference: payload.userReference,
                        notifications: payload.notifications
                    });
                }
            })
            .addCase(addUserToGroup.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

            .addCase(removeUserFromGroup.pending, state => {
                state.status = 'loading';
            })
            .addCase(removeUserFromGroup.fulfilled, (state, {payload}) => {
                state.status = 'succeeded';
                const group = state.items.find(g => g.id === payload.groupId);
                if (group?.groupMembers) {
                    group.groupMembers = group.groupMembers.filter(
                        member => member.userReference !== payload.userReference
                    );
                }
            })
            .addCase(removeUserFromGroup.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(updateGroupInFirestore.pending, state => {
                state.status = 'loading';
            })
            .addCase(updateGroupInFirestore.fulfilled, (state, {payload}) => {
                state.status = 'succeeded';
                const idx = state.items.findIndex(g => g.id === payload.id);
                if (idx !== -1) {
                    state.items[idx] = payload;
                }
            })
            .addCase(updateGroupInFirestore.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(deleteGroup.pending, state => {
                state.status = 'loading';
            })
            .addCase(deleteGroup.fulfilled, (state, {payload}) => {
                state.status = 'succeeded';
                const idx = state.items.findIndex(g => g.id === payload);
                if (idx !== -1) {
                    state.items.splice(idx, 1);
                }
            })
            .addCase(deleteGroup.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(createOrUpdateGroup.pending, state => {
                state.status = 'loading';
            })
            .addCase(createOrUpdateGroup.fulfilled, (state, {payload}) => {
                state.status = 'succeeded';
                const idx = state.items.findIndex(g => g.id === payload.id);
                if (idx !== -1) {
                    state.items[idx] = payload;
                } else {
                    state.items.push(payload);
                }
            })
            .addCase(createOrUpdateGroup.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    }
});

export const {addGroup, updateGroup, setGroups} = groupSlice.actions;
export default groupSlice.reducer;
