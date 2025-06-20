import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {db} from '../../firebaseconfig';
import {doc, getDoc, updateDoc, arrayUnion, arrayRemove, setDoc} from 'firebase/firestore';

export const updateUser = createAsyncThunk(
    'user/update',
    async ({userData}, thunkAPI) => {
        try {
            const state = thunkAPI.getState();
            const userId = state.user.data.hashtag;
            console.log(userId);
            const userRef = doc(db, 'users', userId);
            const snap = await getDoc(userRef);

            await updateDoc(userRef, userData);

            return {id: userId, ...userData};
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);

// Thunk to fetch user data
export const fetchUser = createAsyncThunk('user/fetchUser', async (uid, {rejectWithValue}) => {
    try {
        const userRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userRef);
        return userSnap.exists() ? userSnap.data() : null;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

// Thunk to add a group to the user in Firebase
export const addGroupToUserInFirebase = createAsyncThunk('user/addGroupToUser', async ({
                                                                                           userHashtag, groupId
                                                                                       }, thunkAPI) => {
    try {
        const userRef = doc(db, 'users', userHashtag);
        const newGroup = {
            groupReference: `/groups/${groupId}`,
        };
        const docs = await getDoc(userRef);
        if (docs.exists() && docs.data().groups.some(group => group.groupReference === newGroup.groupReference)) {
            return thunkAPI.rejectWithValue('Group already exists in user data');
        } else {
            await updateDoc(userRef, {
                groups: arrayUnion(newGroup),
            });
            return newGroup;
        }
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

export const removeGroupFromUserInFirebase = createAsyncThunk(
    'user/removeGroupFromUser',
    async ({userHashtag, groupId}, thunkAPI) => {
        try {
            const userRef = doc(db, 'users', userHashtag);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                return thunkAPI.rejectWithValue('Usuário não encontrado');
            }

            const userData = userSnap.data();

            // Find the full group object to remove (without hashtag)
            const groupToRemove = (userData.groups || []).find(
                g => g.groupReference === `/groups/${groupId}`
            );

            if (!groupToRemove) {
                return thunkAPI.rejectWithValue('Grupo não encontrado nos dados do usuário');
            }

            await updateDoc(userRef, {
                groups: arrayRemove(groupToRemove),
            });

            return groupToRemove;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);


const userSlice = createSlice({
    name: 'user', initialState: {
        data: null, loading: false, error: null,
    }, reducers: {}, extraReducers: builder => {
        // fetchUser handlers
        builder
            .addCase(fetchUser.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // addGroupToUser handlers
            .addCase(addGroupToUserInFirebase.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addGroupToUserInFirebase.fulfilled, (state, action) => {
                state.loading = false;
                console.log(state.data.groups);
                if (state.data) {
                    state.data.groups = state.data.groups || [];
                    state.data.groups.push(action.payload);
                }
                console.log(state.data.groups);
            })
            .addCase(addGroupToUserInFirebase.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(removeGroupFromUserInFirebase.pending, state => {
                state.loading = true;
            })
            .addCase(removeGroupFromUserInFirebase.fulfilled, (state, action) => {
                state.loading = false;
                if (state.data) {
                    state.data.groups = state.data.groups.filter(group => group.groupReference !== action.payload.groupReference);
                }
            })
            .addCase(removeGroupFromUserInFirebase.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // updateUser handlers
            .addCase(updateUser.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false;
                if (state.data) {
                    state.data = {...state.data, ...action.payload};
                }
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const {removeGroupFromUserInUserSlice} = userSlice.actions;
export default userSlice.reducer;
