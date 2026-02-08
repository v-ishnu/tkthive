"use client"
import React, { useEffect, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { ScanLine, CheckCircle, XCircle, Loader2, User, Ticket, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { verifyTicket, checkInTicket, resetScanner, setScanResult } from '../../../store/slices/organizerSlice';

const ScannerPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const { ticketDetails, isLoading, error, scanResult } = useAppSelector((state) => state.organizer);

    const [isScanning, setIsScanning] = useState(true);
    const [cameraEnabled, setCameraEnabled] = useState(true);

    // Sync scanning state with result (if result exists, stop scanning)
    useEffect(() => {
        if (scanResult) {
            setIsScanning(false);
        } else {
            setIsScanning(true);
        }
    }, [scanResult]);

    // Error handling side-effect
    useEffect(() => {
        if (error) {
            if (error === "Ticket Already Used!" || error === "ALREADY_USED") {
                toast.error("Ticket Already Used!");
            } else {
                toast.error(error);
            }
        }
    }, [error]);

    const handleCheckIn = async () => {
        if (!ticketDetails || !scanResult) return;

        const resultAction = await dispatch(checkInTicket(ticketDetails.qrCode));
        if (checkInTicket.fulfilled.match(resultAction)) {
            toast.success("Check-in Successful!");
        }
    };

    const scannerRef = React.useRef<Html5Qrcode | null>(null);

    useEffect(() => {
        let isMounted = true;
        // Condition: Must be scanning, no result yet, element must exist, AND camera must be enabled
        if (!isScanning || scanResult || !cameraEnabled) return;

        const readerElement = document.getElementById("reader");
        if (!readerElement) return;

        // Cleanup any previous content manually to be safe
        readerElement.innerHTML = "";

        // Instantiate
        const html5QrCode = new Html5Qrcode("reader");
        scannerRef.current = html5QrCode;

        const startScanner = async () => {
            try {
                await html5QrCode.start(
                    { facingMode: "environment" },
                    {
                        fps: 10,
                        qrbox: { width: 250, height: 250 },
                        aspectRatio: 1.0
                    },
                    (decodedText) => {
                        // Success callback
                        // If unmounted, do nothing
                        if (!isMounted) return;

                        html5QrCode.stop().then(() => {
                            try {
                                html5QrCode.clear();
                            } catch (e) {
                                // ignore
                            }
                            if (isMounted) {
                                dispatch(setScanResult(decodedText));
                                dispatch(verifyTicket(decodedText)).then((action) => {
                                    if (verifyTicket.fulfilled.match(action)) {
                                        toast.success("Ticket Found!");
                                    }
                                });
                            }
                        }).catch(err => console.error("Failed to stop scanner", err));
                    },
                    (errorMessage) => {
                        // Error callback
                    }
                );

                // RACE CONDITION FIX:
                // If the component unmounted (or camera disabled) while start() was pending,
                // we must stop it immediately, otherwise the camera stays on.
                if (!isMounted) {
                    console.log("Scanner started after unmount, stopping...");
                    html5QrCode.stop().then(() => html5QrCode.clear()).catch(e => console.warn("Failed to clean up orphan scanner", e));
                }

            } catch (err) {
                if (!isMounted) return;
                console.error("Error starting scanner", err);

                // Only show error if it's not the "already started" error which might happen in race conditions
                const msg = err instanceof Error ? err.message : String(err);
                if (!msg.includes("already started")) {
                    toast.error("Could not access camera. Please ensure permissions are granted.");
                }
            }
        };

        startScanner();

        return () => {
            isMounted = false;
            scannerRef.current = null;
            // Cleanup the specific instance created in this effect run
            try {
                html5QrCode.stop().then(() => {
                    html5QrCode.clear();
                }).catch(() => {
                    try { html5QrCode.clear(); } catch (e) { }
                });
            } catch (e) {
                // Ignore
            }
        };
    }, [isScanning, scanResult, cameraEnabled, dispatch]);

    const handleReset = () => {
        dispatch(resetScanner());
        // setIsScanning(true) is handled by the effect watching scanResult (which becomes null)
        // But useEffect runs after render. resetScanner sets scanResult to null.
        // The effect [scanResult] will set isScanning(true).
    };

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl lg:text-3xl font-bold text-text-main flex items-center gap-3">
                        <ScanLine className="w-8 h-8 text-primary" />
                        Ticket Scanner
                    </h1>
                    <button
                        onClick={() => setCameraEnabled(!cameraEnabled)}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${cameraEnabled ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                    >
                        {cameraEnabled ? 'Turn Off Camera' : 'Turn On Camera'}
                    </button>
                </div>
                <p className="text-text-muted text-sm lg:text-base">Scan attendee QR codes to verify tickets.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Scanner Section */}
                <div className="bg-card p-4 lg:p-6 rounded-3xl border border-border shadow-sm h-fit min-h-[300px]">
                    {/* Always render reader div to ensure library cleanup works, hide when not needed */}
                    <div className={`overflow-hidden rounded-2xl bg-black ${(!isScanning || !cameraEnabled) ? 'hidden' : 'block'}`}>
                        <div id="reader" className="w-full"></div>
                    </div>

                    {!cameraEnabled && (
                        <div className="h-64 flex flex-col items-center justify-center bg-gray-50 rounded-2xl border border-gray-200 text-text-muted opacity-60">
                            <ScanLine className="w-16 h-16 mb-4" />
                            <p className="font-medium">Camera is disabled</p>
                        </div>
                    )}

                    {!isScanning && cameraEnabled && (
                        <div className="h-64 flex flex-col items-center justify-center bg-gray-50 rounded-2xl border border-gray-200">
                            {error ? (
                                <XCircle className="w-16 h-16 text-red-500 mb-4" />
                            ) : (
                                <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                            )}
                            <p className="text-lg font-bold text-gray-700">{error ? "Scan Failed" : "Scan Complete"}</p>
                            <button
                                onClick={handleReset}
                                className="mt-6 px-6 py-2 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl transition-all"
                            >
                                Scan Next Ticket
                            </button>
                        </div>
                    )}
                </div>

                {/* Result Section */}
                <div className="bg-card p-4 lg:p-6 rounded-3xl border border-border shadow-sm flex flex-col h-full min-h-[400px]">
                    <h2 className="text-xl font-bold text-text-main mb-6">Details</h2>

                    {isLoading && !ticketDetails && !error ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-primary">
                            <Loader2 className="w-10 h-10 animate-spin mb-4" />
                            <p>Verifying Ticket...</p>
                        </div>
                    ) : error ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                            <XCircle className="w-16 h-16 text-red-500 mb-4" />
                            <h3 className="text-xl font-bold text-red-600 mb-2">Invalid Ticket</h3>
                            <p className="text-text-muted break-all">{error}</p>
                            <p className="mt-4 text-xs font-mono bg-gray-100 p-2 rounded">{scanResult}</p>
                        </div>
                    ) : ticketDetails ? (
                        <div className="flex-1 space-y-6">
                            {/* Validation Status */}
                            <div className={`p-4 rounded-xl border flex items-center gap-3 ${ticketDetails.scanned ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-green-50 border-green-200 text-green-800'}`}>
                                {ticketDetails.scanned ? (
                                    <>
                                        <CheckCircle className="w-6 h-6" />
                                        <div>
                                            <p className="font-bold">Already Checked In</p>
                                            <p className="text-xs">at {new Date(ticketDetails.scannedAt!).toLocaleString()}</p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="w-6 h-6" />
                                        <div>
                                            <p className="font-bold">Valid Ticket</p>
                                            <p className="text-xs">Ready for check-in</p>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* User Info */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                                        {ticketDetails.user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg text-text-main">{ticketDetails.user.name}</p>
                                        <p className="text-sm text-text-muted">{ticketDetails.user.email}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-secondary/10 rounded-xl">
                                        <p className="text-xs text-text-muted mb-1 flex items-center gap-1"><Ticket className="w-3 h-3" /> Ticket Type</p>
                                        <p className="font-bold text-secondary-foreground">{ticketDetails.ticket.name}</p>
                                    </div>
                                    <div className="p-3 bg-secondary/10 rounded-xl">
                                        <p className="text-xs text-text-muted mb-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> Event</p>
                                        <p className="font-bold text-secondary-foreground truncate">{ticketDetails.event.title}</p>
                                    </div>
                                    <div className="p-3 bg-secondary/10 rounded-xl">
                                        <p className="text-xs text-text-muted mb-1 flex items-center gap-1"> Ticket Price</p>
                                        <p className="font-bold text-secondary-foreground">
                                            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(ticketDetails.unitPrice)}
                                        </p>
                                    </div>
                                </div>

                                {/* Addons Section */}
                                {ticketDetails.addons && ticketDetails.addons.length > 0 && (
                                    <div className="space-y-2">
                                        <h3 className="font-semibold text-text-main text-sm">Add-ons</h3>
                                        <div className="grid grid-cols-1 gap-2">
                                            {ticketDetails.addons.map((addon: any, idx: number) => (
                                                <div key={idx} className="p-2 border rounded-lg flex justify-between items-center text-sm">
                                                    <span>
                                                        {addon.quantity > 0 && <span className="font-bold mr-1">{addon.quantity}x</span>}
                                                        {addon.name || "Addon"}
                                                    </span>
                                                    {/* Display total price for this addon line (unit price * quantity) */}
                                                    <span className="font-medium text-text-muted">
                                                        {addon.price ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(addon.price * (addon.quantity || 1)) : ''}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Registration Data Section */}
                                {/* Registration Data Section */}
                                {ticketDetails.registrationData && (Array.isArray(ticketDetails.registrationData) ? ticketDetails.registrationData.length > 0 : Object.keys(ticketDetails.registrationData).length > 0) && (
                                    <div className="space-y-2">
                                        <h3 className="font-semibold text-text-main text-sm">Registration Details</h3>
                                        <div className="bg-gray-50 p-3 rounded-xl space-y-2 text-sm">
                                            {Array.isArray(ticketDetails.registrationData) ? (
                                                ticketDetails.registrationData.map((item: any, idx: number) => (
                                                    <div key={idx} className="p-2 bg-white rounded border flex flex-col gap-1">
                                                        {typeof item === 'object' && item !== null ? (
                                                            Object.entries(item).map(([k, v]) => (
                                                                <div key={k} className="flex justify-between text-xs">
                                                                    <span className="text-text-muted capitalize">{k.replace(/_/g, ' ')}:</span>
                                                                    <span className="font-medium">{String(v)}</span>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="flex justify-between text-xs">
                                                                <span className="text-text-muted">Item {idx + 1}:</span>
                                                                <span>{String(item)}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))
                                            ) : (
                                                Object.entries(ticketDetails.registrationData).map(([key, value]) => (
                                                    <div key={key} className="flex justify-between items-start border-b border-gray-100 last:border-0 py-1">
                                                        <span className="text-text-muted capitalize shrink-0 mr-2">{key.replace(/_/g, ' ')}:</span>
                                                        <span className="font-medium text-right break-all">
                                                            {typeof value === 'object' && value !== null
                                                                ? Object.entries(value).map(([subK, subV]) => `${subK}: ${subV}`).join(', ')
                                                                : String(value)}
                                                        </span>
                                                    </div>
                                                ))
                                            )}
                                        </div>

                                        {/* Booking Payment Details */}
                                        {ticketDetails.booking && (
                                            <div className="space-y-2 pt-2 border-t border-dashed">
                                                <h3 className="font-semibold text-text-main text-sm">Payment Details</h3>
                                                <div className="bg-blue-50 p-3 rounded-xl space-y-1 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-text-muted">Total Order Amount:</span>
                                                        <span className="font-bold text-text-main">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(ticketDetails.booking.payment)}</span>
                                                    </div>
                                                    {ticketDetails.booking.discount && ticketDetails.booking.discount > 0 && (
                                                        <div className="flex justify-between text-green-700">
                                                            <span>Discount ({ticketDetails.booking.appliedCoupon || 'Applied'}):</span>
                                                            <span className="font-bold">-{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(ticketDetails.booking.discount)}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-blue-200">
                                                        <span className="text-text-muted text-xs">Payment Status:</span>
                                                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${ticketDetails.booking.paymentStatus === 'PAID' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
                                                            {ticketDetails.booking.paymentStatus}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Action Button */}
                            {!ticketDetails.scanned && (
                                <button
                                    onClick={handleCheckIn}
                                    disabled={isLoading}
                                    className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-lg shadow-lg shadow-green-200 transition-all flex items-center justify-center gap-2"
                                >
                                    {isLoading ? <Loader2 className="animate-spin" /> : "Check In Attendee"}
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-text-muted opacity-50">
                            <ScanLine className="w-12 h-12 mb-3" />
                            <p>Waiting for scan...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ScannerPage;
