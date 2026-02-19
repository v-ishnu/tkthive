"use client";
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Mail, Lock, User, PartyPopper, Phone, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginUser, googleLogin, signupUser, verifyEmail, resendOtp, forgotPassword, resetPassword } from '@/store/slices/authslice';

import { useToast } from '@/context/ToastContext';
import { enablePushNotifications } from '@/context/usePush';

const EVENT_IMAGES_COL_1 = [
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400&auto=format&fit=crop", // Concert
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=400&auto=format&fit=crop", // Gaming
    "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=400&auto=format&fit=crop", // Conference
    "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=400&auto=format&fit=crop", // Party
];

const EVENT_IMAGES_COL_2 = [
    "https://images.unsplash.com/photo-1552674605-4696c2458404?q=80&w=400&auto=format&fit=crop", // Sports
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=400&auto=format&fit=crop", // Crowd
    "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=400&auto=format&fit=crop", // Jazz
    "https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?q=80&w=400&auto=format&fit=crop", // Lighting
];

const EVENT_IMAGES_COL_3 = [
    "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=400&auto=format&fit=crop", // Gaming 2
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=400&auto=format&fit=crop", // Rock
    "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=400&auto=format&fit=crop", // Talk
    "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=400&auto=format&fit=crop", // Festival
];

function AuthContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectPath = searchParams.get('redirect') || '/';
    const dispatch = useAppDispatch();
    const { isLoading } = useAppSelector((state) => state.auth);
    const { showToast } = useToast();
    const [mode, setMode] = useState<'login' | 'signup'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    // OTP State
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [showResetPassword, setShowResetPassword] = useState(false);
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [timer, setTimer] = useState(0);
    const [isGoogleAuthLoading, setIsGoogleAuthLoading] = useState(false);


    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (mode === 'login') {
            try {
                const resultAction = await dispatch(loginUser({ email, password }));
               
                if (loginUser.fulfilled.match(resultAction)) {
                    if (resultAction.payload.requiresVerification) {
                        showToast("Please verify your email to continue", "info");
                        setShowOtpInput(true);
                        setTimer(30);
                    } else {
                        showToast("Login successful! Welcome back.", "success");

                        // Enable push notifications after successful login
                        // if(Notification.permission !== "granted") {
                        //     await  enablePushNotifications(resultAction.payload.data.id);
                        // }

                        if (resultAction.payload.data.role === 'ORGANIZER') {
                            router.push('/organizer/dashboard');
                        } else {
                            router.push(redirectPath);
                        }
                    }
                } else {
                    const msg = resultAction.payload as string || "Login failed";
                    showToast(msg, "error");
                }
            } catch (err) {
                showToast("An unexpected error occurred", "error");
            }
        } else {
            try {
                const resultAction = await dispatch(signupUser({ email, password, name, phoneNumber }));
                if (signupUser.fulfilled.match(resultAction)) {
                    if (resultAction.payload.requiresVerification) {
                        showToast("Account created! Please verify your email.", "info");
                        setShowOtpInput(true);
                        setTimer(30); // Start 30s timer
                    } else {
                        showToast("Signup successful!", "success");

                        // Enable push notifications after successful signup
                        // if(Notification.permission !== "granted") {
                        //     await  enablePushNotifications(resultAction.payload.data.id);
                        // }

                        router.push(redirectPath);
                    }
                } else {
                    const msg = resultAction.payload as string || "Signup failed";
                    showToast(msg, "error");
                }
            } catch (err) {
                showToast("An unexpected error occurred", "error");
            }
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const resultAction = await dispatch(verifyEmail({ otp, email }));
            if (verifyEmail.fulfilled.match(resultAction)) {
                showToast("Email verified successfully!", "success");
                router.push(redirectPath);
            } else {
                const msg = resultAction.payload as string || "Verification failed";
                showToast(msg, "error");
            }
        } catch (err) {
            showToast("An unexpected error occurred", "error");
        }
    };

    const handleResend = async () => {
        if (timer > 0) return;
        try {
            await dispatch(resendOtp({ email }));
            setTimer(60); // Reset timer to 60s
            showToast("OTP code resent to your email", "success");
        } catch (err) {
            showToast("Failed to resend OTP", "error");
        }
    }

    const handleGoogleLogin = () => {
        setIsGoogleAuthLoading(true);
        dispatch(googleLogin(redirectPath));
    };

    return (
        <div className="min-h-screen w-full flex bg-dark">
            <style>{`
        @keyframes scroll-up {
            0% { transform: translateY(0); }
            100% { transform: translateY(-50%); }
        }
        @keyframes scroll-down {
            0% { transform: translateY(-50%); }
            100% { transform: translateY(0); }
        }
        .animate-scroll-up {
            animation: scroll-up 40s linear infinite;
        }
        .animate-scroll-down {
            animation: scroll-down 45s linear infinite;
        }
      `}</style>

            {/* Back Button */}
            <button
                onClick={() => router.back()}
                className="absolute top-6 left-6 z-50 p-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition-colors border border-white/10"
            >
                <ArrowLeft size={20} />
            </button>

            {/* Left Side - Animated Banner (Sticky on Desktop) */}
            <div className="hidden md:flex w-1/2 h-screen sticky top-0 relative overflow-hidden bg-dark items-center justify-center text-center border-r border-white/5">

                {/* Animated Scrolling Grid */}
                <div className="absolute inset-0 flex gap-4 p-4 opacity-40 -skew-x-6 scale-110 transform origin-center">
                    {/* Column 1 - Scroll Up */}
                    <div className="flex-1 space-y-4 animate-scroll-up">
                        {[...EVENT_IMAGES_COL_1, ...EVENT_IMAGES_COL_1, ...EVENT_IMAGES_COL_1].map((img, i) => (
                            <div key={i} className="rounded-2xl overflow-hidden aspect-[3/4]">
                                <img src={img} alt="" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                            </div>
                        ))}
                    </div>

                    {/* Column 2 - Scroll Down */}
                    <div className="flex-1 space-y-4 animate-scroll-down">
                        {[...EVENT_IMAGES_COL_2, ...EVENT_IMAGES_COL_2, ...EVENT_IMAGES_COL_2].map((img, i) => (
                            <div key={i} className="rounded-2xl overflow-hidden aspect-[3/4]">
                                <img src={img} alt="" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                            </div>
                        ))}
                    </div>

                    {/* Column 3 - Scroll Up */}
                    <div className="flex-1 space-y-4 animate-scroll-up">
                        {[...EVENT_IMAGES_COL_3, ...EVENT_IMAGES_COL_3, ...EVENT_IMAGES_COL_3].map((img, i) => (
                            <div key={i} className="rounded-2xl overflow-hidden aspect-[3/4]">
                                <img src={img} alt="" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/85 to-dark/60 z-10" />
                <div className="absolute inset-0 bg-black/20 z-10 backdrop-blur-[2px]" />

                <div className="relative z-20 space-y-8 max-w-lg p-12">
                    <div className=" mx-auto flex items-center justify-center rotate-12  mb-10 transition-transform hover:rotate-6 duration-500">
                        <img src="/logo/tktmain.png" alt="tkthive" className="w-24 h-24 object-contain" />
                    </div>

                    <h2 className="text-5xl font-bold text-white tracking-tight drop-shadow-2xl">
                        {showOtpInput ? 'Verify Email' :
                            showForgotPassword ? (showResetPassword ? 'Reset Password' : 'Forgot Password') :
                                (mode === 'login' ? 'Welcome Back!' : 'Join the Hive!')}
                    </h2>

                    <p className="text-gray-300 text-lg leading-relaxed drop-shadow-md">
                        {showOtpInput
                            ? 'We\'ve sent a verification code to your email. Enter it below to unlock your account.'
                            : showForgotPassword
                                ? (showResetPassword ? 'Enter the code sent to your email and your new password.' : 'Enter your email address to receive a password reset code.')
                                : (mode === 'login'
                                    ? 'Skip the FOMO. Log in to access your tickets, saved events, and exclusive community perks.'
                                    : 'Create an account to start booking the best concerts, workshops, and tournaments near you.')}
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full md:w-1/2 bg-card min-h-screen flex flex-col justify-center p-8 md:p-20 relative">
                <div className="max-w-md mx-auto w-full space-y-10">
                    <div className="text-center md:text-left">
                        <h3 className="text-3xl font-bold text-white mb-3">
                            {showOtpInput ? 'Enter Logic Code' :
                                showForgotPassword ? (showResetPassword ? 'Set New Password' : 'Recover Account') :
                                    (mode === 'login' ? 'Login to your account' : 'Create new account')}
                        </h3>
                        <p className="text-gray-400">
                            {showOtpInput
                                ? `Sent to ${email}`
                                : showForgotPassword
                                    ? (showResetPassword ? 'Verification Required' : 'We will send you a code')
                                    : (mode === 'login' ? 'Enter your details below' : "It's free and takes less than a minute")}
                        </p>
                    </div>

                    {showOtpInput ? (
                        <form onSubmit={handleVerify} className="space-y-5">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowOtpInput(false);
                                    setTimer(0);
                                }}
                                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-4"
                            >
                                <ArrowLeft size={16} />
                                Back to Signup
                            </button>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Verification OTP</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={20} />
                                    <input
                                        type="text"
                                        required
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        placeholder="123456"
                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-primary/50 outline-none transition-all placeholder:text-gray-600 tracking-widest text-lg font-bold"
                                        maxLength={6}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-primary hover:bg-primary-hover text-black font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/20 mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
                            >
                                {isLoading ? 'Verifying...' : 'Verify'}
                            </button>

                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    disabled={timer > 0}
                                    className="text-primary hover:text-white transition-colors text-sm font-bold disabled:text-gray-500 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
                                >
                                    <RefreshCw size={14} className={timer > 0 ? "animate-spin" : ""} />
                                    {timer > 0 ? `Resend code in ${timer}s` : "Resend Code"}
                                </button>
                            </div>
                        </form>
                    ) : showForgotPassword ? (
                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            if (showResetPassword) {
                                // Handle Reset Password Submission
                                try {
                                    const resultAction = await dispatch(resetPassword({ email, otp, newPassword }));
                                    if (resetPassword.fulfilled.match(resultAction)) {
                                        showToast("Password reset successfully! Please login.", "success");
                                        setShowForgotPassword(false);
                                        setShowResetPassword(false);
                                        setMode('login');
                                    } else {
                                        const msg = resultAction.payload as string || "Reset failed";
                                        showToast(msg, "error");
                                    }
                                } catch (err) {
                                    showToast("An unexpected error occurred", "error");
                                }
                            } else {
                                // Handle Forgot Password Email Submission
                                try {
                                    const resultAction = await dispatch(forgotPassword({ email }));
                                    if (forgotPassword.fulfilled.match(resultAction)) {
                                        showToast("Reset code sent to your email", "success");
                                        setShowResetPassword(true);
                                        setTimer(60);
                                    } else {
                                        const msg = resultAction.payload as string || "Failed to send code";
                                        showToast(msg, "error");
                                    }
                                } catch (err) {
                                    showToast("An unexpected error occurred", "error");
                                }
                            }
                        }} className="space-y-5">
                            <button
                                type="button"
                                onClick={() => {
                                    if (showResetPassword) {
                                        setShowResetPassword(false);
                                    } else {
                                        setShowForgotPassword(false);
                                    }
                                }}
                                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-4"
                            >
                                <ArrowLeft size={16} />
                                Back
                            </button>

                            {!showResetPassword ? (
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Email Address</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={20} />
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="name@example.com"
                                            className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-primary/50 outline-none transition-all placeholder:text-gray-600"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Verification OTP</label>
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={20} />
                                            <input
                                                type="text"
                                                required
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                                placeholder="Enter OTP"
                                                className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-primary/50 outline-none transition-all placeholder:text-gray-600 tracking-widest text-lg font-bold"
                                                maxLength={6}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">New Password</label>
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={20} />
                                            <input
                                                type={showNewPassword ? "text" : "password"}
                                                required
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                placeholder="New Password"
                                                className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-12 text-white focus:border-primary/50 outline-none transition-all placeholder:text-gray-600"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                            >
                                                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-primary hover:bg-primary-hover text-black font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/20 mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
                            >
                                {isLoading ? 'Processing...' : (showResetPassword ? 'Reset Password' : 'Send Reset Code')}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {mode === 'signup' && (
                                <>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Full Name</label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={20} />
                                            <input
                                                type="text"
                                                required
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="Your Name"
                                                className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-primary/50 outline-none transition-all placeholder:text-gray-600"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Phone Number</label>
                                        <div className="relative group">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={20} />
                                            <input
                                                type="tel"
                                                required
                                                value={phoneNumber}
                                                onChange={(e) => setPhoneNumber(e.target.value)}
                                                placeholder="+91 98765 43210"
                                                className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-primary/50 outline-none transition-all placeholder:text-gray-600"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={20} />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@example.com"
                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-primary/50 outline-none transition-all placeholder:text-gray-600"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={20} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-12 text-white focus:border-primary/50 outline-none transition-all placeholder:text-gray-600"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            {mode === 'login' && (
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setShowForgotPassword(true)}
                                        className="text-sm text-primary hover:text-white transition-colors"
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-primary hover:bg-primary-hover text-black font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/20 mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
                            >
                                {isLoading ? 'Processing...' : (mode === 'login' ? 'Login Now' : 'Create Account')}
                            </button>
                        </form>
                    )}

                    {!showOtpInput && !showForgotPassword && (
                        <div className="relative py-4">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/10"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase tracking-widest">
                                <span className="bg-card px-4 text-gray-500">Or continue with</span>
                            </div>
                        </div>
                    )}


                    {!showOtpInput && !showForgotPassword && (
                        <button
                            onClick={handleGoogleLogin}
                            disabled={isLoading || isGoogleAuthLoading}
                            className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed">
                            {isGoogleAuthLoading ? (
                                <>
                                    <RefreshCw size={20} className="animate-spin" />
                                    Redirecting...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    {mode === 'login' ? 'Login with Google' : 'Sign up with Google'}
                                </>
                            )}
                        </button>
                    )}

                    {!showOtpInput && !showForgotPassword && (
                        <p className="text-center text-gray-400">
                            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                            <button
                                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                                className="text-white font-bold hover:text-primary transition-colors ml-1"
                            >
                                {mode === 'login' ? 'Create a new account now' : 'Login here'}
                            </button>
                        </p>
                    )}

                </div>
            </div>
        </div>
    );
};

export default function AuthPage() {
    return (
        <React.Suspense fallback={<div className="min-h-screen bg-dark w-full flex items-center justify-center text-white">Loading...</div>}>
            <AuthContent />
        </React.Suspense>
    );
}
