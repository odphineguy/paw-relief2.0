import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDogs } from '../context/DogContext';
import { getSymptomLogs } from '../services/api';
import { SymptomLog, TriggerType, SymptomType } from '../types';
import Header from '../components/Header';
import { ChevronRightIcon } from '../components/icons';

const TriggerAnalysis: React.FC = () => {
    const navigate = useNavigate();
    const { selectedDog } = useDogs();
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

    // Calculate trigger patterns
    const triggerCounts = logs.reduce((acc, log) => {
        log.triggers.forEach(trigger => {
            acc[trigger] = (acc[trigger] || 0) + 1;
        });
        return acc;
    }, {} as Record<TriggerType, number>);

    // Calculate trigger-symptom correlations
    const triggerSymptomCorrelations = logs.reduce((acc, log) => {
        log.triggers.forEach(trigger => {
            if (!acc[trigger]) {
                acc[trigger] = {};
            }
            if (!acc[trigger][log.symptomType]) {
                acc[trigger][log.symptomType] = 0;
            }
            acc[trigger][log.symptomType]++;
        });
        return acc;
    }, {} as Record<TriggerType, Record<SymptomType, number>>);

    // Sort triggers by frequency
    const sortedTriggers = Object.entries(triggerCounts)
        .sort(([, a], [, b]) => b - a)
        .map(([trigger, count]) => ({
            trigger: trigger as TriggerType,
            count,
            symptoms: triggerSymptomCorrelations[trigger as TriggerType] || {}
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

                            {sortedTriggers.map(({ trigger, count, symptoms }) => {
                                const percentage = ((count / totalTriggers) * 100).toFixed(1);
                                const topSymptoms = Object.entries(symptoms)
                                    .sort(([, a], [, b]) => b - a)
                                    .slice(0, 3);

                                return (
                                    <div
                                        key={trigger}
                                        className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                    {trigger}
                                                </h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {count} occurrence{count !== 1 ? 's' : ''} ({percentage}%)
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                                    {count}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Progress bar */}
                                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-3">
                                            <div
                                                className="h-full bg-blue-500 rounded-full transition-all"
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>

                                        {/* Associated Symptoms */}
                                        {topSymptoms.length > 0 && (
                                            <div>
                                                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                                                    Most Common Symptoms:
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {topSymptoms.map(([symptom, symptomCount]) => (
                                                        <span
                                                            key={symptom}
                                                            className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium"
                                                        >
                                                            {symptom} ({symptomCount})
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
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
