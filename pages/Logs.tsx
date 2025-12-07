import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDogs } from '../context/DogContext';
import Header from '../components/Header';
import { SymptomLog } from '../types';
import { getSymptomLogs, deleteSymptomLog } from '../services/api';
import { format } from 'date-fns';
import { PawIcon, PawPrintIcon, EarIcon, ScanEyeIcon, ToiletIcon, AlertTriangleIcon, FlameIcon, TrashIcon } from '../components/icons';
import { SymptomType } from '../types';

// Function to get icon for each symptom type
const getSymptomIcon = (symptom: SymptomType) => {
    switch (symptom) {
        case SymptomType.EAR_INFECTIONS:
            return <EarIcon className="w-5 h-5" />;
        case SymptomType.WATERY_EYES:
            return <ScanEyeIcon className="w-5 h-5" />;
        case SymptomType.DIGESTIVE_ISSUES:
            return <ToiletIcon className="w-5 h-5" />;
        case SymptomType.PAW_LICKING:
            return <PawPrintIcon className="w-5 h-5" />;
        case SymptomType.HOT_SPOTS:
            return <FlameIcon className="w-5 h-5" />;
        case SymptomType.EXCESSIVE_SCRATCHING:
        case SymptomType.RED_IRRITATED_SKIN:
        case SymptomType.SNEEZING:
        default:
            return <AlertTriangleIcon className="w-5 h-5" />;
    }
};

const LOGS_PER_PAGE = 10;

const Logs: React.FC = () => {
    const { selectedDog } = useDogs();
    const navigate = useNavigate();
    const [logs, setLogs] = useState<SymptomLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedLog, setExpandedLog] = useState<string | null>(null);
    const [visibleCount, setVisibleCount] = useState(LOGS_PER_PAGE);
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const [clearing, setClearing] = useState(false);

    useEffect(() => {
        if (selectedDog) {
            fetchLogs();
        }
    }, [selectedDog]);

    const fetchLogs = async () => {
        if (!selectedDog) return;
        setLoading(true);
        try {
            const data = await getSymptomLogs(selectedDog.id);
            setLogs(data);
        } catch (err) {
            console.error("Failed to fetch logs", err);
        } finally {
            setLoading(false);
        }
    };

    const handleClearAll = async () => {
        if (!selectedDog) return;
        setClearing(true);
        try {
            // Delete all logs for this dog
            await Promise.all(logs.map(log => deleteSymptomLog(log.id)));
            setLogs([]);
            setShowClearConfirm(false);
        } catch (err) {
            console.error("Failed to clear logs", err);
        } finally {
            setClearing(false);
        }
    };

    const handleDeleteLog = async (logId: string) => {
        try {
            await deleteSymptomLog(logId);
            setLogs(logs.filter(l => l.id !== logId));
        } catch (err) {
            console.error("Failed to delete log", err);
        }
    };

    const getSeverityColor = (severity: number) => {
        switch (severity) {
            case 1: return 'bg-green-500';
            case 2: return 'bg-lime-500';
            case 3: return 'bg-yellow-500';
            case 4: return 'bg-orange-500';
            case 5: return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    const getSeverityBadge = (severity: number) => {
        switch (severity) {
            case 1: return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
            case 2: return 'bg-lime-100 text-lime-800 dark:bg-lime-900/50 dark:text-lime-300';
            case 3: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
            case 4: return 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300';
            case 5: return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300';
        }
    };

    const visibleLogs = logs.slice(0, visibleCount);
    const hasMore = visibleCount < logs.length;

    return (
        <div className="flex flex-col h-full bg-background-light dark:bg-background-dark">
            <Header title="" showBackButton={false} />
            {loading ? (
                <div className="flex justify-center items-center h-64"><PawIcon className="w-10 h-10 animate-spin text-primary" /></div>
            ) : selectedDog ? (
                <div className="flex-1 overflow-y-auto pb-24">
                    {/* Hero card */}
                    <div className="px-4 pt-3 pb-4">
                        <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 shadow-sm">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-sm text-white/80">Tracking for</p>
                                    <h2 className="text-xl font-semibold">{selectedDog.name}</h2>
                                    <p className="text-white/80 text-sm">{logs.length} symptom{logs.length !== 1 ? 's' : ''}</p>
                                </div>
                                <button
                                    onClick={() => navigate('/log-entry')}
                                    className="px-4 py-2 bg-white/15 hover:bg-white/25 rounded-lg text-sm font-semibold transition-colors"
                                >
                                    Log Symptom
                                </button>
                            </div>
                        </div>
                    </div>

                    {logs.length > 0 ? (
                        <>
                            {/* Header with count and clear button */}
                            <div className="px-4 py-3 flex justify-between items-center sticky top-0 bg-background-light dark:bg-background-dark z-10">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {logs.length} symptom{logs.length !== 1 ? 's' : ''} logged
                                </p>
                                <button
                                    onClick={() => setShowClearConfirm(true)}
                                    className="text-sm text-red-500 hover:text-red-600 font-medium"
                                >
                                    Clear All
                                </button>
                            </div>

                            {/* Compact log list */}
                            <div className="px-4 space-y-2">
                                {visibleLogs.map(log => {
                                    const isExpanded = expandedLog === log.id;
                                    return (
                                        <div 
                                            key={log.id} 
                                            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
                                        >
                                            {/* Compact row - always visible */}
                                            <button
                                                onClick={() => setExpandedLog(isExpanded ? null : log.id)}
                                                className="w-full p-3 flex items-center gap-3 text-left"
                                            >
                                                {/* Icon */}
                                                <div className="flex-shrink-0 w-10 h-10 bg-blue-500 dark:bg-blue-600 rounded-lg flex items-center justify-center text-white">
                                                    {getSymptomIcon(log.symptomType)}
                                                </div>
                                                
                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                                                            {log.symptomType}
                                                        </h3>
                                                        {/* Severity dots */}
                                                        <div className="flex gap-0.5">
                                                            {[1,2,3,4,5].map(i => (
                                                                <div 
                                                                    key={i}
                                                                    className={`w-1.5 h-1.5 rounded-full ${i <= log.severity ? getSeverityColor(log.severity) : 'bg-gray-200 dark:bg-gray-600'}`}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {format(new Date(log.createdAt), 'MMM d, h:mm a')}
                                                    </p>
                                                </div>

                                                {/* Expand indicator */}
                                                <svg 
                                                    className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                                    fill="none" 
                                                    stroke="currentColor" 
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>

                                            {/* Expanded details */}
                                            {isExpanded && (
                                                <div className="px-3 pb-3 pt-0 border-t border-gray-100 dark:border-gray-700">
                                                    <div className="pt-3 space-y-3">
                                                        {/* Severity badge */}
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs text-gray-500 dark:text-gray-400">Severity:</span>
                                                            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getSeverityBadge(log.severity)}`}>
                                                                {log.severity}/5
                                                            </span>
                                                        </div>

                                                        {/* Notes */}
                                                        {log.notes && (
                                                            <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                                                <p className="text-gray-700 dark:text-gray-300 text-sm">{log.notes}</p>
                                                            </div>
                                                        )}

                                                        {/* Triggers */}
                                                        {log.triggers.length > 0 && (
                                                            <div className="flex flex-wrap gap-1">
                                                                {log.triggers.map(trigger => (
                                                                    <span key={trigger} className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                                                                        {trigger}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}

                                                        {/* Photo */}
                                                        {log.photoUrl && (
                                                            <img 
                                                                src={log.photoUrl} 
                                                                alt="Symptom" 
                                                                className="w-full h-32 object-cover rounded-lg"
                                                            />
                                                        )}

                                                        {/* Delete button */}
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteLog(log.id);
                                                            }}
                                                            className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600"
                                                        >
                                                            <TrashIcon className="w-4 h-4" />
                                                            Delete this log
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Load more button */}
                            {hasMore && (
                                <div className="p-4">
                                    <button
                                        onClick={() => setVisibleCount(prev => prev + LOGS_PER_PAGE)}
                                        className="w-full py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        Load More ({logs.length - visibleCount} remaining)
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-16">
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 mx-4">
                                <PawIcon className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No symptoms logged yet</h3>
                                <p className="text-gray-500 dark:text-gray-400">Start tracking {selectedDog.name}'s symptoms to monitor their health.</p>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center p-8">
                    <div className="text-center space-y-3">
                        <PawIcon className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No dog selected</h3>
                        <p className="text-gray-500 dark:text-gray-400">Add a pet to start tracking symptoms.</p>
                        <button
                            onClick={() => navigate('/create-dog-profile')}
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                        >
                            Add Pet
                        </button>
                    </div>
                </div>
            )}

            {/* Clear confirmation modal */}
            {showClearConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Clear All Logs?</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            This will permanently delete all {logs.length} symptom logs for {selectedDog?.name}. This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowClearConfirm(false)}
                                className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium"
                                disabled={clearing}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleClearAll}
                                className="flex-1 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 disabled:opacity-50"
                                disabled={clearing}
                            >
                                {clearing ? 'Clearing...' : 'Clear All'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Logs;