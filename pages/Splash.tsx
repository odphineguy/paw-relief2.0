import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import pawLoaderAnimation from '../public/assets/animations/Paw Loader.json';

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
            {/* Paw Loader Animation */}
            <div className="w-64 h-64 mb-8">
                <Lottie
                    animationData={pawLoaderAnimation}
                    loop={true}
                />
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
