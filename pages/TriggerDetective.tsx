import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { ArrowLeftIcon } from '../components/icons';

const TriggerDetective: React.FC = () => {
    const navigate = useNavigate();
    const [selectedTrigger, setSelectedTrigger] = useState<string | null>(null);

    const triggerTypes = [
        {
            id: 'food',
            title: 'Food Eaten',
            description: 'Record what your dog ate today',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
            )
        },
        {
            id: 'location',
            title: 'Walking Locations',
            description: 'Note where you walked your dog',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            )
        },
        {
            id: 'weather',
            title: 'Weather Conditions',
            description: 'Track weather conditions during walks',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            )
        },
        {
            id: 'pollen',
            title: 'Pollen Levels',
            description: 'Monitor pollen levels in your area',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            )
        },
        {
            id: 'products',
            title: 'Household Products',
            description: 'List household products used',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
            )
        },
        {
            id: 'environment',
            title: 'Environmental Changes',
            description: 'Document environmental changes',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            )
        }
    ];

    const handleTriggerSelect = (triggerId: string) => {
        setSelectedTrigger(triggerId);
        // Here you would navigate to a specific trigger logging page
        // For now, we'll just show an alert
        alert(`Logging ${triggerTypes.find(t => t.id === triggerId)?.title} trigger`);
    };

    return (
        <div className="flex flex-col h-full bg-background-light dark:bg-background-dark">
            <Header title="Trigger Detective" showBackButton={true} />

            <div className="flex-1 p-4 space-y-8 overflow-y-auto">
                {/* Log New Trigger Section */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-foreground-light dark:text-foreground-dark">Log New Trigger</h2>
                    
                    <div className="space-y-3">
                        {triggerTypes.map((trigger) => (
                            <div
                                key={trigger.id}
                                onClick={() => handleTriggerSelect(trigger.id)}
                                className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center space-x-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
                                    {trigger.icon}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 dark:text-white">{trigger.title}</h3>
                                    <p className="text-sm text-blue-600 dark:text-blue-400">{trigger.description}</p>
                                </div>
                                <div className="flex-shrink-0">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Identified Patterns Section */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-foreground-light dark:text-foreground-dark">Identified Patterns</h2>
                    
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Trigger vs. Symptoms</h3>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-2">
                                    <span className="text-2xl font-bold text-gray-900 dark:text-white">High</span>
                                    <span className="text-lg font-semibold text-green-600">+15%</span>
                                </div>
                                <span className="text-sm text-gray-500 dark:text-gray-400">Last 30 Days</span>
                            </div>
                        </div>

                        {/* Mock Chart */}
                        <div className="mb-6">
                            <div className="h-32 bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex items-end justify-between space-x-2">
                                {/* Chart bars */}
                                <div className="flex-1 flex flex-col items-center space-y-2">
                                    <div className="w-full bg-blue-500 rounded-t" style={{ height: '60%' }}></div>
                                    <span className="text-xs text-gray-600 dark:text-gray-400">FOOD</span>
                                </div>
                                <div className="flex-1 flex flex-col items-center space-y-2">
                                    <div className="w-full bg-blue-500 rounded-t" style={{ height: '80%' }}></div>
                                    <span className="text-xs text-gray-600 dark:text-gray-400">LOCATION</span>
                                </div>
                                <div className="flex-1 flex flex-col items-center space-y-2">
                                    <div className="w-full bg-blue-500 rounded-t" style={{ height: '40%' }}></div>
                                    <span className="text-xs text-gray-600 dark:text-gray-400">WEATHER</span>
                                </div>
                                <div className="flex-1 flex flex-col items-center space-y-2">
                                    <div className="w-full bg-blue-500 rounded-t" style={{ height: '90%' }}></div>
                                    <span className="text-xs text-gray-600 dark:text-gray-400">POLLEN</span>
                                </div>
                                <div className="flex-1 flex flex-col items-center space-y-2">
                                    <div className="w-full bg-blue-500 rounded-t" style={{ height: '30%' }}></div>
                                    <span className="text-xs text-gray-600 dark:text-gray-400">PRODUCTS</span>
                                </div>
                            </div>
                        </div>

                        <button className="w-full bg-primary text-white font-semibold py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors">
                            View Detailed Analysis
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TriggerDetective;
