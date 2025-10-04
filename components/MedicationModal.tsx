import React, { useState } from 'react';
import { useDogs } from '../context/DogContext';
import { ReminderType } from '../types';
import { addReminder } from '../services/api';
import { XIcon, PillBottleIcon, SyringeIcon, EarIcon, BowlIcon, CalendarIcon } from './icons';

interface MedicationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const MedicationModal: React.FC<MedicationModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const { selectedDog } = useDogs();
    const [selectedType, setSelectedType] = useState<ReminderType>(ReminderType.MEDICATION);
    const [name, setName] = useState('');
    const [dosage, setDosage] = useState('');
    const [nextDue, setNextDue] = useState('');
    const [repeatInterval, setRepeatInterval] = useState<'daily' | 'weekly' | 'monthly' | null>('daily');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const medicationTypes = [
        { type: ReminderType.MEDICATION, icon: PillBottleIcon, label: 'Medication' },
        { type: ReminderType.TOPICAL_TREATMENT, icon: SyringeIcon, label: 'Topical Treatment' },
        { type: ReminderType.EAR_CLEANING, icon: EarIcon, label: 'Ear Cleaning' },
        { type: ReminderType.PAW_WIPES, icon: BowlIcon, label: 'Paw Wipes' },
        { type: ReminderType.VET_VISIT, icon: CalendarIcon, label: 'Vet Visit' },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDog || !name || !nextDue) {
            alert('Please fill in all required fields.');
            return;
        }

        setIsSubmitting(true);
        try {
            await addReminder({
                dogId: selectedDog.id,
                type: selectedType,
                name,
                dosage,
                nextDue: new Date(nextDue).toISOString(),
                repeatInterval,
                completed: false,
            });

            // Reset form
            setName('');
            setDosage('');
            setNextDue('');
            setRepeatInterval('daily');
            setSelectedType(ReminderType.MEDICATION);

            onSuccess();
            onClose();
        } catch (error) {
            console.error("Failed to add medication", error);
            alert("Couldn't save the medication. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
            <div className="bg-white dark:bg-gray-900 rounded-t-3xl w-full max-w-md h-[90vh] flex flex-col">
                {/* Header */}
                <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <XIcon />
                    </button>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center flex-1">New Medication</h2>
                    <div className="w-6"></div> {/* Spacer for centering */}
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Type Selection */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Type</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {medicationTypes.map(({ type, icon: Icon, label }) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setSelectedType(type)}
                                    className={`flex items-center gap-2 p-3 rounded-xl transition-colors ${
                                        selectedType === type
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    <div className={`flex-shrink-0 ${selectedType === type ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <span className="font-medium text-sm truncate">{label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Name Field */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                            Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Apoquel, Cytopoint"
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    {/* Dosage Field */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                            Dosage
                        </label>
                        <input
                            type="text"
                            value={dosage}
                            onChange={(e) => setDosage(e.target.value)}
                            placeholder="e.g., 20mg, Once Daily"
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Next Due Date */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                            Next Due <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="datetime-local"
                            value={nextDue}
                            onChange={(e) => setNextDue(e.target.value)}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    {/* Repeat Interval */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                            Repeat
                        </label>
                        <select
                            value={repeatInterval || ''}
                            onChange={(e) => setRepeatInterval(e.target.value as 'daily' | 'weekly' | 'monthly' | null || null)}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">No Repeat</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                        </select>
                    </div>

                    {/* Save Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting || !name || !nextDue}
                            className="w-full bg-blue-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Saving...' : 'Save Medication'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MedicationModal;
