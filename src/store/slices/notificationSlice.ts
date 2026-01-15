
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = "http://localhost:5051/api/";

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: string;
    isRead: boolean;
    createdAt: string;
    actionUrl?: string;
    data?: any;
}

interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    loading: boolean;
    error: string | null;
}

const initialState: NotificationState = {
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
};

export const fetchNotifications = createAsyncThunk(
    'notifications/fetchNotifications',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_BASE_URL}notifications`, {
                method: 'GET',
                credentials: 'include'
            });
            const data = await response.json();
            if (!response.ok) return rejectWithValue(data.message || 'Failed to fetch');
            return data.data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const markRead = createAsyncThunk(
    'notifications/markRead',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_BASE_URL}notifications/${id}/read`, {
                method: 'PATCH',
                credentials: 'include'
            });
            const data = await response.json();
            if (!response.ok) return rejectWithValue(data.message || 'Failed to mark read');
            return id;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const markAllRead = createAsyncThunk(
    'notifications/markAllRead',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_BASE_URL}notifications/read-all`, {
                method: 'PATCH',
                credentials: 'include'
            });
            const data = await response.json();
            if (!response.ok) return rejectWithValue(data.message || 'Failed to mark all read');
            return;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchNotifications.pending, (state) => { state.loading = true; })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.notifications = action.payload;
                state.unreadCount = action.payload.filter((n: Notification) => !n.isRead).length;
            })
            .addCase(fetchNotifications.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

            // Mark Read
            .addCase(markRead.fulfilled, (state, action) => {
                const notif = state.notifications.find(n => n.id === action.payload);
                if (notif && !notif.isRead) {
                    notif.isRead = true;
                    state.unreadCount = Math.max(0, state.unreadCount - 1);
                }
            })

            // Mark All Read
            .addCase(markAllRead.fulfilled, (state) => {
                state.notifications.forEach(n => n.isRead = true);
                state.unreadCount = 0;
            });
    }
});

export default notificationSlice.reducer;
