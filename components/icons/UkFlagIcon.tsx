import React from 'react';

export const UkFlagIcon: React.FC = () => (
    <svg width="28" height="28" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <clipPath id="uk-clip">
                <circle cx="256" cy="256" r="256" />
            </clipPath>
        </defs>
        <g clipPath="url(#uk-clip)">
            <path fill="#012169" d="M0 0h512v512H0z"/>
            <path fill="#FFF" d="m67.3 0 188.7 125.8L444.7 0h67.3v67.3L323.3 256l188.7 188.7v67.3h-67.3L256 323.3 67.3 512H0v-67.3L188.7 256 0 67.3V0h67.3z"/>
            <path fill="#C8102E" d="m285.3 256 226.7 151.1v47.6L285.3 256zM512 67.3 285.3 256 512 444.7V381L378.7 256 512 131.7V67.3zM226.7 256 0 104.9V57.3L226.7 256zM0 444.7 226.7 256 0 67.3V132l133.3 124L0 380.7v64z"/>
            <path fill="#FFF" d="M512 194.3v123.4H0V194.3zM317.7 0v512h-123.4V0z"/>
            <path fill="#C8102E" d="M512 214.9v82.2H0v-82.2zM297.1 0v512H215V0z"/>
        </g>
    </svg>
);
