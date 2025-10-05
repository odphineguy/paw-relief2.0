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
        <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-800">
            {/* Content Box */}
            <div className="bg-white dark:bg-gray-900 rounded-t-3xl mt-8 flex-1 flex flex-col">
                {/* Header with Back Arrow */}
                <div className="p-4 flex items-center">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2">
                        <svg className="w-6 h-6 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="text-lg font-bold text-gray-900 dark:text-white ml-2">
                        Subscription
                    </h1>
                </div>

                {/* Content */}
                <div className="flex-1 px-6 pb-6 space-y-6 overflow-y-auto">
                    {/* Unlock Premium Features Section */}
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            Unlock Premium Features
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            Upgrade to premium for advanced allergy management tools and personalized insights.
                        </p>
                    </div>

                    {/* Feature Comparison Section */}
                    <div>
                        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">
                            Feature Comparison
                        </h3>

                        {/* Two-column grid */}
                        <div className="grid grid-cols-2 gap-4">
                            {features.map((feature, index) => (
                                <div key={index}>
                                    <div className="text-sm text-teal-600 dark:text-teal-400 font-medium">
                                        {feature.name}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                        {feature.tier}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pricing Section */}
                    <div>
                        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">
                            Pricing
                        </h3>

                        {/* Pricing Card */}
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6">
                            <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                                Premium
                            </div>
                            <div className="mb-6">
                                <span className="text-3xl font-bold text-gray-900 dark:text-white">$9.99</span>
                                <span className="text-base text-gray-600 dark:text-gray-400">/month</span>
                            </div>

                            <button
                                onClick={() => {
                                    alert('Premium subscription feature coming soon!');
                                    navigate('/dashboard');
                                }}
                                className="w-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold py-3 rounded-lg transition-colors hover:bg-gray-300 dark:hover:bg-gray-600"
                            >
                                Subscribe Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Subscription;
