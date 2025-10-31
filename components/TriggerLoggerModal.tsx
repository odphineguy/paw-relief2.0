import React, { useState } from 'react';
import { useDogs } from '../context/DogContext';
import { TriggerType } from '../types';
import { addTriggerLog } from '../services/api';
import { XIcon } from './icons';

interface TriggerLoggerModalProps {
    isOpen: boolean;
    onClose: () => void;
    triggerType: TriggerType;
    triggerTitle: string;
}

const TriggerLoggerModal: React.FC<TriggerLoggerModalProps> = ({ isOpen, onClose, triggerType, triggerTitle }) => {
    const { selectedDog } = useDogs();
    const [notes, setNotes] = useState('');
    const [location, setLocation] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDog) {
            alert('Please select a dog');
            return;
        }

        setIsSubmitting(true);
        try {
            await addTriggerLog({
                dogId: selectedDog.id,
                triggerType,
                details: {},
                location: location || undefined,
                notes,
                loggedDate: new Date().toISOString(),
            });

            // Reset form
            setNotes('');
            setLocation('');
            onClose();

            // Reload the page to refresh the charts
            window.location.reload();
        } catch (error) {
            console.error("Failed to log trigger", error);
            alert("Couldn't save the trigger log. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
            <div className="bg-white dark:bg-gray-900 rounded-t-3xl w-full max-w-md h-[60vh] flex flex-col">
                {/* Header */}
                <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <XIcon />
                    </button>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center flex-1">Log {triggerTitle}</h2>
                    <div className="w-6"></div> {/* Spacer for centering */}
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Location (optional for most triggers) */}
                    {(triggerType === TriggerType.WALK_LOCATION || triggerType === TriggerType.ENVIRONMENTAL_CHANGE) && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                Location {triggerType === TriggerType.WALK_LOCATION ? '(Required)' : '(Optional)'}
                            </label>
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="e.g., City Park, Backyard"
                                required={triggerType === TriggerType.WALK_LOCATION}
                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    )}

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                            Notes (Optional)
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add any additional details..."
                            rows={4}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        />
                    </div>

                    {/* Info text based on trigger type */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            {triggerType === TriggerType.FOOD && "Record what food your dog ate that may have triggered symptoms."}
                            {triggerType === TriggerType.WALK_LOCATION && "Note where you walked your dog to track location-based patterns."}
                            {triggerType === TriggerType.WEATHER && "Log current weather conditions that may affect your dog."}
                            {triggerType === TriggerType.POLLEN && "Track pollen exposure to identify seasonal patterns."}
                            {triggerType === TriggerType.HOUSEHOLD_PRODUCT && "Record household products used near your dog."}
                            {triggerType === TriggerType.ENVIRONMENTAL_CHANGE && "Note any environmental changes in your home or area."}
                        </p>
                    </div>

                    {/* Save Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-blue-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Saving...' : 'Save Trigger Log'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TriggerLoggerModal;
