import { createSlice } from '@reduxjs/toolkit';

// initial user details.
const initialState = {
    uuid: null,
    userId: null,
    userName: null,
    isInquirer: null,
    isRespondent: null,
    collegeName: null,
    userEmail: null,
    gradDate: null,
    isLoggedIn: true
}

export const userDetailsSlice = createSlice({
    name: "userDetails",
    initialState,
    reducers: {
        updateUserDetails: (state, action) => {
            const { prop, value } = action.payload;
            state[prop] = value;
        },
        updateWholeUserObject: (state, action) => {
            const newUserDetails = action.payload;
            state = newUserDetails;
        }
    }
})

export const { updateUserDetails, updateWholeUserObject } = userDetailsSlice.actions;
export default userDetailsSlice.reducer;