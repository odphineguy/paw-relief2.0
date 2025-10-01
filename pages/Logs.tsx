import React, { useEffect, useState } from 'react';
import { useDogs } from '../context/DogContext';
import Header from '../components/Header';
import { SymptomLog } from '../types';
import { getSymptomLogs } from '../services/api';
import { format } from 'date-fns';
import { PawIcon } from '../components/icons';

const Logs: React.FC = () => {
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

    const getSeverityColor = (severity: number) => {
        switch (severity) {
            case 1:
                return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
            case 2:
                return 'bg-lime-100 text-lime-800 dark:bg-lime-900/50 dark:text-lime-300';
            case 3:
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
            case 4:
                return 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300';
            case 5:
                return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300';
        }
    };

    return (
        <div className="flex flex-col h-full">
            <Header title="" showBackButton={false} />
            {loading ? (
                <div className="flex justify-center items-center h-64"><PawIcon className="w-10 h-10 animate-spin text-primary" /></div>
            ) : selectedDog ? (
                <div className="p-4 space-y-4">
                    {logs.length > 0 ? (
                        logs.map(log => (
                            <div key={log.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">{log.symptomType}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {format(new Date(log.createdAt), 'MMM d, yyyy')} at {format(new Date(log.createdAt), 'h:mm a')}
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getSeverityColor(log.severity)}`}>
                                        {log.severity}/5
                                    </span>
                                </div>
                                
                                {log.notes && (
                                    <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{log.notes}</p>
                                    </div>
                                )}
                                
                                {log.triggers.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {log.triggers.map(trigger => (
                                            <span key={trigger} className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full font-medium">
                                                {trigger}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                
                                {log.photoUrl && (
                                    <div className="mt-3">
                                        <img 
                                            src={log.photoUrl} 
                                            alt="Symptom photo" 
                                            className="w-full h-32 object-cover rounded-lg"
                                        />
                                    </div>
                                )}
                            </div>
                        ))
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
                    <div className="text-center">
                        <PawIcon className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No dog selected</h3>
                        <p className="text-gray-500 dark:text-gray-400">Please select a dog to view their symptom logs.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Logs;