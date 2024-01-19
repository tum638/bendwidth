import { createSlice } from "@reduxjs/toolkit";


// initial status of video call.
const initialState = {
    video: 'off',
    audio: 'off',
    hasMedia: false,
    sharingScreen: false,
    hasCreatedOffer: false,
    hasCreatedAnswer: false,
    localStream: null,
    remoteStream: null,
    peerConnection: null,
    socket: null,
    offer: null, // this should be renamed to offerData as it contains more than just the offer and may cause ambiguity.
    answer: null,
    status: "ongoing",
}

export const callStatusSlice = createSlice({
    name: "callStatus",
    initialState,
    reducers: {
        // updates the various attributes of a call.
        updateCallStatus: (state, action) => {
            const { prop, value } = action.payload; 
            state[prop] = value;
        },

        // add an answer to the offer data object
        addAnswer: (state, action) => {
            const { answer } = action.payload
            console.log(state.offer)
            state["offer"]["answer"] = answer;
        }
    }

})

export const { updateCallStatus, addAnswer } = callStatusSlice.actions
export default callStatusSlice.reducer