import React from 'react';
import { ExternalLink, Mail, Phone, Globe } from 'lucide-react';

interface OrganizerProps {
    organizer: {
        name: string;
        logoUrl?: string;
        description?: string;
        contactEmail?: string;
        contactPhone?: string;
        website?: string;
    };
}

export const OrganizerProfile: React.FC<OrganizerProps> = ({ organizer }) => {
    return (
        <div className="bg-black border border-white/10 rounded-3xl p-6 max-w-md w-full mb-6 relative flex items-center gap-6">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20 shrink-0">
                <img
                    src={organizer.logoUrl || `https://ui-avatars.com/api/?name=${organizer.name}&background=random`}
                    alt={organizer.name}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Label & Name */}
            <div>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">
                    ORGANIZED BY
                </p>
                <h3 className="text-2xl font-bold text-white tracking-tight leading-none">
                    {organizer.name}
                </h3>
            </div>
        </div>
    );
};

export const OrganizerContact: React.FC<OrganizerProps> = ({ organizer }) => {
    return (
        <div className="bg-black border border-white/10 rounded-3xl p-8 max-w-md w-full">
            <h4 className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
                CONTACT DETAILS
            </h4>

            <div className="space-y-4">
                {organizer.contactEmail && (
                    <div className="flex items-start gap-4">
                        <span className="text-orange-500 font-bold text-sm min-w-[60px]">Email:</span>
                        <a
                            href={`mailto:${organizer.contactEmail}`}
                            className="text-gray-300 hover:text-white transition-colors text-sm break-all font-medium"
                        >
                            {organizer.contactEmail}
                        </a>
                    </div>
                )}

                {organizer.contactPhone && (
                    <div className="flex items-center gap-4">
                        <span className="text-orange-500 font-bold text-sm min-w-[60px]">Phone:</span>
                        <a
                            href={`tel:${organizer.contactPhone}`}
                            className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
                        >
                            {organizer.contactPhone}
                        </a>
                    </div>
                )}

                {organizer.website && (
                    <div className="flex items-center gap-4">
                        <span className="text-orange-500 font-bold text-sm min-w-[60px]">Website:</span>
                        <a
                            href={organizer.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-300 hover:text-white transition-colors text-sm font-medium flex items-center gap-1"
                        >
                            Visit Site
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

// Keep old export for compatibility if any, or just export both
export const OrganizerCard: React.FC<OrganizerProps> = (props) => (
    <>
        <OrganizerProfile {...props} />
        <OrganizerContact {...props} />
    </>
);
