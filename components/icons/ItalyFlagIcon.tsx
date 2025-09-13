import React from 'react';

export const ItalyFlagIcon: React.FC = () => (
    <svg width="28" height="28" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
         <defs>
            <clipPath id="it-clip">
                <circle cx="256" cy="256" r="256" />
            </clipPath>
        </defs>
        <g clipPath="url(#it-clip)">
            <path fill="#009246" d="M0 0h170.7v512H0z"/>
            <path fill="#fff" d="M170.7 0h170.6v512H170.7z"/>
            <path fill="#ce2b37" d="M341.3 0H512v512H341.3z"/>
        </g>
    </svg>
);
