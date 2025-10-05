import React from 'react';
import { useNavigate } from 'react-router-dom';

const Subscription: React.FC = () => {
    const navigate = useNavigate();

    const features = [
        { name: 'Symptom Tracking', basic: true, premium: false },
        { name: 'Trigger Analysis', basic: true, premium: false },
        { name: 'Medication Reminders', basic: true, premium: true },
        { name: 'Vet Report Generation', basic: true, premium: true },
        { name: 'Priority Support', basic: true, premium: true },
        { name: 'Unlimited Symptom Tracking', basic: false, premium: true },
        { name: 'Advanced Trigger Analysis', basic: false, premium: true },
        { name: 'Medication Reminders', basic: false, premium: true },
        { name: 'Vet Report Generation', basic: false, premium: true },
        { name: 'Priority Support', basic: false, premium: true }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 p-4 flex items-center shadow-sm">
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
            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Unlock Premium Features
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Upgrade to premium for advanced allergy management tools and personalized insights.
                    </p>
                </div>

                {/* Feature Comparison */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                        Feature Comparison
                    </h3>

                    <div className="grid grid-cols-2 gap-3">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                            >
                                <div className="text-sm text-cyan-600 dark:text-cyan-400 font-medium mb-1">
                                    {feature.name}
                                </div>
                                <div className="text-xs font-medium text-gray-900 dark:text-white">
                                    {feature.premium ? 'Premium' : 'Basic'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pricing */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        Pricing
                    </h3>

                    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 text-center">
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            Premium
                        </h4>
                        <div className="mb-6">
                            <span className="text-4xl font-bold text-gray-900 dark:text-white">$9.99</span>
                            <span className="text-lg text-gray-600 dark:text-gray-400">/month</span>
                        </div>

                        <button
                            onClick={() => {
                                alert('Premium subscription feature coming soon!');
                                navigate('/dashboard');
                            }}
                            className="w-full bg-gray-800 dark:bg-gray-600 hover:bg-gray-900 dark:hover:bg-gray-500 text-white font-semibold py-3 rounded-lg transition-colors"
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
