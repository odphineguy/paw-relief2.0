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
                        {/* Summary Card - Cleaner Modern Design */}
                        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl shadow-sm">
                            <div className="flex items-baseline gap-2 mb-2">
                                <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                                    {sortedTriggers.length > 0
                                        ? (((sortedTriggers[0].count / totalTriggers) * 100).toFixed(0) + '%')
                                        : 'N/A'}
                                </h2>
                                <span className="text-green-600 dark:text-green-400 text-sm font-medium">
                                    {sortedTriggers.length > 0 ? `${sortedTriggers[0].trigger}` : ''}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                Most Common Trigger • Last 30 Days
                            </p>

                            {/* Trigger Category Pills */}
                            <div className="flex flex-wrap gap-2 mt-4">
                                {sortedTriggers.map(({ trigger }, index) => {
                                    const colors = ['#3b82f6', '#10b981', '#a855f7', '#f97316', '#ec4899', '#06b6d4'];
                                    return (
                                        <span
                                            key={trigger}
                                            className="px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide"
                                            style={{
                                                backgroundColor: colors[index % colors.length] + '20',
                                                color: colors[index % colors.length]
                                            }}
                                        >
                                            {trigger}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Trigger Breakdown - Cleaner Cards */}
                        <div className="space-y-3">
                            <h2 className="text-xl text-foreground-light dark:text-foreground-dark">Breakdown</h2>

                            {sortedTriggers.map(({ trigger, count }, index) => {
                                const percentage = ((count / totalTriggers) * 100).toFixed(1);

                                // Hex colors for consistency
                                const colors = ['#3b82f6', '#10b981', '#a855f7', '#f97316', '#ec4899', '#06b6d4'];
                                const color = colors[index % colors.length];

                                return (
                                    <div
                                        key={trigger}
                                        className="bg-white dark:bg-gray-800/80 p-5 rounded-2xl shadow-sm"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex-1">
                                                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                                                    {trigger}
                                                </h3>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {count} occurrence{count !== 1 ? 's' : ''}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold" style={{ color }}>
                                                    {percentage}%
                                                </div>
                                            </div>
                                        </div>

                                        {/* Softer progress bar */}
                                        <div className="w-full h-2 bg-gray-100 dark:bg-gray-700/50 rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all"
                                                style={{ width: `${percentage}%`, backgroundColor: color }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Insights - Cleaner Design */}
                        <div className="bg-blue-50/50 dark:bg-blue-900/10 p-6 rounded-2xl shadow-sm">
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
