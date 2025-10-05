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
        <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 p-4 flex items-center border-b border-gray-200 dark:border-gray-700">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2">
                    <svg className="w-6 h-6 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="flex-1 text-lg font-bold text-gray-900 dark:text-white text-center pr-10">
                    Subscription
                </h1>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                {/* Title Section */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                        Unlock Premium Features
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                        Upgrade to premium for advanced allergy management tools and personalized insights.
                    </p>
                </div>

                {/* Feature Comparison */}
                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                        Feature Comparison
                    </h3>

                    <div className="space-y-3">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="flex justify-between items-start"
                            >
                                <div className="flex-1">
                                    <div className="text-sm text-cyan-500 dark:text-cyan-400 font-medium">
                                        {feature.name}
                                    </div>
                                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                                        {feature.tier}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pricing */}
                <div className="pt-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                        Pricing
                    </h3>

                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                            Premium
                        </h4>
                        <div className="mb-6">
                            <span className="text-4xl font-bold text-gray-900 dark:text-white">$9.99</span>
                            <span className="text-base text-gray-600 dark:text-gray-400"> /month</span>
                        </div>

                        <button
                            onClick={() => {
                                alert('Premium subscription feature coming soon!');
                                navigate('/dashboard');
                            }}
                            className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold py-3 rounded-xl transition-colors"
                        >
                            Subscribe Now
                        </button>
                    </div>
                </div>

                {/* Skip Button */}
                <div className="pt-2 pb-8">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="w-full text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium py-2 transition-colors text-sm"
                    >
                        Maybe Later
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Subscription;
