import React, { useState } from 'react';
import { useDogs } from '../context/DogContext';
import { SymptomType, TriggerType } from '../types';
import { ALL_SYMPTOMS, ALL_TRIGGERS } from '../constants';
import { addSymptomLog } from '../services/api';
import { XIcon, EarIcon, ScanEyeIcon, ToiletIcon, PawPrintIcon, AlertTriangleIcon, FlameIcon } from './icons';

interface SymptomLoggerModalProps {
    isOpen: boolean;
    onClose: () => void;
}

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

const SymptomLoggerModal: React.FC<SymptomLoggerModalProps> = ({ isOpen, onClose }) => {
    const { selectedDog } = useDogs();
    const [selectedSymptoms, setSelectedSymptoms] = useState<Set<SymptomType>>(new Set());
    const [notes, setNotes] = useState('');
    const [photos, setPhotos] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSymptomToggle = (symptom: SymptomType) => {
        const newSelection = new Set(selectedSymptoms);
        if (newSelection.has(symptom)) {
            newSelection.delete(symptom);
        } else {
            newSelection.add(symptom);
        }
        setSelectedSymptoms(newSelection);
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newPhotos = Array.from(e.target.files);
            setPhotos(prev => [...prev, ...newPhotos]);
        }
    };

    const removePhoto = (index: number) => {
        setPhotos(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDog || selectedSymptoms.size === 0) {
            alert('Please select at least one symptom.');
            return;
        }
        setIsSubmitting(true);
        try {
            // For now, we'll create one log entry per symptom
            // In a real app, you might want to create multiple entries or a single entry with multiple symptoms
            for (const symptom of selectedSymptoms) {
                let photoUrl: string | undefined = undefined;
                if (photos.length > 0) {
                    photoUrl = `https://picsum.photos/seed/${Date.now()}/400/300`;
                }

                await addSymptomLog({
                    dogId: selectedDog.id,
                    symptomType: symptom,
                    severity: 3, // Default severity
                    triggers: [], // No triggers in the new design
                    notes,
                    photoUrl,
                });
            }

            // Reset form
            setSelectedSymptoms(new Set());
            setNotes('');
            setPhotos([]);
            onClose();
        } catch (error) {
            console.error("Failed to log symptom", error);
            alert("Couldn't save the log. Please try again.");
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
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center flex-1">Log Symptom</h2>
                    <div className="w-6"></div> {/* Spacer for centering */}
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Symptoms Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Symptoms</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {ALL_SYMPTOMS.map(symptom => (
                                <div key={symptom} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                        <div className="text-gray-600 dark:text-gray-400 flex-shrink-0">
                                            {getSymptomIcon(symptom)}
                                        </div>
                                        <span className="text-gray-900 dark:text-white font-medium text-sm truncate">{symptom}</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleSymptomToggle(symptom)}
                                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 ml-2 ${
                                            selectedSymptoms.has(symptom)
                                                ? 'bg-blue-500 border-blue-500'
                                                : 'border-gray-300 dark:border-gray-600'
                                        }`}
                                    >
                                        {selectedSymptoms.has(symptom) && (
                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Notes Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Notes</h3>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add notes about your dog's symptoms"
                            rows={4}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        />
                    </div>

                    {/* Photos Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Photos</h3>
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center">
                            <div className="flex flex-col items-center space-y-3">
                                <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">Add Photos</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Capture images of your dog's symptoms for better tracking.</p>
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handlePhotoChange}
                                    className="hidden"
                                    id="photo-upload"
                                />
                                <label
                                    htmlFor="photo-upload"
                                    className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-lg font-medium cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                                >
                                    Upload from Device
                                </label>
                            </div>
                        </div>
                        
                        {/* Display selected photos */}
                        {photos.length > 0 && (
                            <div className="mt-4 grid grid-cols-2 gap-2">
                                {photos.map((photo, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={URL.createObjectURL(photo)}
                                            alt={`Symptom photo ${index + 1}`}
                                            className="w-full h-24 object-cover rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removePhoto(index)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Save Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting || selectedSymptoms.size === 0}
                            className="w-full bg-blue-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Saving...' : 'Save Symptom Log'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SymptomLoggerModal;