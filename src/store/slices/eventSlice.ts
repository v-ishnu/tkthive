
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { EventData } from '../../types';

// Updated base URL pattern
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5051/api/";


interface BookingResponse {
    message: string;
    orderId?: string;
    amount?: number;
    paymentSessionId?: string;
    provider?: string;
    session?: any;
}

interface EventState {
    event: EventData | null;
    events: EventData[];
    locations: string[]; // Added locations state
    locationsLoading: boolean; // Added locations loading state
    loading: boolean;
    error: string | null;
    bookingStatus: 'idle' | 'loading' | 'success' | 'failed';
    bookingError: string | null;
    currentOrderId: string | null;
    paymentSession: any | null;
}

const initialState: EventState = {
    event: null,
    events: [],
    locations: [], // Initial locations
    locationsLoading: false,
    loading: false,
    error: null,
    bookingStatus: 'idle',
    bookingError: null,
    currentOrderId: null,
    paymentSession: null
};

// --- FETCH THUNKS ---

export const fetchLocations = createAsyncThunk(
    'events/fetchLocations',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_BASE_URL}user/locations`);
            if (!response.ok) return rejectWithValue('Failed to fetch locations');
            const data = await response.json();
            if (data.message === "LOCATIONS_FETCHED") {
                return data.locations as string[];
            }
            return rejectWithValue(data.message);
        } catch (e: any) { return rejectWithValue(e.message); }
    }
);

export const fetchEventById = createAsyncThunk(
    'events/fetchEventById',
    async (eventId: string, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_BASE_URL}user/event/get/${eventId}`);
            if (!response.ok) {
                const errorData = await response.json();
                return rejectWithValue(errorData.message || 'Failed to fetch event');
            }
            const data = await response.json();
            if (data.message === "EVENT_FETCHED") {
                const fetchedEvent = data.event;
                return {
                    id: fetchedEvent.id,
                    slug: fetchedEvent.slug, // Added slug
                    title: fetchedEvent.title,
                    date: new Date(fetchedEvent.startDate).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' }),
                    venue: fetchedEvent.venue,
                    description: fetchedEvent.description,
                    imageUrl: fetchedEvent.imageUrl || '', // fetchedEvent.imageUrl || ...
                    price: fetchedEvent.price,
                    category: fetchedEvent.category || 'Event',
                    subCategory: fetchedEvent.subCategory || '',
                    accessType: fetchedEvent.evType === 'PUBLIC' ? 'public' : 'private',
                    organizer: {
                        name: fetchedEvent.organizer?.name || 'Organizer',
                        logoUrl: fetchedEvent.organizer?.logoUrl,
                        description: fetchedEvent.organizer?.description,
                        contactEmail: fetchedEvent.organizer?.contactEmail,
                        contactPhone: fetchedEvent.organizer?.contactPhone,
                        website: fetchedEvent.organizer?.website
                    },
                    organization: fetchedEvent.organizer?.name,
                    ticketTiers: fetchedEvent.tickets?.map((t: any) => ({
                        id: t.id,
                        name: t.name,
                        price: `₹${t.price}`,
                        type: t.type?.toLowerCase() || 'paid',
                        maxMembers: t.maxMembers,
                        minMembers: t.minMembers,
                        description: t.description || '',
                        requiredFields: t.customFields?.map((f: any) => ({
                            id: f.id,
                            label: f.label,
                            type: f.type === 'DROPDOWN' ? 'select' : f.type.toLowerCase(),
                            required: f.required,
                            options: f.options,
                            scope: f.scope,
                            placeholder: f.placeholder
                        })) || []
                    })) || [],
                    subEvents: fetchedEvent.tabs?.find((tab: any) => tab.key === 'schedule')?.data || [],
                    documents: fetchedEvent.tabs?.find((tab: any) => tab.key === 'documents')?.data || [],
                    guests: fetchedEvent.tabs?.find((tab: any) => tab.key === 'guests')?.data || [],
                    prizes: fetchedEvent.tabs?.find((tab: any) => tab.key === 'prizes')?.data || [],
                    sponsors: fetchedEvent.tabs?.find((tab: any) => tab.key === 'sponsors')?.data || [],
                    submissions: fetchedEvent.tabs?.find((tab: any) => tab.key === 'submissions')?.data || [],
                    tabs: fetchedEvent.tabs || [], // Map tabs
                    addOns: fetchedEvent.addons?.map((addon: any) => ({
                        id: addon.id,
                        name: addon.name,
                        price: `₹${addon.price}`,
                        description: '',
                        imageUrl: addon.imageUrl,
                        type: 'access'
                    })) || [],
                    isLive: fetchedEvent.isLive,
                    isOnline: fetchedEvent.isOnline,
                    featured: fetchedEvent.featured,
                    customFields: fetchedEvent.customFields?.map((f: any) => ({
                        id: f.id,
                        label: f.label,
                        type: f.type === 'DROPDOWN' ? 'select' : f.type.toLowerCase(),
                        required: f.required,
                        options: f.options,
                        scope: f.scope || 'booking',
                        placeholder: f.placeholder
                    })) || [],
                    allowSubmissions: false,
                    info: fetchedEvent.info,
                    announcement: fetchedEvent.announcement,
                } as EventData;
            } else {
                return rejectWithValue(data.message || 'Event fetch failed');
            }
        } catch (error: any) {
            return rejectWithValue(error.message || 'Network error');
        }
    }
);

export const fetchAllEvents = createAsyncThunk(
    'events/fetchAllEvents',
    async (location: string | undefined, { rejectWithValue }) => {
        try {
            let url = `${API_BASE_URL}user/event/get`;
            if (location && location !== 'All') {
                url += `?city=${encodeURIComponent(location)}`;
            }
            const response = await fetch(url);
            if (!response.ok) return rejectWithValue('Failed to fetch events');
            const data = await response.json();
            if (data.message === "EVENTS_FETCHED") {
                return data.events.map((fetchedEvent: any) => ({
                    id: fetchedEvent.id,
                    slug: fetchedEvent.slug, // Added slug
                    title: fetchedEvent.title,
                    date: new Date(fetchedEvent.startDate).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' }),
                    venue: fetchedEvent.venue,
                    description: fetchedEvent.description,
                    imageUrl: fetchedEvent.imageUrl || '',
                    price: fetchedEvent.price,
                    // ... minimal mapping for list
                    category: fetchedEvent.category,
                    subCategory: fetchedEvent.subCategory,
                    ticketTiers: []
                })) as EventData[];
            }
            return rejectWithValue(data.message);
        } catch (e: any) { return rejectWithValue(e.message); }
    }
);

// --- BOOKING THUNKS ---

export const initiateBooking = createAsyncThunk(
    'events/initiateBooking',
    async ({ eventId, bookingData }: { eventId: string, bookingData: any }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_BASE_URL}booking/events/${eventId}/bookings/initiate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingData),
                credentials: 'include'
            });

            const data = await response.json();
            if (!response.ok) return rejectWithValue(data.message || 'Booking initiation failed');
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const createPaymentSession = createAsyncThunk(
    'events/createPaymentSession',
    async ({ orderId, provider, returnUrl, customerDetails }: { orderId: string, provider: 'CASHFREE' | 'RAZORPAY', returnUrl: string, customerDetails?: { phoneNumber: string, name: string } }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_BASE_URL}booking/payments/session`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, provider, returnUrl, customerDetails }),
                credentials: 'include'
            });

            const data = await response.json();
            if (!response.ok) return rejectWithValue(data.message || 'Payment session creation failed');
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const registerFreeEvent = createAsyncThunk(
    'events/registerFreeEvent',
    async ({ eventId, ticketId, quantity, attendees }: { eventId: string, ticketId: string, quantity: number, attendees?: any[] }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_BASE_URL}booking/events/${eventId}/register-free`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tickets: [{ ticketId, quantity, attendees }] }),
                credentials: 'include'
            });

            const data = await response.json();
            if (!response.ok) return rejectWithValue(data.message || 'Free registration failed');
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const verifyPayment = createAsyncThunk(
    'events/verifyPayment',
    async (orderId: string, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_BASE_URL}booking/payments/verify/${orderId}`, {
                method: 'POST',
                credentials: 'include'
            });

            const data = await response.json();
            if (!response.ok) return rejectWithValue(data.message || 'Payment verification failed');

            // Backend returns 200 even if not paid (with message PAYMENT_NOT_PAID), check data.status
            if (data.status !== "PAID") {
                return rejectWithValue(data.message || 'Payment not completed');
            }

            return data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);



export const validateCoupon = createAsyncThunk(
    'events/validateCoupon',
    async ({ eventId, couponCode }: { eventId: string, couponCode: string }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_BASE_URL}booking/events/${eventId}/validate-coupon`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ couponCode }),
                credentials: 'include'
            });

            const data = await response.json();
            if (!response.ok) return rejectWithValue(data.message || 'Invalid coupon');
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const submitProject = createAsyncThunk(
    'events/submitProject',
    async ({ eventId, formData }: { eventId: string, formData: any }, { rejectWithValue }) => {
        try {
            // const token = localStorage.getItem('token'); // Not used, cookie based auth
            const response = await fetch(`${API_BASE_URL}event/${eventId}/submit`, { // User corrected route to 'event'
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData),
                credentials: 'include'
            });

            const data = await response.json();
            if (!response.ok) return rejectWithValue(data.message || 'Submission failed');
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const eventSlice = createSlice({
    name: 'event',
    initialState,
    reducers: {
        clearEvent: (state) => {
            state.event = null;
            state.error = null;
        },
        resetBookingState: (state) => {
            state.bookingStatus = 'idle';
            state.bookingError = null;
            state.currentOrderId = null;
            state.paymentSession = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Event
            .addCase(fetchEventById.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchEventById.fulfilled, (state, action) => { state.loading = false; state.event = action.payload; })
            .addCase(fetchEventById.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

            // Fetch All
            .addCase(fetchAllEvents.pending, (state) => { state.loading = true; })
            .addCase(fetchAllEvents.fulfilled, (state, action) => { state.loading = false; state.events = action.payload; })
            .addCase(fetchAllEvents.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

            // Fetch Locations
            .addCase(fetchLocations.pending, (state) => {
                state.locationsLoading = true;
            })
            .addCase(fetchLocations.fulfilled, (state, action) => {
                state.locationsLoading = false;
                state.locations = action.payload;
            })
            .addCase(fetchLocations.rejected, (state) => {
                state.locationsLoading = false;
            })

            // Initiate Booking
            .addCase(initiateBooking.pending, (state) => { state.bookingStatus = 'loading'; state.bookingError = null; })
            .addCase(initiateBooking.fulfilled, (state, action) => {
                state.bookingStatus = 'idle';
                state.currentOrderId = action.payload.orderId;
            })
            .addCase(initiateBooking.rejected, (state, action) => { state.bookingStatus = 'failed'; state.bookingError = action.payload as string; })

            // Create Payment Session
            .addCase(createPaymentSession.pending, (state) => { state.bookingStatus = 'loading'; })
            .addCase(createPaymentSession.fulfilled, (state, action) => {
                state.bookingStatus = 'idle';
                state.paymentSession = action.payload.session;
            })
            .addCase(createPaymentSession.rejected, (state, action) => { state.bookingStatus = 'failed'; state.bookingError = action.payload as string; })

            // Register Free
            .addCase(registerFreeEvent.pending, (state) => { state.bookingStatus = 'loading'; })
            .addCase(registerFreeEvent.fulfilled, (state) => { state.bookingStatus = 'success'; state.currentOrderId = null; })
            .addCase(registerFreeEvent.rejected, (state, action) => { state.bookingStatus = 'failed'; state.bookingError = action.payload as string; })

            // Verify Payment
            .addCase(verifyPayment.pending, (state) => { state.bookingStatus = 'loading'; state.bookingError = null; })
            .addCase(verifyPayment.fulfilled, (state) => { state.bookingStatus = 'success'; })
            .addCase(verifyPayment.rejected, (state, action) => { state.bookingStatus = 'failed'; state.bookingError = action.payload as string; })

            // Submit Project
            .addCase(submitProject.pending, (state) => { state.loading = true; }) // Don't reset error here if we want to keep event data visible
            .addCase(submitProject.fulfilled, (state) => { state.loading = false; })
            .addCase(submitProject.rejected, (state, action) => { state.loading = false; }) // Do NOT set global error, handled locally
    },
});

export const { clearEvent, resetBookingState } = eventSlice.actions;
export default eventSlice.reducer;
