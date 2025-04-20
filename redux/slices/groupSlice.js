import {createSlice} from '@reduxjs/toolkit';
import initialGroups from "../../data/initialGroups.json";

const initialState = initialGroups;

const groupSlice = createSlice({
    name: 'groups',
    initialState,
    reducers: {
        addGroup: (state, {payload: newGroup}) => {
            state.push(newGroup);
        },
        updateGroup: (state, {payload: updatedGroup}) => {
            const index = state.findIndex(group => group.id === updatedGroup.id);
            if (index !== -1) {
                state[index] = updatedGroup;
            }
        },
    },
});

export const {addGroup, updateGroup} = groupSlice.actions;

export default groupSlice.reducer;
