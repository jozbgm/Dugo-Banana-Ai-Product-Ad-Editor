import React, { useState, ReactNode } from 'react';

interface CollapsibleSectionProps {
    title: string;
    children: ReactNode;
    defaultOpen?: boolean;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 text-left"
                aria-expanded={isOpen}
            >
                <h3 className="text-lg font-semibold text-amber-500 dark:text-amber-300">{title}</h3>
                <svg
                    className={`w-5 h-5 text-slate-500 dark:text-slate-400 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[1000px]' : 'max-h-0'}`}
            >
                <div className="p-4 pt-0">
                    {children}
                </div>
            </div>
        </div>
    );
};