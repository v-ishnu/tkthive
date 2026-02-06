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

export interface Organizer {
    id: string;
    name: string;
    imageUrl?: string;
    role?: string;
    type?: string;
    events?: any[];
    totalEvents?: number;
    totalTicketsSold?: number;
}

export interface EventRegistration {
    id: string;
    user: {
        id: string;
        name: string;
        email: string;
        phoneNumber?: string;
    };
    ticket: {
        name: string;
        type: string;
    };
    status: string;
    scanned: boolean;
    orderId: string;
    createdAt: string;
}

interface OrganizerState {
    ticketDetails: TicketDetails | null;
    scanResult: string | null;
    isLoading: boolean;
    error: string | null;

    // Organization Management
    organizations: Organizer[];
    selectedOrganization: Organizer | null;
    orgLoading: boolean;
    orgDetailsLoading: boolean;

    // Event Management
    currentEventRegistrations: EventRegistration[];
    registrationsLoading: boolean;
}

const initialState: OrganizerState = {
    ticketDetails: null,
    scanResult: null,
    isLoading: false,
    error: null,

    organizations: [],
    selectedOrganization: null,
    orgLoading: false,
    orgDetailsLoading: false,

    currentEventRegistrations: [],
    registrationsLoading: false
};

// Async Thunks
export const fetchMyOrganizations = createAsyncThunk<
    Organizer[],
    void,
    { rejectValue: string }
>(
    "organizer/fetchMyOrganizations",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(API_BASE_URL + "v1/organizer/get-organizer");
            return response.data.organizers;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch organizations");
        }
    }
);

export const fetchEventRegistrations = createAsyncThunk<
    { registrations: EventRegistration[], pagination: any },
    { eventId: string, page?: number, limit?: number, search?: string },
    { rejectValue: string }
>(
    "organizer/fetchEventRegistrations",
    async ({ eventId, page = 1, limit = 10000, search = "" }, { rejectWithValue }) => {
        try {
            const response = await axios.get(API_BASE_URL + `v1/organizer/events/${eventId}/registrations`, {
                params: { page, limit, search }
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch registrations");
        }
    }
);

export const fetchOrganizerDetails = createAsyncThunk<
    Organizer,
    string,
    { rejectValue: string }
>(
    "organizer/fetchOrganizerDetails",
    async (orgId, { rejectWithValue }) => {
        try {
            const response = await axios.get(API_BASE_URL + `v1/organizer/${orgId}`);
            return response.data.organizer;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch organizer details");
        }
    }
);

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
        },
        setSelectedOrganization: (state, action: PayloadAction<string>) => {
            const org = state.organizations.find(o => o.id === action.payload);
            if (org) {
                state.selectedOrganization = org;
                // Optional: Persist to local storage if needed
                if (typeof window !== 'undefined') {
                    localStorage.setItem('selectedOrgId', org.id);
                }
            }
        }
    },
    extraReducers: (builder) => {
        // fetchMyOrganizations
        builder.addCase(fetchMyOrganizations.pending, (state) => {
            state.orgLoading = true;
        });
        builder.addCase(fetchMyOrganizations.fulfilled, (state, action) => {
            state.orgLoading = false;
            state.organizations = action.payload;

            // Auto-select first if none selected or if previously selected is not in list
            if (!state.selectedOrganization && action.payload.length > 0) {
                state.selectedOrganization = action.payload[0];
            } else if (state.selectedOrganization && !action.payload.find(o => o.id === state.selectedOrganization?.id)) {
                state.selectedOrganization = action.payload[0] || null;
            }
        });
        builder.addCase(fetchMyOrganizations.rejected, (state, action) => {
            state.orgLoading = false;
        });

        // fetchOrganizerDetails
        builder.addCase(fetchOrganizerDetails.pending, (state) => {
            state.orgDetailsLoading = true;
        });
        builder.addCase(fetchOrganizerDetails.fulfilled, (state, action) => {
            state.orgDetailsLoading = false;
            if (state.selectedOrganization && state.selectedOrganization.id === action.payload.id) {
                state.selectedOrganization = { ...state.selectedOrganization, ...action.payload };
            }
        });
        builder.addCase(fetchOrganizerDetails.rejected, (state) => {
            state.orgDetailsLoading = false;
        });

        // fetchEventRegistrations
        builder.addCase(fetchEventRegistrations.pending, (state) => {
            state.registrationsLoading = true;
        });
        builder.addCase(fetchEventRegistrations.fulfilled, (state, action) => {
            state.registrationsLoading = false;
            state.currentEventRegistrations = action.payload.registrations;
        });
        builder.addCase(fetchEventRegistrations.rejected, (state) => {
            state.registrationsLoading = false;
            state.currentEventRegistrations = [];
        });

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

export const { resetScanner, setScanResult, setSelectedOrganization } = organizerSlice.actions;
export default organizerSlice.reducer;
