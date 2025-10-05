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

                {/* Subscription Comparison */}
                <div className="px-6">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                            Choose Your Plan
                        </h3>

                        {/* Feature Comparison Table */}
                        <div className="space-y-4 mb-6">
                            <div className="grid grid-cols-3 gap-2 text-sm font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                                <div>Feature</div>
                                <div className="text-center">Basic</div>
                                <div className="text-center">Premium</div>
                            </div>

                            <div className="grid grid-cols-3 gap-2 text-sm text-gray-600 dark:text-gray-300">
                                <div>Symptom Tracking</div>
                                <div className="text-center">✓</div>
                                <div className="text-center">✓</div>
                            </div>

                            <div className="grid grid-cols-3 gap-2 text-sm text-gray-600 dark:text-gray-300">
                                <div>Trigger Analysis</div>
                                <div className="text-center">Basic</div>
                                <div className="text-center font-semibold text-cyan-600 dark:text-cyan-400">Advanced</div>
                            </div>

                            <div className="grid grid-cols-3 gap-2 text-sm text-gray-600 dark:text-gray-300">
                                <div>Medication Reminders</div>
                                <div className="text-center">Basic</div>
                                <div className="text-center font-semibold text-cyan-600 dark:text-cyan-400">Advanced</div>
                            </div>

                            <div className="grid grid-cols-3 gap-2 text-sm text-gray-600 dark:text-gray-300">
                                <div>Vet Report Generation</div>
                                <div className="text-center">Basic</div>
                                <div className="text-center font-semibold text-cyan-600 dark:text-cyan-400">Premium</div>
                            </div>

                            <div className="grid grid-cols-3 gap-2 text-sm text-gray-600 dark:text-gray-300">
                                <div>Priority Support</div>
                                <div className="text-center">Basic</div>
                                <div className="text-center font-semibold text-cyan-600 dark:text-cyan-400">Priority</div>
                            </div>

                            <div className="grid grid-cols-3 gap-2 text-sm text-gray-600 dark:text-gray-300">
                                <div>Unlimited Symptom Tracking</div>
                                <div className="text-center">-</div>
                                <div className="text-center font-semibold text-cyan-600 dark:text-cyan-400">✓</div>
                            </div>

                            <div className="grid grid-cols-3 gap-2 text-sm text-gray-600 dark:text-gray-300">
                                <div>Advanced Analytics</div>
                                <div className="text-center">-</div>
                                <div className="text-center font-semibold text-cyan-600 dark:text-cyan-400">✓</div>
                            </div>
                        </div>

                        {/* Pricing Section */}
                        <div className="text-center">
                            <div className="mb-4">
                                <span className="text-3xl font-bold text-gray-900 dark:text-white">$9.99</span>
                                <span className="text-base text-gray-600 dark:text-gray-400">/month</span>
                            </div>
                            <button
                                onClick={() => {
                                    alert('Premium subscription feature coming soon!');
                                    navigate('/dashboard');
                                }}
                                className="bg-cyan-400 hover:bg-cyan-500 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-sm"
                            >
                                Subscribe Now
                            </button>
                        </div>
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
