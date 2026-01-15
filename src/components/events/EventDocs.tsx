import { EventDoc } from "@/types";
import Link from "next/link";

export default function EventDocs({ docs }: { docs: EventDoc[] }) {
    if (!docs || docs.length === 0) return <p className="text-gray-400">No documents available.</p>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {docs.map((doc) => (
                <div key={doc.id} className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:border-brand-primary/30 transition-all group">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors">
                                {doc.type === 'pdf' ? (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                ) : (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                                )}
                            </div>
                            <div>
                                <h4 className="font-semibold text-lg text-white group-hover:text-brand-primary transition-colors">{doc.title}</h4>
                                <p className="text-gray-400 text-sm">{doc.description}</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/10 flex justify-end">
                        <Link href={doc.url} target="_blank" className="text-sm font-medium text-brand-primary hover:text-brand-primary/80 flex items-center gap-1">
                            {doc.type === 'pdf' ? 'Download' : 'View Resource'}
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );
}
