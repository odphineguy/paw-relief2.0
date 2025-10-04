import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Splash: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Auto-navigate to testimonials after 2 seconds
        const timer = setTimeout(() => {
            navigate('/testimonials');
        }, 2000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-100 to-green-50 dark:from-green-900 dark:to-green-800 p-6">
            {/* Dog Illustration Placeholder */}
            <div className="w-64 h-64 rounded-full bg-green-200 dark:bg-green-700 flex items-center justify-center mb-8 overflow-hidden">
                {/* Placeholder for dog illustration */}
                <div className="text-6xl">🐕</div>
            </div>

            {/* App Name */}
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Paw Relief
            </h1>

            {/* Tagline */}
            <p className="text-lg text-gray-600 dark:text-gray-300 text-center">
                Your dog's allergy management companion.
            </p>
        </div>
    );
};

export default Splash;
