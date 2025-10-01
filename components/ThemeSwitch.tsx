import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { SunIcon, MoonIcon } from './icons';

const ThemeSwitch: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors bg-gray-200 dark:bg-gray-700 focus:outline-none"
        >
            <span
                className={`${
                    theme === 'light' ? 'translate-x-0.5' : 'translate-x-5'
                } inline-block w-4 h-4 transform bg-white rounded-full transition-transform flex items-center justify-center`}
            >
                {theme === 'light' ? (
                    <SunIcon className="w-3 h-3 text-yellow-500" />
                ) : (
                    <MoonIcon className="w-3 h-3 text-blue-300" />
                )}
            </span>
        </button>
    );
};

export default ThemeSwitch;
