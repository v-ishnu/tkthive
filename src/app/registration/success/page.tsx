'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Check, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import { verifyPayment } from '@/store/slices/eventSlice'; // We can reuse verifyPayment or make a new checkStatus action

// We'll reuse verifyPayment for polling since it hits the verify endpoint which checks provider status.
// OR we can make a lightweight "getBooking" call. 
// Given the previous implementation added `verifyPayment` which does exactly what we want (check provider + finalize),
// we can use it here to "pull" the status if the webhook hasn't arrived yet.
// This effectively makes it "Webhook + Polling Fallback" which is very robust.

import { Suspense } from 'react';

function RegistrationSuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const dispatch = useAppDispatch();

    const orderId = searchParams.get('order_id');
    const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');
    const [message, setMessage] = useState('Verifying your payment...');

    useEffect(() => {
        if (!orderId) {
            setStatus('failed');
            setMessage('Invalid Order ID');
            return;
        }

        let attempts = 0;
        const maxAttempts = 5;

        const checkStatus = async () => {
            try {
                // We use verifyPayment here to actively check. 
                // If webhook already processed it, this returns PAID immediately.
                // If webhook delayed, this forces variables.
                await dispatch(verifyPayment(orderId)).unwrap();
                setStatus('success');
            } catch (error: any) {
                console.error("Verification failed", error);
                if (attempts < maxAttempts) {
                    attempts++;
                    setMessage(`Waiting for confirmation... (${attempts}/${maxAttempts})`);
                    setTimeout(checkStatus, 3000);
                } else {
                    setStatus('failed');
                    setMessage('Payment verification timed out. Please contact support if money was deducted.');
                }
            }
        };

        checkStatus();
    }, [orderId, dispatch]);

    return (
        <div className="min-h-screen bg-background text-white flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-secondary border border-white/10 rounded-2xl p-8 text-center space-y-6">

                {status === 'verifying' && (
                    <div className="animate-in fade-in zoom-in duration-300">
                        <Loader2 className="w-16 h-16 text-primary mx-auto animate-spin mb-4" />
                        <h1 className="text-2xl font-bold">Processing Payment</h1>
                        <p className="text-gray-400">{message}</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="animate-in fade-in zoom-in duration-500">
                        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,197,94,0.4)]">
                            <Check className="w-10 h-10 text-black" strokeWidth={3} />
                        </div>
                        <h1 className="text-3xl font-bold mb-2">Registration Confirmed!</h1>
                        <p className="text-gray-400 mb-8">Your ticket has been booked successfully. Check your email for details.</p>
                        <button
                            onClick={() => router.push('/events')}
                            className="w-full bg-primary text-black font-bold py-3 rounded-xl hover:bg-primary-hover transition-all flex items-center justify-center gap-2"
                        >
                            Explore More Events <ArrowRight size={20} />
                        </button>
                    </div>
                )}

                {status === 'failed' && (
                    <div className="animate-in fade-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/50">
                            <AlertCircle className="w-10 h-10 text-red-500" />
                        </div>
                        <h1 className="text-2xl font-bold mb-2">Verification Failed</h1>
                        <p className="text-gray-400 mb-8">{message}</p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => router.back()}
                                className="flex-1 bg-white/10 text-white font-bold py-3 rounded-xl hover:bg-white/20 transition-all"
                            >
                                Try Again
                            </button>
                            <button
                                onClick={() => router.push('/contact')}
                                className="flex-1 bg-white/10 text-white font-bold py-3 rounded-xl hover:bg-white/20 transition-all"
                            >
                                Contact Support
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

export default function RegistrationSuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading...</div>}>
            <RegistrationSuccessContent />
        </Suspense>
    );
}
