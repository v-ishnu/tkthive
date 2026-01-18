'use client';
import { EventTab, Submission } from "@/types";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
// import axios from "axios";
import { useToast } from "@/context/ToastContext";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { submitProject } from "@/store/slices/eventSlice";

interface EventSubmissionsProps {
    tab: EventTab;
    eventId: string;
    initialSubmissions: any; // Can be a single object or array depending on storage
}

export default function EventSubmissions({ tab, eventId, initialSubmissions }: EventSubmissionsProps) {
    // If backend stores a single object logic (as per current schema), we might want to display it
    // But for now, let's treat 'submissions' as the user's current submission status

    // The previous mocked version showed a list of ALL submissions. 
    // The current requirement ("take submission only when user is registered") implies a private submission flow.
    // However, the export logic suggests we want to collect them. 
    // Let's assume this view is for "My Submission" and potentially "Public Gallery" if configured.
    // For this task, I will focus on the "Submit Project" form flow.

    const [isModalOpen, setIsModalOpen] = useState(false);
    // const [loading, setLoading] = useState(false); // Managed by Redux slice if needed, or local is fine for button state. 
    // Actually, slice has 'loading'. Let's use local loading for the specific form submission to avoid global loading state overlap if any, or just keep local is simpler.
    // But specific request was "use dispatch". 
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Record<string, any>>({});

    const dispatch = useAppDispatch();

    const { showToast } = useToast();

    const { user } = useAppSelector((state) => state.auth);
    const config = tab.data || {};
    const info = config.info || {};
    const fields = config.fields || [];

    // Check if user has already submitted (if we had that data in initialSubmissions, currently it might be just generic event data)
    // For now, we allow re-submission/update.

    const handleChange = (name: string, value: any) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            showToast("Please login to submit", 'error');
            return;
        }

        setLoading(true);
        try {
            await dispatch(submitProject({ eventId, formData })).unwrap();

            showToast("Project submitted successfully!", 'success');
            setIsModalOpen(false);
            // Optionally update local state to show 'Submitted' status
        } catch (error: any) {
            console.error(error);
            const msg = error || "Submission failed"; // error string from rejectWithValue
            if (msg === "NOT_REGISTERED_OR_CONFIRMED") {
                showToast("You must have a confirmed registration to submit.", 'error');
            } else if (msg === "SUBMISSION_DEADLINE_PASSED") {
                showToast("Submission deadline has passed.", 'error');
            } else {
                showToast(msg, 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    const renderField = (field: any) => {
        switch (field.type) {
            case 'TEXTAREA':
                return (
                    <textarea
                        required={field.required}
                        rows={4}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary focus:outline-none"
                        value={formData[field.name] || ''}
                        onChange={e => handleChange(field.name, e.target.value)}
                    />
                );
            case 'URL':
                return (
                    <input
                        required={field.required}
                        type="url"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary focus:outline-none"
                        value={formData[field.name] || ''}
                        onChange={e => handleChange(field.name, e.target.value)}
                    />
                );
            case 'TEXT':
            default:
                return (
                    <input
                        required={field.required}
                        type="text"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary focus:outline-none"
                        value={formData[field.name] || ''}
                        onChange={e => handleChange(field.name, e.target.value)}
                    />
                );
        }
    };

    return (
        <div className="space-y-6">
            {/* Header / Info Section */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 transition-all duration-300">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-2">{tab.title}</h3>
                        <p className="text-gray-300 max-w-2xl">{info.instructions || "Please complete the form below to submit your project."}</p>

                        {info.deadline && (
                            <div className="mt-4 flex items-center gap-2 text-sm text-yellow-400 bg-yellow-400/10 px-3 py-1.5 rounded-lg w-fit">
                                <span className="font-bold">Deadline:</span>
                                <span>{new Date(info.deadline).toLocaleString()}</span>
                            </div>
                        )}

                        {info.allowedFormats && (
                            <div className="mt-2 text-xs text-gray-400">
                                Allowed: {info.allowedFormats.join(", ")}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => setIsModalOpen(!isModalOpen)}
                        className={`px-6 py-3 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(251,191,36,0.1)] flex items-center gap-2 whitespace-nowrap ${isModalOpen
                            ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/50'
                            : 'bg-primary text-black hover:bg-primary/90 hover:scale-105 active:scale-95'
                            }`}
                    >
                        {isModalOpen ? 'Cancel Submission' : 'Submit / Update Project'}
                    </button>
                </div>
            </div>

            {/* Inline Form */}
            {isModalOpen && (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="mb-8 border-b border-white/10 pb-4">
                        <h2 className="text-xl md:text-2xl font-bold text-white">Submission Form</h2>
                        <p className="text-gray-400 text-sm mt-1">Fill out the details below exactly as required.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
                        {fields.map((field: any, idx: number) => (
                            <div key={idx} className="group">
                                <label className="block text-sm font-bold text-gray-300 mb-2 group-focus-within:text-primary transition-colors">
                                    {field.label} {field.required && <span className="text-red-500">*</span>}
                                </label>
                                {renderField(field)}
                            </div>
                        ))}

                        <div className="pt-6 border-t border-white/10 mt-8">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full md:w-auto px-12 bg-primary text-black font-bold py-4 rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:shadow-[0_0_30px_rgba(251,191,36,0.5)]"
                            >
                                {loading ? (
                                    <>
                                        <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                                        Submitting...
                                    </>
                                ) : (
                                    "Submit Project"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
