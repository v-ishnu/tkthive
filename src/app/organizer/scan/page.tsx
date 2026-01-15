'use client';
import React, { useEffect, useState, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { CheckCircle, XCircle, AlertTriangle, Scan, User, Ticket, Package, Calendar } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const API_BASE_URL = "http://localhost:5051/api/";

export default function OrganizerScannerPage() {
    const [scanResult, setScanResult] = useState<string | null>(null);
    const [ticketData, setTicketData] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [checkInStatus, setCheckInStatus] = useState<'idle' | 'success' | 'failed'>('idle');

    // Scanner ref to prevent double initialization
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);

    useEffect(() => {
        // Initialize scanner only if not already result found
        if (!scanResult && !scannerRef.current) {
            const scanner = new Html5QrcodeScanner(
                "reader",
                { fps: 10, qrbox: { width: 250, height: 250 } },
                /* verbose= */ false
            );

            scanner.render(onScanSuccess, onScanFailure);
            scannerRef.current = scanner;

            return () => {
                if (scannerRef.current) {
                    try {
                        scannerRef.current.clear();
                    } catch (e) { }
                    scannerRef.current = null;
                }
            };
        }
    }, [scanResult]);

    const onScanSuccess = (decodedText: string, decodedResult: any) => {
        // Pause finding new codes
        setScanResult(decodedText);
        // We manually clear to stop camera, or just hide it
        if (scannerRef.current) {
            scannerRef.current.clear();
            scannerRef.current = null;
        }

        // Logic to interpret QR Code Content (JSON vs String)
        let ticketId = decodedText;
        try {
            const parsed = JSON.parse(decodedText);
            if (parsed && parsed.id) {
                ticketId = parsed.id;
            }
        } catch (e) {
            // Not JSON, assume it's the raw ID
        }

        fetchTicketDetails(ticketId);
    };

    const onScanFailure = (error: any) => {
        // console.warn(`Code scan error = ${error}`);
    };

    const fetchTicketDetails = async (qrCode: string) => {
        setLoading(true);
        setError(null);
        try {
            // Need credentials for protected route
            const token = localStorage.getItem('token'); // Simplistic auth check

            const response = await axios.get(`${API_BASE_URL}organizer/tickets/${qrCode}`, {
                withCredentials: true
            });
            setTicketData(response.data.data);
        } catch (err: any) {
            setError(err.response?.data?.message || "Invalid Ticket or Not Found");
        } finally {
            setLoading(false);
        }
    };

    const handleCheckIn = async () => {
        if (!ticketData) return;
        setLoading(true);
        try {
            await axios.post(`${API_BASE_URL}organizer/tickets/${ticketData.qrCode}/scan`, {}, {
                withCredentials: true
            });
            setCheckInStatus('success');
            // Update local state to reflect change without re-fetch
            setTicketData((prev: any) => ({ ...prev, scanned: true }));
        } catch (err: any) {
            setCheckInStatus('failed');
            alert(err.response?.data?.message || "Check-in failed");
        } finally {
            setLoading(false);
        }
    };

    const resetScan = () => {
        setScanResult(null);
        setTicketData(null);
        setError(null);
        setCheckInStatus('idle');
        // Effect will re-init scanner
    };

    return (
        <div className="min-h-screen pt-24 pb-12 container mx-auto px-4 max-w-lg">
            <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Scan className="text-primary" /> Ticket Scanner
            </h1>

            {/* Scanner View */}
            {!scanResult && (
                <div className="bg-white rounded-xl overflow-hidden shadow-lg p-4">
                    <div id="reader" className="w-full"></div>
                    <p className="text-center text-gray-500 mt-2 text-sm">Point camera at the QR code</p>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="text-center py-10">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mx-auto"></div>
                    <p className="text-gray-400 mt-4">Processing...</p>
                </div>
            )}

            {/* Error View */}
            {error && !loading && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-6 text-center animate-in fade-in slide-in-from-bottom-4">
                    <XCircle className="text-red-500 w-12 h-12 mx-auto mb-3" />
                    <h2 className="text-xl font-bold text-white mb-2">Invalid Ticket</h2>
                    <p className="text-red-400 mb-6">{error}</p>
                    <button
                        onClick={resetScan}
                        className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold transition-all"
                    >
                        Scan Another
                    </button>
                </div>
            )}

            {/* Result View */}
            {ticketData && !loading && (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 animate-in fade-in zoom-in-95">
                    {/* Status Header */}
                    <div className="text-center mb-6">
                        {checkInStatus === 'success' ? (
                            <div className="flex flex-col items-center">
                                <CheckCircle className="text-green-500 w-16 h-16 mb-2" />
                                <h2 className="text-2xl font-bold text-white">Checked In!</h2>
                                <p className="text-green-400">Visitor verified & admitted.</p>
                            </div>
                        ) : ticketData.scanned ? (
                            <div className="flex flex-col items-center">
                                <AlertTriangle className="text-yellow-500 w-16 h-16 mb-2" />
                                <h2 className="text-2xl font-bold text-white">Already Used</h2>
                                <p className="text-yellow-400">This ticket was scanned previously.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center">
                                <CheckCircle className="text-primary w-16 h-16 mb-2" />
                                <h2 className="text-2xl font-bold text-white">Valid Ticket</h2>
                                <p className="text-primary/80">Ready for check-in.</p>
                            </div>
                        )}
                    </div>

                    {/* Details Card */}
                    <div className="bg-black/30 rounded-xl p-4 space-y-4 mb-6">
                        <div className="flex items-start gap-3">
                            <User className="text-gray-400 mt-1" size={18} />
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-bold">Attendee</p>
                                <p className="text-white font-medium text-lg">{ticketData.user?.name || "Guest"}</p>
                                <p className="text-gray-400 text-sm">{ticketData.user?.email}</p>
                            </div>
                        </div>

                        <div className="border-t border-white/10 pt-4 flex items-start gap-3">
                            <Ticket className="text-gray-400 mt-1" size={18} />
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-bold">Ticket Type</p>
                                <p className="text-primary font-bold text-lg">{ticketData.ticket.name}</p>
                                <p className="text-white text-sm">{ticketData.event.title}</p>
                            </div>
                        </div>

                        {ticketData.addons && ticketData.addons.length > 0 && (
                            <div className="border-t border-white/10 pt-4 flex items-start gap-3">
                                <Package className="text-gray-400 mt-1" size={18} />
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold">Add-ons</p>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {ticketData.addons.map((addon: any, i: number) => (
                                            <span key={i} className="bg-white/10 text-white text-xs px-2 py-1 rounded">
                                                {addon.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        {!ticketData.scanned && (
                            <button
                                onClick={handleCheckIn}
                                className="w-full py-4 bg-green-500 hover:bg-green-600 text-black font-bold text-lg rounded-xl transition-all shadow-lg shadow-green-500/20"
                            >
                                Check In Visitor
                            </button>
                        )}

                        <button
                            onClick={resetScan}
                            className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold transition-all"
                        >
                            Scan Next Ticket
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
