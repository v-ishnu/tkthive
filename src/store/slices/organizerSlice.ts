import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5051/api/";

axios.defaults.withCredentials = true;

// Types
export interface TicketDetails {
    id: string;
    qrCode: string;
    scanned: boolean;
    scannedAt?: string;
    user: {
        name: string;
        email: string;
        phoneNumber: string;
    };
    ticket: {
        name: string;
        type: string;
    };
    event: {
        title: string;
        organizerId: string;
    };
    addons: any[];
    unitPrice: number;
    registrationData?: any;
}

interface OrganizerState {
    ticketDetails: TicketDetails | null;
    scanResult: string | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: OrganizerState = {
    ticketDetails: null,
    scanResult: null,
    isLoading: false,
    error: null
};

// Async Thunks
export const verifyTicket = createAsyncThunk<
    TicketDetails,
    string,
    { rejectValue: string }
>(
    "organizer/verifyTicket",
    async (qrCode, { rejectWithValue }) => {
        try {
            const response = await axios.get(API_BASE_URL + `v1/organizer/tickets/${qrCode}`);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Invalid Ticket or Network Error");
        }
    }
);

export const checkInTicket = createAsyncThunk<
    { scanned: boolean; scannedAt: string },
    string,
    { rejectValue: string }
>(
    "organizer/checkInTicket",
    async (qrCode, { rejectWithValue }) => {
        try {
            const response = await axios.post(API_BASE_URL + `v1/organizer/tickets/${qrCode}/scan`, {});
            return response.data.data; // Expected { scanned: true, scannedAt: "..." }
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Check-in failed");
        }
    }
);

const organizerSlice = createSlice({
    name: "organizer",
    initialState,
    reducers: {
        resetScanner: (state) => {
            state.ticketDetails = null;
            state.scanResult = null;
            state.error = null;
            state.isLoading = false;
        },
        setScanResult: (state, action: PayloadAction<string | null>) => {
            state.scanResult = action.payload;
        }
    },
    extraReducers: (builder) => {
        // verifyTicket
        builder.addCase(verifyTicket.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(verifyTicket.fulfilled, (state, action) => {
            state.isLoading = false;
            state.ticketDetails = action.payload;
            state.error = null;
        });
        builder.addCase(verifyTicket.rejected, (state, action) => {
            state.isLoading = false;
            state.ticketDetails = null;
            state.error = action.payload || "Verification failed";
        });

        // checkInTicket
        builder.addCase(checkInTicket.pending, (state) => {
            state.isLoading = true;
            // Don't clear error here, we might want to show previous error or keep UI stale? 
            // Actually usually we clear error on new attempt.
            state.error = null;
        });
        builder.addCase(checkInTicket.fulfilled, (state, action) => {
            state.isLoading = false;
            if (state.ticketDetails) {
                state.ticketDetails.scanned = true;
                state.ticketDetails.scannedAt = action.payload.scannedAt;
            }
            state.error = null;
        });
        builder.addCase(checkInTicket.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload || "Check-in failed";
        });
    }
});

export const { resetScanner, setScanResult } = organizerSlice.actions;
export default organizerSlice.reducer;
