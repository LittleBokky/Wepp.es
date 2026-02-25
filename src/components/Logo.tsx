import React from 'react';

interface LogoProps {
    className?: string;
    onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({ className = "", onClick }) => {
    return (
        <div
            className={`relative cursor-pointer transition-transform hover:scale-105 inline-block ${className}`}
            onClick={onClick}
        >
            <img
                src="/src/public/Wepp_logo.png"
                alt="WEPP Logo"
                className="h-full w-auto object-contain pointer-events-none"
                style={{ minHeight: '100%' }}
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src.includes('/src/public/')) {
                        target.src = '/Wepp_logo.png';
                    }
                }}
            />
        </div>
    );
};
