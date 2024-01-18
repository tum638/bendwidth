import { createSlice } from '@reduxjs/toolkit';

// initial user details.
const initialState = {
    uuid: "12345",
    userToken: null,
    userName: null,
    isInquirer: null,
    isRespondent: null,
    isLoggedIn: true
}
export const userDetailsSlice = createSlice({
    name: "userDetails",
    initialState,
    reducers: {
        updateUserDetails: (state, action) => {
            const { prop, value } = action.payload;
            state[prop] = value;
        }
    }
})

export const { updateUserDetails } = userDetailsSlice.actions;
export default userDetailsSlice.reducer;