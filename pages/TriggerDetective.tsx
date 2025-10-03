import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDogs } from '../context/DogContext';
import { getSymptomLogs } from '../services/api';
import { SymptomLog, TriggerType } from '../types';
import Header from '../components/Header';
import { ChevronRightIcon } from '../components/icons';

const TriggerDetective: React.FC = () => {
    const navigate = useNavigate();
    const { selectedDog } = useDogs();
    const [selectedTrigger, setSelectedTrigger] = useState<string | null>(null);
    const [logs, setLogs] = useState<SymptomLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (selectedDog) {
            setLoading(true);
            getSymptomLogs(selectedDog.id)
                .then(setLogs)
                .catch(err => console.error("Failed to fetch logs", err))
                .finally(() => setLoading(false));
        }
    }, [selectedDog]);

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

    // Calculate trigger patterns from symptom logs
    const triggerCounts = logs.reduce((acc, log) => {
        log.triggers.forEach(trigger => {
            acc[trigger] = (acc[trigger] || 0) + 1;
        });
        return acc;
    }, {} as Record<TriggerType, number>);

    const totalTriggers = Object.values(triggerCounts).reduce((sum, count) => sum + count, 0);

    // Map trigger types to chart data with colors
    const chartData = [
        { label: 'FOOD', count: triggerCounts[TriggerType.FOOD] || 0, color: 'bg-blue-500' },
        { label: 'LOCATION', count: triggerCounts[TriggerType.WALK_LOCATION] || 0, color: 'bg-green-500' },
        { label: 'WEATHER', count: triggerCounts[TriggerType.WEATHER] || 0, color: 'bg-purple-500' },
        { label: 'POLLEN', count: triggerCounts[TriggerType.POLLEN] || 0, color: 'bg-orange-500' },
        { label: 'PRODUCTS', count: triggerCounts[TriggerType.HOUSEHOLD_PRODUCT] || 0, color: 'bg-pink-500' },
    ];

    const maxCount = Math.max(...chartData.map(d => d.count), 1);
    const hasData = totalTriggers > 0;

    return (
        <div className="flex flex-col h-full bg-background-light dark:bg-background-dark">
            <Header title="" showBackButton={false} />

            <div className="flex-1 p-4 space-y-8 overflow-y-auto">
                {/* Log New Trigger Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl text-foreground-light dark:text-foreground-dark">Log New Trigger</h2>
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 rounded-full hover:bg-card-light dark:hover:bg-card-dark transition-colors"
                        >
                            <ChevronRightIcon className="w-6 h-6 text-foreground-light dark:text-foreground-dark"/>
                        </button>
                    </div>
                    
                    <div className="space-y-3">
                        {triggerTypes.map((trigger) => (
                            <div
                                key={trigger.id}
                                onClick={() => handleTriggerSelect(trigger.id)}
                                className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center space-x-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                <div className="flex-shrink-0 w-12 h-12 bg-blue-500 dark:bg-blue-600 rounded-lg flex items-center justify-center text-white">
                                    {trigger.icon}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 dark:text-white">{trigger.title}</h3>
                                    <p className="text-sm text-blue-600 dark:text-blue-400">{trigger.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Identified Patterns Section */}
                <div className="space-y-4">
                    <h2 className="text-xl text-foreground-light dark:text-foreground-dark">Identified Patterns</h2>
                    
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Trigger vs. Symptoms</h3>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-2">
                                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {hasData ? `${totalTriggers} Tracked` : 'No Data'}
                                    </span>
                                </div>
                                <span className="text-sm text-gray-500 dark:text-gray-400">All Time</span>
                            </div>
                        </div>

                        {/* Dynamic Chart */}
                        <div className="mb-6">
                            {hasData ? (
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                    <div className="h-40 flex items-end justify-between gap-3">
                                        {chartData.map((item) => (
                                            <div key={item.label} className="flex-1 flex flex-col items-center gap-2">
                                                <div className="w-full h-full flex flex-col justify-end">
                                                    <div
                                                        className={`w-full ${item.color} rounded-t-lg transition-all`}
                                                        style={{ height: `${Math.max((item.count / maxCount) * 100, item.count > 0 ? 15 : 0)}%` }}
                                                    ></div>
                                                </div>
                                                <div className="text-center mt-2">
                                                    <div className="text-sm font-bold text-gray-900 dark:text-white">{item.count}</div>
                                                    <span className="text-xs text-gray-600 dark:text-gray-400">{item.label}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="h-32 bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex items-center justify-center">
                                    <p className="text-gray-500 dark:text-gray-400 text-center">
                                        No trigger data yet.<br/>
                                        <span className="text-sm">Log symptoms with triggers to see patterns.</span>
                                    </p>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => navigate('/trigger-analysis')}
                            disabled={!hasData}
                            className="w-full bg-primary text-white font-semibold py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            View Detailed Analysis
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TriggerDetective;
