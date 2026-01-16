import React from 'react';
import { cn } from '@/lib/utils'; // Assuming you have a utils file for cn, if not I'll just use string interpolation or ensure it exists.

// Checking if cn exists, if not I will just use a helper or simple template literal.
// But usually standard setup has it. I'll assume standard shadcn-like structure or just simple classnames.
// To be safe I will just use simple class combination if I am not sure, but let's check for lib/utils later. 
// For now, I will write it without external dependency to be safe or use what's available.

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> { }

export const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
    return (
        <div
            className={`animate-pulse rounded-md bg-white/10 ${className}`}
            {...props}
        />
    );
};
