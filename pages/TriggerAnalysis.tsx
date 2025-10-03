import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDogs } from '../context/DogContext';
import { getTriggerLogs } from '../services/api';
import { TriggerLog, TriggerType } from '../types';
import Header from '../components/Header';
import { ChevronRightIcon } from '../components/icons';

const TriggerAnalysis: React.FC = () => {
    const navigate = useNavigate();
    const { selectedDog } = useDogs();
    const [logs, setLogs] = useState<TriggerLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (selectedDog) {
            setLoading(true);
            getTriggerLogs(selectedDog.id)
                .then(setLogs)
                .catch(err => console.error("Failed to fetch logs", err))
                .finally(() => setLoading(false));
        }
    }, [selectedDog]);

    // Calculate trigger patterns
    const triggerCounts = logs.reduce((acc, log) => {
        acc[log.triggerType] = (acc[log.triggerType] || 0) + 1;
        return acc;
    }, {} as Record<TriggerType, number>);

    // Sort triggers by frequency
    const sortedTriggers = Object.entries(triggerCounts)
        .sort(([, a], [, b]) => b - a)
        .map(([trigger, count]) => ({
            trigger: trigger as TriggerType,
            count,
        }));

    const totalTriggers = Object.values(triggerCounts).reduce((sum, count) => sum + count, 0);

    return (
        <div className="flex flex-col h-full bg-background-light dark:bg-background-dark">
            <Header title="" showBackButton={false} />

            <div className="flex-1 p-4 space-y-6 overflow-y-auto">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl text-foreground-light dark:text-foreground-dark">Trigger Analysis</h1>
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-full hover:bg-card-light dark:hover:bg-card-dark transition-colors"
                    >
                        <ChevronRightIcon className="w-6 h-6 text-foreground-light dark:text-foreground-dark"/>
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <p className="text-gray-500 dark:text-gray-400">Loading analysis...</p>
                    </div>
                ) : totalTriggers === 0 ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="text-center">
                            <p className="text-gray-500 dark:text-gray-400">No trigger data available yet.</p>
                            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                                Log symptoms with triggers to see detailed analysis.
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Summary Card */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Summary</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Triggers</p>
                                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{totalTriggers}</p>
                                </div>
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Unique Types</p>
                                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                        {Object.keys(triggerCounts).length}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Trigger Breakdown */}
                        <div className="space-y-4">
                            <h2 className="text-xl text-foreground-light dark:text-foreground-dark">Trigger Breakdown</h2>

                            {sortedTriggers.map(({ trigger, count }, index) => {
                                const percentage = ((count / totalTriggers) * 100).toFixed(1);

                                // Color scheme for different triggers
                                const colors = [
                                    { bg: 'bg-blue-500', text: 'text-blue-600 dark:text-blue-400', light: 'bg-blue-50 dark:bg-blue-900/20' },
                                    { bg: 'bg-green-500', text: 'text-green-600 dark:text-green-400', light: 'bg-green-50 dark:bg-green-900/20' },
                                    { bg: 'bg-purple-500', text: 'text-purple-600 dark:text-purple-400', light: 'bg-purple-50 dark:bg-purple-900/20' },
                                    { bg: 'bg-orange-500', text: 'text-orange-600 dark:text-orange-400', light: 'bg-orange-50 dark:bg-orange-900/20' },
                                    { bg: 'bg-pink-500', text: 'text-pink-600 dark:text-pink-400', light: 'bg-pink-50 dark:bg-pink-900/20' },
                                ];
                                const color = colors[index % colors.length];

                                return (
                                    <div
                                        key={trigger}
                                        className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                    {trigger}
                                                </h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {count} occurrence{count !== 1 ? 's' : ''}
                                                </p>
                                            </div>
                                            <div className={`px-4 py-2 ${color.light} rounded-lg text-right`}>
                                                <div className={`text-2xl font-bold ${color.text}`}>
                                                    {percentage}%
                                                </div>
                                            </div>
                                        </div>

                                        {/* Colorful progress bar */}
                                        <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full mb-3 overflow-hidden">
                                            <div
                                                className={`h-full ${color.bg} rounded-full transition-all`}
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Insights */}
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">💡 Key Insights</h2>
                            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                                {sortedTriggers.length > 0 && (
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>
                                            <strong>{sortedTriggers[0].trigger}</strong> is your dog's most common trigger
                                            with {sortedTriggers[0].count} recorded instances.
                                        </span>
                                    </li>
                                )}
                                {sortedTriggers.length >= 2 && (
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>
                                            Focus on managing <strong>{sortedTriggers[0].trigger}</strong> and{' '}
                                            <strong>{sortedTriggers[1].trigger}</strong> to reduce symptoms.
                                        </span>
                                    </li>
                                )}
                                <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>
                                        Continue logging symptoms with triggers to improve pattern detection.
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default TriggerAnalysis;
