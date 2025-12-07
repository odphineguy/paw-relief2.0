import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import pawLoaderAnimation from '../assets/animations/Paw Loader.json';
import { useTheme } from '../context/ThemeContext';

const Splash: React.FC = () => {
    const navigate = useNavigate();
    const { theme } = useTheme();

    useEffect(() => {
        // Auto-navigate to auth entry after 3.5 seconds
        const timer = setTimeout(() => {
            navigate('/login');
        }, 3500);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background-light dark:bg-background-dark p-6">
            {/* Paw Loader Animation */}
            <div
                className="w-64 h-64 mb-8"
                style={theme === 'light' ? { filter: 'invert(1) hue-rotate(180deg)' } : {}}
            >
                <Lottie
                    animationData={pawLoaderAnimation}
                    loop={true}
                />
            </div>

            {/* App Name */}
            <h1 className="text-4xl font-display font-bold text-foreground-light dark:text-foreground-dark mb-2">
                Paw Relief
            </h1>

            {/* Tagline */}
            <p className="text-lg font-body text-subtle-light dark:text-subtle-dark text-center">
                Your dog's allergy management companion.
            </p>
        </div>
    );
};

export default Splash;
