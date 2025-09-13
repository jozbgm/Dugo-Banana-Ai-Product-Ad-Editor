import React from 'react';

export const SaveIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path d="M7.5 2.5a.5.5 0 00-1 0V5a.5.5 0 001 0V2.5z" />
        <path d="M6 3.5a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v2a.5.5 0 01-1 0V4h-1.5a.5.5 0 01-.5-.5V3.5z" />
        <path fillRule="evenodd" d="M3.5 2A1.5 1.5 0 002 3.5v13A1.5 1.5 0 003.5 18h13a1.5 1.5 0 001.5-1.5V6.854a1.5 1.5 0 00-.44-1.06l-4.293-4.293A1.5 1.5 0 0012.146 1H3.5a.5.5 0 00-.5.5v1a.5.5 0 00.5.5H5v2.5a.5.5 0 001 0V3h5.146a.5.5 0 00.354-.146l4.293-4.293a.5.5 0 00-.354-.854H3.5A1.5 1.5 0 002 3.5v13A1.5 1.5 0 003.5 18h13a1.5 1.5 0 001.5-1.5V6.854a1.5 1.5 0 00-.44-1.06l-4.293-4.293A1.5 1.5 0 0012.146 1H3.5zm7 11.5a.5.5 0 01-1 0V9.5a.5.5 0 011 0v4z" clipRule="evenodd" />
    </svg>
);
