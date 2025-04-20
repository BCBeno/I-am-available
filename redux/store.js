import {configureStore} from '@reduxjs/toolkit';
import groupReducer from './slices/groupSlice';
import userReducer from './slices/userSlice';

const store = configureStore({
    reducer: {
        groups: groupReducer,
        user: userReducer,
    },
});

export default store;
