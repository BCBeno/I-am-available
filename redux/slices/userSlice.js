import {createSlice} from '@reduxjs/toolkit';
import user from "../../data/user.json";

const initialState = user;
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        addGroupToUser: (state, {payload: newGroupId}) => {
            state.groupIdList.push(newGroupId);
        },
        removeGroupFromUser: (state, {payload: groupToRemoveId}) => {
            const index = state.groupIdList.findIndex(
                group => group === groupToRemoveId
            );
            if (index !== -1) {
                state.groupIdList.splice(index, 1);
            }
        }

    },
});

export const {addGroupToUser, removeGroupFromUser} = userSlice.actions;
export default userSlice.reducer;
