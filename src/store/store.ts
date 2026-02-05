import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authslice";
import eventReducer from "./slices/eventSlice";
import notificationReducer from "./slices/notificationSlice";
import organizerReducer from "./slices/organizerSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        event: eventReducer,
        notification: notificationReducer,
        organizer: organizerReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;