import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        role: null,
        isAuthenticated: false,
    },
    reducers: {
        loginUser: (state, action) => {
            state.user = action.payload.user;
            state.role = action.payload.role;
            state.isAuthenticated = true;
        },
        logoutUser: (state) => {
            state.user = null;
            state.role = null;
            state.isAuthenticated = false;
        },
    },
});

export const { loginUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
