import React from 'react';

export const MaskIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={className}
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        strokeWidth={1.5}
    >
        <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" 
            transform="rotate(45 12 12)" 
        />
        <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M8.25 4.5l7.5 7.5-7.5 7.5" 
            strokeDasharray="3 3"
        />
    </svg>
);
