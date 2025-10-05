import React from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
            {/* Welcome Content */}
            <div className="flex-1 space-y-6">
                <div className="text-center px-6 pt-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Welcome to Paw Relief!
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        Thank you for joining our community of pet owners dedicated to managing their furry friends' allergies. We're excited to help you keep your dog healthy and happy.
                    </p>
                </div>

                {/* Dog Illustration */}
                <div className="w-full bg-orange-100 dark:bg-orange-200 py-8 flex items-center justify-center">
                    <img
                        src="/assets/Lucy.png"
                        alt="Happy dog"
                        className="w-48 h-48 object-contain"
                    />
                </div>

                {/* Premium Card */}
                <div className="px-6">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            Go Premium
                        </h3>
                        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            $9.99/month
                        </p>
                        <p className="text-cyan-600 dark:text-cyan-400 mb-4">
                            Unlock advanced features and personalized support
                        </p>
                        <button
                            onClick={() => navigate('/subscription')}
                            className="bg-cyan-400 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded-xl transition-colors"
                        >
                            Subscribe
                        </button>
                    </div>
                </div>

                {/* Continue Button */}
                <div className="px-6 pb-6">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-bold py-4 rounded-xl transition-colors"
                    >
                        Continue to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Welcome;
