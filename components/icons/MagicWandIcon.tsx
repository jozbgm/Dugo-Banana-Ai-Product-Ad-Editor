import React from 'react';

export const MagicWandIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M16 3v4m2-2h-4" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 12l-1.09 2.29a1 1 0 01-1.82 0L9 12l-2.29-1.09a1 1 0 010-1.82L9 8l1.09-2.29a1 1 0 011.82 0L13 8l2.29 1.09a1 1 0 010 1.82L13 12z" />
    </svg>
);