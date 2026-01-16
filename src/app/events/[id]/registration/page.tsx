'use client'

import React, { useState, useEffect } from 'react';
import { EventData, TicketTier, Ticket, RegistrationFormField, AttendeeDetail } from '@/types';
import { ArrowLeft, Check, CreditCard, User, Users, ChevronRight, Lock, Tag, Ticket as TicketIcon, ShoppingBag, Plus, Minus, Utensils, AlertCircle, ChevronDown, Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchEventById, initiateBooking, createPaymentSession, registerFreeEvent, resetBookingState, verifyPayment, validateCoupon } from '@/store/slices/eventSlice'; // Assuming getBooking action exists or we use fetch
import { RootState } from '@/store/store';
// @ts-ignore
import { load } from '@cashfreepayments/cashfree-js';
import toast, { Toaster } from 'react-hot-toast';

export default function RegistrationPage() {
    const params = useParams();
    const router = useRouter();

    const dispatch = useAppDispatch();
    const { event, loading, error, bookingStatus, bookingError } = useAppSelector((state: RootState) => state.event);
    const { user } = useAppSelector((state: RootState) => state.auth);

    const [step, setStep] = useState(1);
    const [selectedTier, setSelectedTier] = useState<TicketTier | null>(null);

    // Payment State
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'CASHFREE' | 'RAZORPAY'>('CASHFREE');
    const [isProcessing, setIsProcessing] = useState(false);

    // Primary User Data 
    const [primaryUser, setPrimaryUser] = useState({ name: '', email: '', phone: '' });

    // Custom Data
    const [bookingCustomData, setBookingCustomData] = useState<Record<string, string>>({});
    const [attendeeDetails, setAttendeeDetails] = useState<AttendeeDetail[]>([]);

    // Add-on State
    const [selectedAddOns, setSelectedAddOns] = useState<Record<string, number>>({});

    // Coupon State
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [couponMessage, setCouponMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Initialize event
    useEffect(() => {
        const paramValue = params.slug || params.id;
        if (paramValue) {
            const slugOrId = Array.isArray(paramValue) ? paramValue[0] : paramValue;

            // Check if event is already loaded and matches (either by ID or Slug)
            const isEventLoaded = event && (event.id === slugOrId || event.slug === slugOrId);

            if (!isEventLoaded) {
                dispatch(fetchEventById(slugOrId));
            }
        }
    }, [params.id, params.slug, dispatch, event]);

    // Auto-fill user details
    useEffect(() => {
        if (user && !primaryUser.email) {
            setPrimaryUser(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || prev.phone || ''
            }));
        }
    }, [user, primaryUser.email]);




    // Removed: now handled by /registration/success page via returnUrl
    useEffect(() => {
        // Optional: Could clear query params if we want to avoid sticky state
    }, []);

    // Helper to parse price
    const getPriceValue = (priceStr: string) => {
        if (typeof priceStr === 'string' && priceStr.toLowerCase() === 'free') return 0;
        const numeric = parseFloat(String(priceStr).replace(/[^0-9.]/g, ''));
        return isNaN(numeric) ? 0 : numeric;
    };

    const hasAddOns = event?.addOns && event.addOns.length > 0;

    const handleTierSelect = (tier: TicketTier) => {
        setSelectedTier(tier);
        const count = tier.type === 'group' && tier.maxMembers ? tier.maxMembers : 1;
        const initialAttendees: AttendeeDetail[] = Array(count).fill(null).map(() => ({
            name: '', email: '', customData: {}
        }));

        // Pre-fill first attendee with primary user data
        if (primaryUser.name || primaryUser.email) {
            initialAttendees[0].name = primaryUser.name;
            initialAttendees[0].email = primaryUser.email;
            // AttendeeDetail phone is optional, but often not top-level input for attendees unless custom field. 
            // However, our UI has a phone input for attendees in some cases? 
            // Checking UI... handleAttendeeChange handles phone.
            if (primaryUser.phone) initialAttendees[0].phone = primaryUser.phone;
        } else if (user) {
            // Fallback if primaryUser wasn't set yet (rare)
            initialAttendees[0].name = user.name || '';
            initialAttendees[0].email = user.email || '';
            if (user.phone) initialAttendees[0].phone = user.phone;
        }

        setAttendeeDetails(initialAttendees);
        setBookingCustomData({});
        setStep(2);
    };

    const handlePrimaryChange = (field: string, value: string) => {
        setPrimaryUser(prev => {
            const updated = { ...prev, [field]: value };
            // Sync primary to first attendee
            const newAttendees = [...attendeeDetails];
            if (newAttendees.length > 0) {
                newAttendees[0] = { ...newAttendees[0], [field]: value };
                setAttendeeDetails(newAttendees);
            }
            return updated;
        });
    };

    const handleBookingCustomFieldChange = (fieldId: string, value: string) => {
        setBookingCustomData(prev => ({ ...prev, [fieldId]: value }));
    };

    const handleAttendeeChange = (index: number, field: string, value: string, isCustom: boolean = false) => {
        const newAttendees = [...attendeeDetails];
        if (isCustom) {
            newAttendees[index] = {
                ...newAttendees[index],
                customData: { ...(newAttendees[index].customData || {}), [field]: value }
            };
        } else {
            newAttendees[index] = { ...newAttendees[index], [field]: value };
            if (index === 0 && ['name', 'email', 'phone'].includes(field)) {
                setPrimaryUser(prev => ({ ...prev, [field]: value }));
            }
        }
        setAttendeeDetails(newAttendees);
    };

    const handleAddOnQuantity = (id: string, delta: number) => {
        setSelectedAddOns(prev => {
            const current = prev[id] || 0;
            return { ...prev, [id]: Math.max(0, current + delta) };
        });
    };

    const getAddOnTotal = () => {
        if (!event?.addOns) return 0;
        return event.addOns.reduce((total, addon) => {
            const qty = selectedAddOns[addon.id] || 0;
            return total + (getPriceValue(addon.price) * qty);
        }, 0);
    };

    const handleDetailsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (hasAddOns) setStep(3);
        else {
            const price = selectedTier ? getPriceValue(selectedTier.price) : 0;
            if (price === 0) setStep(4); // Ensure logic matches payment check
            else setStep(4);
        }
    };

    const handleAddOnsSubmit = () => {
        setStep(4);
    };

    const calculateTotal = () => {
        if (!selectedTier) return "0";
        const basePrice = getPriceValue(selectedTier.price);
        const ticketTotal = basePrice * (selectedTier.type === 'group' ? 1 : attendeeDetails.length);
        const addOnTotal = getAddOnTotal();
        const total = ticketTotal + addOnTotal;

        let final = total;
        if (discount > 0) {
            const discountAmount = (total * discount) / 100;
            final = Math.max(0, total - discountAmount);
        }

        return final.toFixed(2);
    };

    const handleApplyCoupon = async () => {
        if (!couponCode || !event) return;
        setCouponMessage(null);

        try {
            const res = await dispatch(validateCoupon({ eventId: event.id, couponCode })).unwrap();
            setDiscount(res.discountPercentage);
            setCouponMessage({ type: 'success', text: `Coupon applied! You saved ${res.discountPercentage}%` });
        } catch (err: any) {
            setDiscount(0);
            setCouponMessage({ type: 'error', text: err || "Invalid Coupon" });
        }
    };

    const handleRemoveCoupon = () => {
        setCouponCode('');
        setDiscount(0);
        setCouponMessage(null);
    };

    const handlePayment = async () => {
        if (!selectedTier || !event) return;
        setIsProcessing(true);
        dispatch(resetBookingState());

        const totalAmount = parseFloat(calculateTotal());

        // Prepare Payload
        const bookingResponses = Object.entries(bookingCustomData).map(([key, val]) => ({ fieldId: key, value: val }));

        const finalAttendees = attendeeDetails.map(att => ({
            name: att.name,
            email: att.email,
            phone: att.phone,
            responses: [
                ...Object.entries(att.customData || {}).map(([key, val]) => ({ fieldId: key, value: val })),
                ...bookingResponses // Copy booking level responses to each attendee
            ]
        }));

        const ticketsPayload = [{
            ticketId: selectedTier.id,
            quantity: selectedTier.type === 'group' ? 1 : attendeeDetails.length,
            addons: Object.entries(selectedAddOns).map(([id, qty]) => ({ addonId: id, quantity: qty })),
            attendees: finalAttendees
        }];

        try {
            // 1. FREE Event
            if (totalAmount === 0 || selectedTier.price === '0' || selectedTier.price.toLowerCase() === 'free') {
                await dispatch(registerFreeEvent({
                    eventId: event.id,
                    ticketId: selectedTier.id,
                    quantity: ticketsPayload[0].quantity,
                    attendees: finalAttendees
                })).unwrap();

                setStep(5);
                setIsProcessing(false);
                return;
            }

            // 2. PAID Event
            const bookingRes = await dispatch(initiateBooking({
                eventId: event.id,
                bookingData: { tickets: ticketsPayload, couponCode: discount > 0 ? couponCode : undefined }
            })).unwrap();

            const orderId = bookingRes.orderId;

            if (selectedPaymentMethod === 'CASHFREE') {
                const sessionRes = await dispatch(createPaymentSession({
                    orderId,
                    provider: 'CASHFREE',
                    returnUrl: `${window.location.origin}/registration/success?order_id=${orderId}`, // To Success Page
                    customerDetails: {
                        phoneNumber: attendeeDetails[0]?.phone || '',
                        name: attendeeDetails[0]?.name || ''
                    }
                })).unwrap();

                // @ts-ignore
                const cashfree = await load({ mode: "production" });

                await cashfree.checkout({
                    paymentSessionId: sessionRes.session,
                    redirectTarget: "_self",
                });
            }
        } catch (err: any) {
            console.error("Payment Flow Error:", err);
            setIsProcessing(false);
            // Show error in toast
            const errorMessage = err?.message || err || "Something went wrong during registration.";
            toast.error(errorMessage);
        }
    };

    const handleFinish = () => {
        router.push('/events');
    };

    const steps = [
        { num: 1, label: 'Tickets' },
        { num: 2, label: 'Details' },
        ...(hasAddOns ? [{ num: 3, label: 'Add-ons' }] : []),
        { num: hasAddOns ? 4 : 3, label: 'Payment' },
        { num: hasAddOns ? 5 : 4, label: 'Done' }
    ];

    // ... (renderField helper same as before)
    const renderField = (field: RegistrationFormField, onChange: (val: string) => void, value: string) => {
        if (field.type === 'select') {
            return (
                <div className="relative">
                    <select
                        required={field.required}
                        value={value || ''}
                        className="w-full bg-tertiary border border-white/10 rounded-xl p-2 md:p-3 text-xs md:text-sm focus:border-primary/50 outline-none text-white appearance-none cursor-pointer"
                        onChange={(e) => onChange(e.target.value)}
                    >
                        <option value="">{field.placeholder || 'Select an option'}</option>
                        {field.options?.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                        <ChevronDown size={14} />
                    </div>
                </div>
            );
        }
        if (field.type === 'textarea') {
            return (
                <textarea
                    required={field.required}
                    rows={3}
                    value={value || ''}
                    placeholder={field.placeholder}
                    className="w-full bg-tertiary border border-white/10 rounded-xl p-2 md:p-3 text-xs md:text-sm focus:border-primary/50 outline-none text-white resize-none"
                    onChange={(e) => onChange(e.target.value)}
                />
            );
        }
        return (
            <input
                type={field.type}
                required={field.required}
                value={value || ''}
                placeholder={field.placeholder}
                className="w-full bg-tertiary border border-white/10 rounded-xl p-2 md:p-3 text-xs md:text-sm focus:border-primary/50 outline-none text-white placeholder:text-gray-600"
                onChange={(e) => onChange(e.target.value)}
            />
        );
    };

    const handleBack = () => {
        if (step === 1) { router.back(); return; }
        let prevStep = step - 1;
        if (prevStep === 3 && !hasAddOns) prevStep = 2;
        setStep(prevStep);
    };

    if (loading || (!event && !error)) {
        return <div className="min-h-screen bg-background text-white flex items-center justify-center gap-2"><Loader2 className="animate-spin text-primary" size={32} /><span>Loading...</span></div>;
    }

    if (!event) return <div className="min-h-screen bg-background text-white flex flex-col items-center justify-center gap-4"><h1 className="text-2xl font-bold">Event not found</h1><button onClick={() => router.back()} className="text-primary hover:underline">Go Back</button></div>;

    // Default tiers if none provided
    const displayTiers = event.ticketTiers || [{ id: 'default', name: 'General Admission', price: event.price, type: 'individual', description: 'Standard entry ticket.', requiredFields: [] }];


    return (
        <div className="min-h-screen bg-background text-white pt-24 pb-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={handleBack} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors"><ArrowLeft size={20} /></button>
                    <div>
                        <h1 className="text-2xl font-bold">{step === (hasAddOns ? 5 : 4) ? 'Registration Confirmed' : 'Register for Event'}</h1>
                        <p className="text-gray-400 text-sm">{event.title} • {event.date}</p>
                    </div>
                </div>

                {/* Steps */}
                <div className="flex items-center justify-between mb-12 relative">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/10 -z-10" />
                    {steps.map((s, idx) => (
                        <div key={s.num} className={`flex flex-col items-center gap-2 ${step >= s.num ? 'text-primary' : 'text-gray-600'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${step >= s.num ? 'bg-primary text-black scale-110' : 'bg-secondary border border-white/10 text-gray-500'}`}>
                                {step > s.num ? <Check size={16} /> : idx + 1}
                            </div>
                            <span className="text-xs font-medium hidden sm:block">{s.label}</span>
                        </div>
                    ))}
                </div>

                {/* Step 1: Ticket Selection */}
                {step === 1 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="grid gap-4">
                            {displayTiers.map((tier) => (
                                <div key={tier.id} onClick={() => handleTierSelect(tier as TicketTier)} className="bg-secondary border border-white/10 p-6 rounded-2xl cursor-pointer hover:border-primary/50 hover:bg-white/5 transition-all group flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 rounded-full shrink-0 ${tier.type === 'group' ? 'bg-purple-500/20 text-purple-400' : 'bg-primary/20 text-primary'}`}>
                                            {tier.type === 'group' ? <Users size={24} /> : <User size={24} />}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{tier.name}</h3>
                                            <p className="text-gray-400 text-sm mb-2">{tier.description}</p>
                                            <div className="flex flex-wrap gap-2">
                                                <span className="text-xs bg-white/5 px-2 py-1 rounded border border-white/10 uppercase tracking-wide text-gray-400">{tier.type === 'group' ? `Up to ${tier.maxMembers} Members` : 'Individual Entry'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-2xl font-bold text-white">{tier.price}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 2: Details */}
                {step === 2 && selectedTier && (
                    <form onSubmit={handleDetailsSubmit} className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="bg-secondary border border-white/10 p-6 rounded-2xl space-y-6">
                            <h2 className="text-xl font-bold flex items-center gap-2"><User className="text-primary" size={20} />Primary Contact Details</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-1.5"><label className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Full Name *</label><input type="text" required value={primaryUser.name} onChange={(e) => handlePrimaryChange('name', e.target.value)} className="w-full bg-tertiary border border-white/10 rounded-xl p-2 md:p-3 text-xs md:text-sm focus:border-primary/50 outline-none text-white" /></div>
                                <div className="space-y-1.5"><label className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Email *</label><input type="email" required value={primaryUser.email} onChange={(e) => handlePrimaryChange('email', e.target.value)} className="w-full bg-tertiary border border-white/10 rounded-xl p-2 md:p-3 text-xs md:text-sm focus:border-primary/50 outline-none text-white" /></div>
                                <div className="space-y-1.5"><label className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Phone *</label><input type="tel" required value={primaryUser.phone} onChange={(e) => handlePrimaryChange('phone', e.target.value)} className="w-full bg-tertiary border border-white/10 rounded-xl p-2 md:p-3 text-xs md:text-sm focus:border-primary/50 outline-none text-white" /></div>
                            </div>
                        </div>

                        {/* Booking Scoped Fields */}
                        {((selectedTier.requiredFields?.some(f => !f.scope || f.scope === 'booking')) || (event.customFields?.some(f => !f.scope || f.scope === 'booking'))) && (
                            <div className="bg-secondary border border-white/10 p-6 rounded-2xl space-y-6">
                                <h2 className="text-xl font-bold flex items-center gap-2"><TicketIcon className="text-primary" size={20} />Additional Requirements</h2>
                                <div className="grid gap-6">
                                    {selectedTier.requiredFields?.filter(f => !f.scope || f.scope === 'booking').map(field => <div key={field.id} className="space-y-2"><label className="text-sm text-gray-400">{field.label}</label>{renderField(field, (val) => handleBookingCustomFieldChange(field.id, val), bookingCustomData[field.id])}</div>)}
                                    {event.customFields?.filter(f => !f.scope || f.scope === 'booking').map(field => <div key={field.id} className="space-y-2"><label className="text-sm text-gray-400">{field.label}</label>{renderField(field, (val) => handleBookingCustomFieldChange(field.id, val), bookingCustomData[field.id])}</div>)}
                                </div>
                            </div>
                        )}

                        {/* Attendee Details */}
                        <div className="bg-secondary border border-white/10 p-6 rounded-2xl space-y-6">
                            <h2 className="text-xl font-bold flex items-center gap-2"><Users className="text-purple-400" size={20} />Attendee Information</h2>
                            <div className="space-y-4">
                                {attendeeDetails.map((attendee, idx) => (
                                    <div key={idx} className="p-6 bg-white/5 rounded-2xl border border-white/5 relative">
                                        <div className="absolute -left-3 top-6 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-xs text-black font-bold border-4 border-dark">{idx + 1}</div>
                                        <h4 className="font-bold text-white mb-4 ml-2">Attendee #{idx + 1} {idx === 0 && "(Primary)"}</h4>
                                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                                            <div className="space-y-1"><label className="text-[10px] md:text-xs text-gray-500 font-semibold uppercase tracking-wide">Name</label><input type="text" required value={attendee.name} onChange={(e) => handleAttendeeChange(idx, 'name', e.target.value)} readOnly={idx === 0} className="w-full bg-dark border border-white/10 rounded-lg p-2 text-xs md:text-sm text-white focus:border-purple-500/50 outline-none" /></div>
                                            <div className="space-y-1"><label className="text-[10px] md:text-xs text-gray-500 font-semibold uppercase tracking-wide">Email</label><input type="email" required value={attendee.email} onChange={(e) => handleAttendeeChange(idx, 'email', e.target.value)} readOnly={idx === 0} className="w-full bg-dark border border-white/10 rounded-lg p-2 text-xs md:text-sm text-white focus:border-purple-500/50 outline-none" /></div>
                                        </div>
                                        {selectedTier.requiredFields?.filter(f => f.scope === 'attendee').map(field => (
                                            <div key={field.id} className="space-y-1 mb-3"><label className="text-xs text-gray-400">{field.label}</label>{renderField(field, (val) => handleAttendeeChange(idx, field.id, val, true), attendee.customData?.[field.id] || '')}</div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button type="submit" className="bg-primary text-black font-bold text-lg px-8 py-3 rounded-full hover:scale-105 transition-transform flex items-center gap-2">{hasAddOns ? 'Continue to Add-ons' : 'Continue to Payment'} <ChevronRight size={20} /></button>
                        </div>
                    </form>
                )}

                {/* Step 3: Add-ons */}
                {step === 3 && hasAddOns && event && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="grid sm:grid-cols-2 gap-6">
                            {event.addOns!.map(addon => {
                                const quantity = selectedAddOns[addon.id] || 0;
                                return (
                                    <div key={addon.id} className={`border rounded-2xl p-4 transition-all ${quantity > 0 ? 'bg-white/5 border-primary/50' : 'bg-secondary border-white/10'}`}>
                                        <div className="flex gap-4">
                                            <div className="w-24 h-24 rounded-xl overflow-hidden bg-black shrink-0"><img src={addon.imageUrl || 'https://images.unsplash.com/photo-1544531586-fde5298cdd40'} alt={addon.name} className="w-full h-full object-cover" /></div>
                                            <div className="flex-1 flex flex-col">
                                                <div className="flex justify-between items-start mb-1"><h3 className="font-bold text-white line-clamp-1">{addon.name}</h3><span className="font-bold text-primary">{addon.price}</span></div>
                                                <div className="mt-auto flex items-center justify-between">
                                                    <div className="flex items-center gap-3 bg-black/40 rounded-lg p-1 border border-white/10">
                                                        <button onClick={() => handleAddOnQuantity(addon.id, -1)} disabled={quantity === 0} className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/10 text-white disabled:opacity-30"><Minus size={12} /></button>
                                                        <span className="text-sm font-bold w-4 text-center">{quantity}</span>
                                                        <button onClick={() => handleAddOnQuantity(addon.id, 1)} className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/10 text-white"><Plus size={12} /></button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        <div className="flex justify-end gap-4"><button onClick={handleAddOnsSubmit} className="bg-primary text-black font-bold text-lg px-8 py-3 rounded-full hover:scale-105 transition-transform flex items-center gap-2">Continue <ChevronRight size={20} /></button></div>
                    </div>
                )}

                {/* Step 4: Payment Summary */}
                {step === 4 && selectedTier && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="bg-secondary border border-white/10 p-8 rounded-2xl">
                            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                            <div className="flex justify-between items-center py-4 border-b border-white/5">
                                <div><p className="font-bold text-lg text-white">{selectedTier.name}</p><p className="text-sm text-gray-400 capitalize">{attendeeDetails.length} Ticket(s)</p></div>
                                <div className="text-xl font-bold">{selectedTier.price}</div>
                            </div>
                            <div className="py-4 space-y-2 border-b border-white/5 text-sm text-gray-300">
                                <div className="flex justify-between"><span>Ticket Price</span><span>{selectedTier.price} x {attendeeDetails.length}</span></div>
                                {getAddOnTotal() > 0 && <div className="flex justify-between text-purple-400"><span>Add-ons Total</span><span>+₹{getAddOnTotal()}</span></div>}
                                {discount > 0 && <div className="flex justify-between text-green-400"><span>Discount ({discount}%)</span><span>- ₹{((parseFloat(calculateTotal()) / (100 - discount)) * discount).toFixed(2)}</span></div>}
                            </div>

                            {/* Coupon Input */}
                            <div className="flex gap-2 mb-4">
                                <div className="relative flex-1">
                                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Have a coupon code?"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                        disabled={discount > 0}
                                        className={`w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:border-primary/50 outline-none uppercase placeholder:normal-case ${discount > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    />
                                </div>
                                {discount > 0 ? (
                                    <button
                                        onClick={handleRemoveCoupon}
                                        className="px-6 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-500 border border-red-500/50 rounded-xl font-medium transition-colors"
                                    >
                                        Remove
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleApplyCoupon}
                                        disabled={!couponCode}
                                        className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                                    >
                                        Apply
                                    </button>
                                )}
                            </div>
                            {couponMessage && (
                                <div className={`text-sm mb-4 px-3 py-2 rounded-lg ${couponMessage.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                    {couponMessage.text}
                                </div>
                            )}
                            <div className="flex justify-between items-center py-4"><span className="text-gray-400">Total Amount</span><span className="text-3xl font-bold text-primary">₹{calculateTotal()}</span></div>

                            {/* Payment Methods */}
                            <div className="mt-8">
                                <h3 className="text-lg font-bold mb-4 text-white">Select Payment Method</h3>
                                <div className="grid gap-4">
                                    <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${selectedPaymentMethod === 'CASHFREE' ? 'border-primary bg-primary/10' : 'border-white/10 bg-white/5'}`}>
                                        <input type="radio" name="payment" value="CASHFREE" checked={selectedPaymentMethod === 'CASHFREE'} onChange={() => setSelectedPaymentMethod('CASHFREE')} className="accent-primary w-5 h-5" />
                                        <div className="flex-1"><span className="font-bold block text-white">Cashfree Payments</span><span className="text-xs text-gray-400">UPI, Cards, Netbanking</span></div>
                                    </label>
                                    <label className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/5 opacity-50 cursor-not-allowed">
                                        <input type="radio" name="payment" value="RAZORPAY" disabled className="accent-primary w-5 h-5" />
                                        <div className="flex-1"><span className="font-bold block text-gray-400">Razorpay</span><span className="text-xs text-gray-500">Coming Soon</span></div>
                                    </label>
                                </div>
                            </div>

                            <button onClick={handlePayment} disabled={isProcessing} className="w-full bg-primary text-black font-bold p-4 rounded-xl flex items-center justify-center gap-3 hover:bg-primary-hover transition-colors mt-8 disabled:opacity-70 disabled:cursor-wait">
                                {isProcessing ? <><Loader2 className="animate-spin" size={20} /> Processing...</> : <><CreditCard size={20} /> {parseFloat(calculateTotal()) === 0 ? 'Register for Free' : `Pay ₹${calculateTotal()}`}</>}
                            </button>
                            {bookingError && <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm flex items-center gap-2"><AlertCircle size={16} />{bookingError}</div>}
                        </div>
                    </div>
                )}

                {/* Step 5: Success */}
                {step === 5 && (
                    <div className="text-center py-12 animate-in fade-in zoom-in duration-500">
                        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(34,197,94,0.4)]"><Check size={48} className="text-black" /></div>
                        <h1 className="text-4xl font-bold text-white mb-4">Registration Successful!</h1>
                        <p className="text-xl text-gray-400 mb-8 max-w-md mx-auto">We have sent the tickets to <strong>{primaryUser.email}</strong>.</p>
                        <button onClick={handleFinish} className="bg-primary text-black font-bold px-8 py-3 rounded-full hover:bg-primary-hover transition-colors">View My Tickets</button>
                    </div>
                )}
            </div>
        </div>
    );
};
