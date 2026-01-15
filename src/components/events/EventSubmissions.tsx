'use client';
import { Submission } from "@/types";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function EventSubmissions({ initialSubmissions }: { initialSubmissions: Submission[] }) {
    const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions || []);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newSubmission, setNewSubmission] = useState({ title: '', description: '', link: '', teamName: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const submission: Submission = {
            id: Math.random().toString(36).substr(2, 9),
            title: newSubmission.title,
            description: newSubmission.description,
            teamName: newSubmission.teamName,
            links: [{ label: 'Project Link', url: newSubmission.link }],
            submittedBy: { name: 'You', avatar: 'https://ui-avatars.com/api/?name=You' }, // Mock user
            submittedAt: new Date().toISOString().split('T')[0]
        };
        setSubmissions([submission, ...submissions]);
        setIsModalOpen(false);
        setNewSubmission({ title: '', description: '', link: '', teamName: '' });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-brand-primary/5 p-4 rounded-xl border border-brand-primary/20">
                <div>
                    <h3 className="text-xl font-bold text-white">Project Submissions</h3>
                    <p className="text-gray-400 text-sm">Submit your project or view others.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-brand-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-primary/90 transition-all flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Submit Project
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {submissions.map((sub) => (
                    <div key={sub.id} className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:border-brand-primary/30 transition-all">
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <h4 className="text-xl font-bold text-white">{sub.title}</h4>
                                    {sub.teamName && <span className="text-xs bg-white/10 text-gray-300 px-2 py-1 rounded-full">{sub.teamName}</span>}
                                </div>
                                <p className="text-gray-400">{sub.description}</p>
                                <div className="flex items-center gap-2 pt-2">
                                    <div className="w-6 h-6 rounded-full overflow-hidden relative">
                                        {sub.submittedBy.avatar && <Image src={sub.submittedBy.avatar} alt={sub.submittedBy.name} fill className="object-cover" />}
                                    </div>
                                    <span className="text-sm text-gray-400">Submitted by <span className="text-white">{sub.submittedBy.name}</span> on {sub.submittedAt}</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 min-w-[150px]">
                                {sub.links.map((link, i) => (
                                    <Link key={i} href={link.url} target="_blank" className="flex items-center justify-center gap-2 w-full bg-white/5 hover:bg-brand-primary/20 text-brand-primary py-2 px-4 rounded-lg text-sm font-medium border border-brand-primary/20 hover:border-brand-primary/50 transition-all">
                                        {link.label}
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
                {submissions.length === 0 && (
                    <div className="text-center py-10 bg-white/5 rounded-xl border border-white/5 border-dashed">
                        <p className="text-gray-400">No submissions yet. Be the first!</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-[#0f0f13] border border-white/10 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                        <h2 className="text-2xl font-bold text-white mb-6">Submit Your Project</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Project Title</label>
                                <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-brand-primary focus:outline-none" value={newSubmission.title} onChange={e => setNewSubmission({ ...newSubmission, title: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Team Name (Optional)</label>
                                <input type="text" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-brand-primary focus:outline-none" value={newSubmission.teamName} onChange={e => setNewSubmission({ ...newSubmission, teamName: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                                <textarea required rows={3} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-brand-primary focus:outline-none" value={newSubmission.description} onChange={e => setNewSubmission({ ...newSubmission, description: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Project Link (Demo/Repo)</label>
                                <input required type="url" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-brand-primary focus:outline-none" value={newSubmission.link} onChange={e => setNewSubmission({ ...newSubmission, link: e.target.value })} />
                            </div>
                            <button type="submit" className="w-full bg-brand-primary text-white font-bold py-3 rounded-xl hover:bg-brand-primary/90 transition-all mt-2">
                                Submit Project
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
