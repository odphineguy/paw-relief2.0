import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ThemeSwitch: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <button
            type="button"
            onClick={toggleTheme}
            className="shrink-0 relative"
            style={{ width: '51px', height: '31px' }}
        >
            {/* Track */}
            <div 
                className="absolute inset-0 rounded-full transition-colors duration-200"
                style={{ backgroundColor: isDark ? '#3b82f6' : '#d1d5db' }}
            />
            {/* Knob */}
            <div 
                className="absolute top-[2px] rounded-full bg-white shadow-md transition-transform duration-200"
                style={{ 
                    width: '27px', 
                    height: '27px',
                    left: '2px',
                    transform: isDark ? 'translateX(20px)' : 'translateX(0px)'
                }}
            />
        </button>
    );
};

export default ThemeSwitch;
