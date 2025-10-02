import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDogs } from '../context/DogContext';
import { useTheme } from '../context/ThemeContext';
import { Dog } from '../types';
import { ArrowLeftIcon } from './icons';

interface HeaderProps {
    title: string;
    showBackButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, showBackButton = true }) => {
    const navigate = useNavigate();
    const { dogs, selectedDog, setSelectedDog, loading } = useDogs();
    const { theme } = useTheme();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleDogSelect = (dog: Dog) => {
        setSelectedDog(dog);
        setDropdownOpen(false);
    };

    if (loading) {
        return <div className="p-4 bg-card-light dark:bg-card-dark border-b border-border-light dark:border-border-dark h-[73px]"></div>;
    }

    return (
        <header className="sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm z-10 p-4 border-b border-border-light dark:border-border-dark">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    {showBackButton && (
                        <button onClick={() => navigate(-1)} className="mr-4 p-2 rounded-full hover:bg-card-light dark:hover:bg-card-dark">
                            <ArrowLeftIcon className="w-6 h-6 text-foreground-light dark:text-foreground-dark"/>
                        </button>
                    )}
                    {/* Logo */}
                    <div className="mr-4">
                        <img 
                            src={theme === 'dark' ? '/assets/night.svg' : '/assets/daylight.svg'} 
                            alt="Logo" 
                            className="h-8 w-auto"
                        />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground-light dark:text-foreground-dark">{title}</h1>
                </div>
                {selectedDog && (
                    <div className="relative">
                        <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center space-x-2">
                            <img src={selectedDog.photoUrl} alt={selectedDog.name} className="w-10 h-10 rounded-full object-cover border-2 border-primary" />
                            <span className="font-semibold text-foreground-light dark:text-foreground-dark">{selectedDog.name}</span>
                            <svg className={`w-4 h-4 transition-transform text-subtle-light dark:text-subtle-dark ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </button>
                        {dropdownOpen && dogs.length > 1 && (
                            <div className="absolute right-0 mt-2 w-48 bg-card-light dark:bg-card-dark rounded-md shadow-lg py-1 z-20 border border-border-light dark:border-border-dark">
                                {dogs.map(dog => (
                                    <a
                                        key={dog.id}
                                        href="#"
                                        onClick={(e) => { e.preventDefault(); handleDogSelect(dog); }}
                                        className="flex items-center px-4 py-2 text-sm text-foreground-light dark:text-foreground-dark hover:bg-background-light dark:hover:bg-background-dark"
                                    >
                                        <img src={dog.photoUrl} alt={dog.name} className="w-8 h-8 rounded-full object-cover mr-3" />
                                        {dog.name}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;