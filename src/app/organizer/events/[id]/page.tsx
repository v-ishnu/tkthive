"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchEventRegistrations, fetchMyOrganizations, fetchOrganizerDetails } from '@/store/slices/organizerSlice';
import {
    Users, Ticket, Calendar, Search, Download,
    ArrowLeft, MoreVertical, CheckCircle
} from 'lucide-react';

const EventManagementPage = () => {
    const params = useParams();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const eventId = params.id as string;

    // State
    const [activeTab, setActiveTab] = useState<'overview' | 'registrations'>('overview');
    const [searchTerm, setSearchTerm] = useState('');

    // Redux selectors
    const { selectedOrganization, organizations, currentEventRegistrations, registrationsLoading } = useAppSelector(state => state.organizer);

    // Find the current event from the list (Assuming fetchOrganizerDetails was called in layout/dashboard)
    const event = selectedOrganization?.events?.find((e: any) => e.id === eventId);

    // Fetch organizations on mount if empty
    useEffect(() => {
        if (organizations.length === 0) {
            dispatch(fetchMyOrganizations());
        }
    }, [dispatch, organizations.length]);

    // Fetch details (events) when organization is selected or on mount
    useEffect(() => {
        if (selectedOrganization?.id) {
            dispatch(fetchOrganizerDetails(selectedOrganization.id));
        }
    }, [dispatch, selectedOrganization?.id]);

    useEffect(() => {
        if (eventId) {
            dispatch(fetchEventRegistrations({ eventId }));
        }
    }, [dispatch, eventId]);

    const handleExport = () => {
        const token = localStorage.getItem('token'); // Simplistic auth check
        // Direct link to download
        window.open(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5051/api/'}v1/organizer/events/${eventId}/export`, '_blank');
    };

    if (!event) {
        return <div className="p-8 text-center">Loading or Event not found...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header with Back Button */}
            <div className="flex items-center gap-4">
                <button onClick={() => router.back()} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-text-main">{event.title}</h1>
                    <p className="text-text-muted flex items-center gap-2 text-sm">
                        <Calendar size={14} />
                        {new Date(event.startDate).toLocaleDateString()}
                        <span className="w-1 h-1 rounded-full bg-text-muted/50" />
                        {event.venue?.city || "Online"}
                    </p>
                </div>
                <div className="ml-auto flex gap-3">
                    <button className="p-2 border border-border rounded-xl hover:bg-background">
                        <MoreVertical size={20} className="text-text-muted" />
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-8 border-b border-border">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`pb-4 px-2 font-semibold text-sm transition-all relative ${activeTab === 'overview' ? 'text-primary' : 'text-text-muted hover:text-text-main'
                        }`}
                >
                    Overview
                    {activeTab === 'overview' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full" />}
                </button>
                <button
                    onClick={() => setActiveTab('registrations')}
                    className={`pb-4 px-2 font-semibold text-sm transition-all relative ${activeTab === 'registrations' ? 'text-primary' : 'text-text-muted hover:text-text-main'
                        }`}
                >
                    Registrations
                    {activeTab === 'registrations' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full" />}
                </button>
            </div>

            {/* Content */}
            {activeTab === 'overview' ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-primary/10 rounded-xl">
                                <Ticket className="text-primary w-6 h-6" />
                            </div>
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                                Live
                            </span>
                        </div>
                        {/* Calculate confirmed registrations */}
                        <h3 className="text-3xl font-bold text-text-main mb-1">
                            {currentEventRegistrations.filter(r => r.status === 'CONFIRMED' || r.status === 'USED').length}
                        </h3>
                        <p className="text-sm text-text-muted">Total Success Registration Count</p>
                    </div>

                    <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-secondary/10 rounded-xl">
                                <Users className="text-secondary w-6 h-6" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-text-main mb-1">
                            {/* Calculate Checked In count from registrations? */}
                            {currentEventRegistrations.filter(r => r.scanned).length}
                        </h3>
                        <p className="text-sm text-text-muted">Attendees Checked In</p>
                    </div>

                    <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-indigo-50 rounded-xl">
                                <CheckCircle className="text-indigo-600 w-6 h-6" />
                            </div>
                        </div>
                        {/* Revenue Placeholder */}
                        <h3 className="text-3xl font-bold text-text-main mb-1">
                            ₹ {event.grossSales?.toLocaleString('en-IN') || 0}
                        </h3>
                        <p className="text-sm text-text-muted">Total Revenue</p>
                    </div>
                </div>
            ) : (
                <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {/* Table Header Controls */}
                    <div className="p-6 border-b border-border flex flex-col sm:flex-row gap-4 justify-between items-center">
                        <div className="relative w-full sm:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search attendees by name or email..."
                                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={handleExport}
                            className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-xl text-text-secondary font-semibold hover:bg-gray-50 text-sm"
                        >
                            <Download size={16} />
                            Export List
                        </button>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 border-b border-border">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">S.No</th>
                                    <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Attendee</th>
                                    <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Ticket Type</th>
                                    <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Order ID</th>
                                    <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Check-in</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {registrationsLoading ? (
                                    <tr><td colSpan={6} className="p-8 text-center text-text-muted">Loading attendees...</td></tr>
                                ) : currentEventRegistrations.length === 0 ? (
                                    <tr><td colSpan={6} className="p-8 text-center text-text-muted">No registrations found.</td></tr>
                                ) : (
                                    currentEventRegistrations
                                        .filter(r =>
                                            r.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                            r.user.email.toLowerCase().includes(searchTerm.toLowerCase())
                                        )
                                        .map((reg, index) => (
                                            <tr key={reg.id} className="hover:bg-primary/5 transition-colors">
                                                <td className="px-6 py-4 text-sm text-text-muted font-medium">
                                                    {index + 1}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="font-bold text-text-main text-sm">{reg.user.name}</p>
                                                        <p className="text-xs text-text-muted">{reg.user.email}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary/10 text-secondary-dark">
                                                        {reg.ticket.name}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-text-muted font-mono">{reg.orderId}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${reg.status === 'CONFIRMED' || reg.status === 'USED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {reg.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {reg.scanned ? (
                                                        <span className="flex items-center gap-1.5 text-green-600 text-xs font-bold">
                                                            <CheckCircle size={14} /> Checked In
                                                        </span>
                                                    ) : (
                                                        <span className="text-text-muted text-xs">Pending</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination Controls could go here */}
                </div>
            )}
        </div>
    );
};

export default EventManagementPage;
