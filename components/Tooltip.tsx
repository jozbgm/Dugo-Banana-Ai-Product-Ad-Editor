import React from 'react';

interface TooltipProps {
    children: React.ReactNode;
    text: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ children, text }) => {
    return (
        <div className="relative group">
            {children}
            <div className="absolute bottom-full mb-2 w-max max-w-xs bg-white text-slate-700 dark:bg-slate-800 dark:text-white text-xs rounded py-1.5 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 border border-slate-200 dark:border-slate-600 shadow-lg left-1/2 -translate-x-1/2">
                {text}
                <svg className="absolute text-white dark:text-slate-800 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255">
                    <polygon className="fill-current" points="0,0 127.5,127.5 255,0"/>
                </svg>
            </div>
        </div>
    );
};