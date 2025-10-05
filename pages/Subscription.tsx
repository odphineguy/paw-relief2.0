import React from 'react';
import { useNavigate } from 'react-router-dom';

const Subscription: React.FC = () => {
    const navigate = useNavigate();

    const features = [
        { name: 'Symptom Tracking', tier: 'Basic' },
        { name: 'Trigger Analysis', tier: 'Basic' },
        { name: 'Medication Reminders', tier: 'Basic' },
        { name: 'Vet Report Generation', tier: 'Basic' },
        { name: 'Priority Support', tier: 'Basic' },
        { name: 'Unlimited Symptom Tracking', tier: 'Premium' },
        { name: 'Advanced Trigger Analysis', tier: 'Premium' },
        { name: 'Medication Reminders', tier: 'Premium' },
        { name: 'Vet Report Generation', tier: 'Premium' },
        { name: 'Priority Support', tier: 'Premium' }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
                <button onClick={() => navigate(-1)} className="p-2">
                    <svg className="w-6 h-6 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="flex-1 text-lg font-bold text-gray-900 dark:text-white text-center pr-10">
                    Subscription
                </h1>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 space-y-6 overflow-y-auto pb-28">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Unlock Premium Features
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        Upgrade to premium for advanced allergy management tools and personalized insights.
                    </p>
                </div>

                {/* Feature Comparison */}
                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                        Feature Comparison
                    </h3>

                    <div className="grid grid-cols-2 gap-3">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                            >
                                <div className="text-sm text-cyan-600 dark:text-cyan-400 font-medium mb-1">
                                    {feature.name}
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                    {feature.tier}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pricing */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        Pricing
                    </h3>

                    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                        <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Premium
                        </h4>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            $9.99
                            <span className="text-lg font-normal text-gray-600 dark:text-gray-400">/month</span>
                        </p>

                        <button
                            onClick={() => {
                                alert('Premium subscription feature coming soon!');
                                navigate('/dashboard');
                            }}
                            className="w-full bg-cyan-400 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl transition-colors shadow-lg"
                        >
                            Subscribe Now
                        </button>
                    </div>
                </div>

                {/* Skip Button */}
                <button
                    onClick={() => navigate('/dashboard')}
                    className="w-full text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium py-2 transition-colors"
                >
                    Maybe Later
                </button>
            </div>
        </div>
    );
};

export default Subscription;
