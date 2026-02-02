"use client"
import React, { useState } from 'react';
import {
    ChevronLeft,
    Plus,
    X,
    Asterisk,
    Save,
    Layout,
    Calendar,
    MapPin,
    // Fix: Added missing DollarSign icon import
    IndianRupee
} from 'lucide-react';
import { CustomField } from '@/types';

interface CreateEventProps {
    onBack: () => void;
}

const CreateEvent: React.FC<CreateEventProps> = ({ onBack }) => {
    const [customFields, setCustomFields] = useState<CustomField[]>([]);
    const [title, setTitle] = useState('');

    const addField = () => {
        const newField: CustomField = {
            id: Math.random().toString(36).substr(2, 9),
            label: '',
            type: 'text',
            required: false
        };
        setCustomFields([...customFields, newField]);
    };

    const removeField = (id: string) => {
        setCustomFields(customFields.filter(f => f.id !== id));
    };

    const updateField = (id: string, updates: Partial<CustomField>) => {
        setCustomFields(customFields.map(f => f.id === id ? { ...f, ...updates } : f));
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between">
                <button onClick={onBack} className="flex items-center gap-2 text-text-muted hover:text-primary-hover transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                    <span className="font-semibold">Back to Events</span>
                </button>
                <div className="flex gap-4">
                    <button className="px-6 py-2.5 rounded-xl border border-border text-text-secondary font-semibold hover:bg-background">Save Draft</button>
                    <button className="px-8 py-2.5 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:bg-primary-hover flex items-center gap-2">
                        <Save className="w-4 h-4" />
                        Launch Event
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <section className="bg-card p-8 rounded-3xl border border-border shadow-sm space-y-6">
                        <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
                            <Layout className="w-5 h-5 text-primary" />
                            Event Basics
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-text-secondary mb-2">Event Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. Hive Summer Tech Summit 2024"
                                    className="w-full px-5 py-3 rounded-2xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:bg-card transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-text-secondary mb-2">Date</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
                                        <input type="date" className="w-full pl-12 pr-5 py-3 rounded-2xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-text-secondary mb-2">Venue</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
                                        <input type="text" placeholder="Global Hive Arena" className="w-full pl-12 pr-5 py-3 rounded-2xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="bg-card p-8 rounded-3xl border border-border shadow-sm space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-text-main">Registration Fields</h3>
                            <button
                                onClick={addField}
                                className="text-primary font-bold flex items-center gap-2 hover:bg-primary/5 px-4 py-2 rounded-xl transition-all"
                            >
                                <Plus className="w-4 h-4" />
                                Add Custom Field
                            </button>
                        </div>

                        <div className="space-y-4">
                            {customFields.length === 0 ? (
                                <div className="text-center py-10 border-2 border-dashed border-border rounded-3xl">
                                    <p className="text-text-muted">No custom fields added. Default fields (Name, Email) will be used.</p>
                                </div>
                            ) : (
                                customFields.map((field) => (
                                    <div key={field.id} className="flex items-end gap-4 p-5 bg-background/50 rounded-2xl border border-border">
                                        <div className="flex-1 space-y-2">
                                            <label className="text-xs font-bold text-text-muted uppercase">Field Label</label>
                                            <input
                                                type="text"
                                                value={field.label}
                                                onChange={(e) => updateField(field.id, { label: e.target.value })}
                                                placeholder="e.g. Dietary Requirements"
                                                className="w-full px-4 py-2 rounded-xl border border-border focus:ring-2 focus:ring-primary outline-none"
                                            />
                                        </div>
                                        <div className="w-32 space-y-2">
                                            <label className="text-xs font-bold text-text-muted uppercase">Type</label>
                                            <select
                                                value={field.type}
                                                onChange={(e) => updateField(field.id, { type: e.target.value as any })}
                                                className="w-full px-4 py-2 rounded-xl border border-border outline-none"
                                            >
                                                <option value="text">Text</option>
                                                <option value="number">Number</option>
                                                <option value="select">Dropdown</option>
                                            </select>
                                        </div>
                                        <div className="flex items-center h-10 gap-2 px-2">
                                            <button
                                                onClick={() => updateField(field.id, { required: !field.required })}
                                                className={`p-2 rounded-lg transition-colors ${field.required ? 'bg-primary/20 text-primary' : 'bg-border text-text-muted'}`}
                                                title="Mark as Required"
                                            >
                                                <Asterisk size={16} />
                                            </button>
                                            <button
                                                onClick={() => removeField(field.id)}
                                                className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                </div>

                <div className="space-y-6">
                    <div className="bg-primary rounded-3xl p-6 text-white shadow-xl shadow-primary/20">
                        <h4 className="font-bold text-lg mb-4">Event Preview</h4>
                        <div className="aspect-video bg-primary-hover/50 rounded-2xl mb-4 flex items-center justify-center">
                            <span className="text-white/60 text-sm">Upload Thumbnail</span>
                        </div>
                        <h5 className="font-bold text-xl mb-1 truncate">{title || 'Your Event Title'}</h5>
                        <div className="flex items-center gap-2 text-white/60 text-sm mb-6">
                            <Calendar size={14} />
                            <span>Oct 24, 2024</span>
                        </div>
                        <button className="w-full py-3 bg-text-main text-white rounded-2xl font-bold shadow-lg">Preview Landing Page</button>
                    </div>

                    <div className="bg-card p-6 rounded-3xl border border-border">
                        <h4 className="font-bold text-text-main mb-4">Ticketing Options</h4>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-green-50 rounded-2xl">
                                <span className="text-sm font-semibold text-green-700">Free Event</span>
                                <input type="checkbox" className="w-5 h-5 rounded-md accent-primary" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-text-muted uppercase">Paid Tier Price</label>
                                <div className="relative">
                                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                    <input type="number" placeholder="25.00" className="w-full pl-10 pr-4 py-2 rounded-xl bg-background border border-border" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateEvent;
