import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDogs } from '../context/DogContext';
import { SymptomType, TriggerType } from '../types';
import { ALL_SYMPTOMS } from '../constants';
import { addSymptomLog, addTriggerLog } from '../services/api';
import { XIcon, EarIcon, ScanEyeIcon, ToiletIcon, PawPrintIcon, AlertTriangleIcon, FlameIcon } from '../components/icons';

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

const LogEntry: React.FC = () => {
    const navigate = useNavigate();
    const { selectedDog } = useDogs();
    const [activeTab, setActiveTab] = useState<'symptom' | 'trigger'>('symptom');

    // Symptom state
    const [selectedSymptoms, setSelectedSymptoms] = useState<Set<SymptomType>>(new Set());
    const [symptomNotes, setSymptomNotes] = useState('');
    const [photos, setPhotos] = useState<File[]>([]);
    const [isSymptomSubmitting, setIsSymptomSubmitting] = useState(false);

    // Trigger state
    const [selectedTriggerType, setSelectedTriggerType] = useState<TriggerType | null>(null);
    const [triggerNotes, setTriggerNotes] = useState('');
    const [triggerLocation, setTriggerLocation] = useState('');
    const [isTriggerSubmitting, setIsTriggerSubmitting] = useState(false);

    const triggerTypes = [
        {
            id: 'food',
            type: TriggerType.FOOD,
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
            type: TriggerType.WALK_LOCATION,
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
            type: TriggerType.WEATHER,
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
            type: TriggerType.POLLEN,
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
            type: TriggerType.HOUSEHOLD_PRODUCT,
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
            type: TriggerType.ENVIRONMENTAL_CHANGE,
            title: 'Environmental Changes',
            description: 'Document environmental changes',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            )
        }
    ];

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

    const handleSymptomSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDog || selectedSymptoms.size === 0) {
            alert('Please select at least one symptom.');
            return;
        }
        setIsSymptomSubmitting(true);
        try {
            for (const symptom of selectedSymptoms) {
                await addSymptomLog({
                    dogId: selectedDog.id,
                    symptomType: symptom,
                    severity: 3,
                    triggers: [],
                    notes: symptomNotes,
                    photoUrl: undefined,
                });
            }

            // Reset form
            setSelectedSymptoms(new Set());
            setSymptomNotes('');
            setPhotos([]);
            navigate('/dashboard');
        } catch (error) {
            console.error("Failed to log symptom", error);
            alert("Couldn't save the log. Please try again.");
        } finally {
            setIsSymptomSubmitting(false);
        }
    };

    const handleTriggerSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDog || !selectedTriggerType) {
            alert('Please select a trigger type.');
            return;
        }

        setIsTriggerSubmitting(true);
        try {
            await addTriggerLog({
                dogId: selectedDog.id,
                triggerType: selectedTriggerType,
                details: {},
                location: triggerLocation || undefined,
                notes: triggerNotes,
                loggedDate: new Date().toISOString(),
            });

            // Reset form
            setSelectedTriggerType(null);
            setTriggerNotes('');
            setTriggerLocation('');
            navigate('/dashboard');
        } catch (error) {
            console.error("Failed to log trigger", error);
            alert("Couldn't save the trigger log. Please try again.");
        } finally {
            setIsTriggerSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
            <div className="bg-white dark:bg-gray-900 rounded-t-3xl w-full max-w-md h-[90vh] flex flex-col">
                {/* Header */}
                <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
                    <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <XIcon />
                    </button>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center flex-1">New Entry</h2>
                    <div className="w-6"></div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => setActiveTab('symptom')}
                        className={`flex-1 py-3 text-center font-semibold transition-colors ${
                            activeTab === 'symptom'
                                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                    >
                        Log Symptom
                    </button>
                    <button
                        onClick={() => setActiveTab('trigger')}
                        className={`flex-1 py-3 text-center font-semibold transition-colors ${
                            activeTab === 'trigger'
                                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                    >
                        Log Trigger
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    {activeTab === 'symptom' ? (
                        <form onSubmit={handleSymptomSubmit} className="p-6 space-y-6">
                            {/* Symptoms Section */}
                            <div>
                                <div className="grid grid-cols-2 gap-3">
                                    {ALL_SYMPTOMS.map(symptom => (
                                        <button
                                            key={symptom}
                                            type="button"
                                            onClick={() => handleSymptomToggle(symptom)}
                                            className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-colors ${
                                                selectedSymptoms.has(symptom)
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700'
                                            }`}
                                        >
                                            <div className="flex-shrink-0 text-white">
                                                {getSymptomIcon(symptom)}
                                            </div>
                                            <span className="font-medium text-sm text-center">{symptom}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Notes Section */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Notes</h3>
                                <textarea
                                    value={symptomNotes}
                                    onChange={(e) => setSymptomNotes(e.target.value)}
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
                                    disabled={isSymptomSubmitting || selectedSymptoms.size === 0}
                                    className="w-full bg-blue-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                                >
                                    {isSymptomSubmitting ? 'Saving...' : 'Save Symptom Log'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleTriggerSubmit} className="p-6 space-y-6">
                            {/* Trigger Type Selection */}
                            <div>
                                <div className="grid grid-cols-2 gap-3">
                                    {triggerTypes.map((trigger) => (
                                        <button
                                            key={trigger.id}
                                            type="button"
                                            onClick={() => setSelectedTriggerType(trigger.type)}
                                            className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-colors ${
                                                selectedTriggerType === trigger.type
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700'
                                            }`}
                                        >
                                            <div className="flex-shrink-0 text-white">
                                                {trigger.icon}
                                            </div>
                                            <span className="font-medium text-sm text-center">{trigger.title}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Location Field (if needed) */}
                            {selectedTriggerType && (selectedTriggerType === TriggerType.WALK_LOCATION || selectedTriggerType === TriggerType.ENVIRONMENTAL_CHANGE) && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                        Location {selectedTriggerType === TriggerType.WALK_LOCATION ? '(Required)' : '(Optional)'}
                                    </label>
                                    <input
                                        type="text"
                                        value={triggerLocation}
                                        onChange={(e) => setTriggerLocation(e.target.value)}
                                        placeholder="e.g., City Park, Backyard"
                                        required={selectedTriggerType === TriggerType.WALK_LOCATION}
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
                                    value={triggerNotes}
                                    onChange={(e) => setTriggerNotes(e.target.value)}
                                    placeholder="Add any additional details..."
                                    rows={4}
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                />
                            </div>

                            {/* Info text based on trigger type */}
                            {selectedTriggerType && (
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        {selectedTriggerType === TriggerType.FOOD && "Record what food your dog ate that may have triggered symptoms."}
                                        {selectedTriggerType === TriggerType.WALK_LOCATION && "Note where you walked your dog to track location-based patterns."}
                                        {selectedTriggerType === TriggerType.WEATHER && "Log current weather conditions that may affect your dog."}
                                        {selectedTriggerType === TriggerType.POLLEN && "Track pollen exposure to identify seasonal patterns."}
                                        {selectedTriggerType === TriggerType.HOUSEHOLD_PRODUCT && "Record household products used near your dog."}
                                        {selectedTriggerType === TriggerType.ENVIRONMENTAL_CHANGE && "Note any environmental changes in your home or area."}
                                    </p>
                                </div>
                            )}

                            {/* Save Button */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isTriggerSubmitting || !selectedTriggerType}
                                    className="w-full bg-blue-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                                >
                                    {isTriggerSubmitting ? 'Saving...' : 'Save Trigger Log'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LogEntry;
