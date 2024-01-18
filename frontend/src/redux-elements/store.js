import { configureStore } from '@reduxjs/toolkit'
import callStatusReducer from './callStatus'
import userDetailsReducer from './userDetails'

export default configureStore({
    reducer: {
        callStatus: callStatusReducer,
        userDetails: userDetailsReducer
    },

    // allow our reducer to store non-serializable objects.
    // not recommended unless needed.
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    })
})