import { EventDoc } from "@/types";
import Link from "next/link";
import { FileText, Download, ExternalLink, Mail, MessageCircle, Phone, Copy, Check } from "lucide-react";
import { useState } from "react";

export default function EventDocs({ docs }: { docs: EventDoc[] }) {
    if (!docs || docs.length === 0) return <p className="text-gray-400">No documents available.</p>;

    const [copiedId, setCopiedId] = useState<string | null>(null);

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const getIcon = (doc: EventDoc) => {
        if (doc.type === 'text') return <Phone className="w-6 h-6" />;
        if (doc.type === 'link') {
            if (doc.url?.includes('whatsapp.com')) return <MessageCircle className="w-6 h-6" />;
            if (doc.url?.startsWith('mailto:')) return <Mail className="w-6 h-6" />;
            return <ExternalLink className="w-6 h-6" />;
        }
        if (doc.type === 'pdf') return <FileText className="w-6 h-6" />;
        return <FileText className="w-6 h-6" />;
    };

    const getActionLabel = (doc: EventDoc) => {
        if (doc.type === 'text') return 'Copy Numbers';
        if (doc.type === 'link') {
            if (doc.url?.includes('whatsapp.com')) return 'Join Now';
            if (doc.url?.startsWith('mailto:')) return 'Contact Us';
            return 'Visit Link';
        }
        return doc.type === 'pdf' ? 'Download' : 'View Resource';
    };

    const getActionIcon = (doc: EventDoc) => {
        if (doc.type === 'text') return copiedId === doc.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />;
        if (doc.type === 'link') return <ExternalLink className="w-4 h-4" />;
        return <Download className="w-4 h-4" />;
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {docs.map((doc, idx) => {
                const docId = doc.id || `doc-${idx}`;
                return (
                    <div key={docId} className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:border-brand-primary/30 transition-all group flex flex-col justify-between h-full">
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors shrink-0">
                                    {getIcon(doc)}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-lg text-white group-hover:text-brand-primary transition-colors">{doc.title}</h4>
                                    {doc.type === 'text' && doc.content && (
                                        <p className="text-gray-300 text-sm mt-1 font-mono leading-relaxed">{doc.content}</p>
                                    )}
                                    {doc.description && <p className="text-gray-400 text-sm">{doc.description}</p>}
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-white/10 flex justify-end">
                            {doc.type === 'text' ? (
                                <button
                                    onClick={() => doc.content && handleCopy(doc.content, docId)}
                                    className="text-sm font-medium text-brand-primary hover:text-brand-primary/80 flex items-center gap-1 transition-colors"
                                >
                                    {copiedId === docId ? 'Copied!' : getActionLabel(doc)}
                                    {getActionIcon({ ...doc, id: docId })}
                                </button>
                            ) : (
                                <Link href={doc.url || '#'} target="_blank" className="text-sm font-medium text-brand-primary hover:text-brand-primary/80 flex items-center gap-1">
                                    {getActionLabel(doc)}
                                    {getActionIcon(doc)}
                                </Link>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
