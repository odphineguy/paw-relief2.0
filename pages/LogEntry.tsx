import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDogs } from '../context/DogContext';
import { SymptomType, TriggerType } from '../types';
import { ALL_SYMPTOMS } from '../constants';
import { addSymptomLog, addTriggerLog } from '../services/api';
import { XIcon, EarIcon, ScanEyeIcon, ToiletIcon, PawPrintIcon, AlertTriangleIcon, FlameIcon, PlusCircleIcon } from '../components/icons';

// Function to get icon for each symptom type
const getSymptomIcon = (symptom: SymptomType) => {
    switch (symptom) {
        case SymptomType.EAR_INFECTIONS:
            return <EarIcon className="w-6 h-6" />;
        case SymptomType.WATERY_EYES:
            return <ScanEyeIcon className="w-6 h-6" />;
        case SymptomType.DIGESTIVE_ISSUES:
            return <ToiletIcon className="w-6 h-6" />;
        case SymptomType.PAW_LICKING:
            return <PawPrintIcon className="w-6 h-6" />;
        case SymptomType.HOT_SPOTS:
            return <FlameIcon className="w-6 h-6" />;
        case SymptomType.EXCESSIVE_SCRATCHING:
        case SymptomType.RED_IRRITATED_SKIN:
        case SymptomType.SNEEZING:
        default:
            return <AlertTriangleIcon className="w-6 h-6" />;
    }
};

const LogEntry: React.FC = () => {
    const navigate = useNavigate();
    const { selectedDog } = useDogs();
    const [activeTab, setActiveTab] = useState<'symptom' | 'trigger'>('symptom');

    // Symptom state
    const [selectedSymptoms, setSelectedSymptoms] = useState<Set<SymptomType>>(new Set());
    const [severity, setSeverity] = useState(3);
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
            title: 'Food',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
            )
        },
        {
            id: 'location',
            type: TriggerType.WALK_LOCATION,
            title: 'Location',
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
            title: 'Weather',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            )
        },
        {
            id: 'pollen',
            type: TriggerType.POLLEN,
            title: 'Pollen',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            )
        },
        {
            id: 'products',
            type: TriggerType.HOUSEHOLD_PRODUCT,
            title: 'Product',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
            )
        },
        {
            id: 'environment',
            type: TriggerType.ENVIRONMENTAL_CHANGE,
            title: 'Environment',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 01-1 1h2a1 1 0 01 1 1v4a1 1 0 001 1m-6 0h6" />
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

    const handleTriggerToggle = (triggerType: TriggerType) => {
        if (selectedTriggerType === triggerType) {
            setSelectedTriggerType(null);
        } else {
            setSelectedTriggerType(triggerType);
        }
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
                    severity: severity,
                    triggers: [],
                    notes: symptomNotes,
                    photoUrl: undefined,
                });
            }

            // Reset form
            setSelectedSymptoms(new Set());
            setSeverity(3);
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center z-50">
            <div className="bg-white dark:bg-card-dark rounded-t-3xl w-full max-w-md h-[90vh] flex flex-col shadow-2xl animate-slide-up">
                {/* Header */}
                <div className="px-6 py-4 flex justify-between items-center border-b border-border-light dark:border-border-dark">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="p-2 -ml-2 text-subtle-light hover:text-foreground-light dark:hover:text-foreground-dark rounded-full hover:bg-background-light dark:hover:bg-background-dark transition-colors"
                    >
                        <XIcon className="w-6 h-6" />
                    </button>
                    <h2 className="text-lg font-display font-bold text-foreground-light dark:text-foreground-dark">New Entry</h2>
                    <div className="w-10"></div> {/* Spacer for balance */}
                </div>

                {/* Tabs */}
                <div className="flex p-2 mx-4 mt-4 bg-background-light dark:bg-background-dark rounded-xl">
                    <button
                        onClick={() => setActiveTab('symptom')}
                        className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                            activeTab === 'symptom'
                                ? 'bg-white dark:bg-card-dark text-primary shadow-sm'
                                : 'text-subtle-light dark:text-subtle-dark hover:text-foreground-light dark:hover:text-foreground-dark'
                        }`}
                    >
                        Symptom
                    </button>
                    <button
                        onClick={() => setActiveTab('trigger')}
                        className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                            activeTab === 'trigger'
                                ? 'bg-white dark:bg-card-dark text-primary shadow-sm'
                                : 'text-subtle-light dark:text-subtle-dark hover:text-foreground-light dark:hover:text-foreground-dark'
                        }`}
                    >
                        Trigger
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {activeTab === 'symptom' ? (
                        <form onSubmit={handleSymptomSubmit} className="space-y-8">
                            {/* Symptoms Section */}
                            <div>
                                <label className="block text-sm font-semibold text-foreground-light dark:text-foreground-dark mb-3 uppercase tracking-wider">
                                    What did you notice?
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {ALL_SYMPTOMS.map(symptom => (
                                        <button
                                            key={symptom}
                                            type="button"
                                            onClick={() => handleSymptomToggle(symptom)}
                                            className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 h-28 ${
                                                selectedSymptoms.has(symptom)
                                                    ? 'bg-primary/10 border-primary text-primary'
                                                    : 'bg-white dark:bg-card-dark border-border-light dark:border-border-dark text-subtle-light hover:border-primary/50'
                                            }`}
                                        >
                                            <div className={`mb-2 ${selectedSymptoms.has(symptom) ? 'text-primary' : 'text-subtle-light'}`}>
                                                {getSymptomIcon(symptom)}
                                            </div>
                                            <span className="text-xs font-medium text-center leading-tight">
                                                {symptom}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Severity Section */}
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <label className="text-sm font-semibold text-foreground-light dark:text-foreground-dark uppercase tracking-wider">Severity</label>
                                    <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">{severity}/5</span>
                                </div>
                                <div className="relative h-2 bg-background-light dark:bg-background-dark rounded-full">
                                    <div 
                                        className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-200"
                                        style={{ width: `${((severity - 1) / 4) * 100}%` }}
                                    />
                                    <input
                                        type="range"
                                        min="1"
                                        max="5"
                                        value={severity}
                                        onChange={(e) => setSeverity(Number(e.target.value))}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    {/* Steps */}
                                    <div className="absolute top-1/2 left-0 w-full flex justify-between -translate-y-1/2 pointer-events-none px-1">
                                        {[1, 2, 3, 4, 5].map((step) => (
                                            <div key={step} className={`w-3 h-3 rounded-full ${step <= severity ? 'bg-primary' : 'bg-border-light dark:bg-border-dark'}`} />
                                        ))}
                                    </div>
                                </div>
                                <div className="flex justify-between text-xs text-subtle-light mt-2 font-medium">
                                    <span>Mild</span>
                                    <span>Moderate</span>
                                    <span>Severe</span>
                                </div>
                            </div>

                            {/* Notes Section */}
                            <div>
                                <label className="block text-sm font-semibold text-foreground-light dark:text-foreground-dark mb-3 uppercase tracking-wider">Notes</label>
                                <textarea
                                    value={symptomNotes}
                                    onChange={(e) => setSymptomNotes(e.target.value)}
                                    placeholder="Describe the symptoms..."
                                    rows={3}
                                    className="w-full p-4 border border-border-light dark:border-border-dark rounded-xl bg-background-light dark:bg-background-dark text-foreground-light dark:text-foreground-dark placeholder-subtle-light focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none transition-all"
                                />
                            </div>

                            {/* Photos Section */}
                            <div>
                                <label className="block text-sm font-semibold text-foreground-light dark:text-foreground-dark mb-3 uppercase tracking-wider">Photos</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {photos.map((photo, index) => (
                                        <div key={index} className="relative aspect-square rounded-xl overflow-hidden group">
                                            <img
                                                src={URL.createObjectURL(photo)}
                                                alt={`Evidence ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removePhoto(index)}
                                                className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <XIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                    <label className="aspect-square rounded-xl border-2 border-dashed border-border-light dark:border-border-dark flex flex-col items-center justify-center text-subtle-light hover:text-primary hover:border-primary hover:bg-primary/5 cursor-pointer transition-all">
                                        <PlusCircleIcon className="w-8 h-8 mb-1" />
                                        <span className="text-xs font-medium">Add Photo</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handlePhotoChange}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                            </div>

                            {/* Submit Button Spacer */}
                            <div className="h-20"></div>
                        </form>
                    ) : (
                        <form onSubmit={handleTriggerSubmit} className="space-y-8">
                            {/* Trigger Type Selection */}
                            <div>
                                <label className="block text-sm font-semibold text-foreground-light dark:text-foreground-dark mb-3 uppercase tracking-wider">
                                    Potential Trigger
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {triggerTypes.map((trigger) => (
                                        <button
                                            key={trigger.id}
                                            type="button"
                                            onClick={() => handleTriggerToggle(trigger.type)}
                                            className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 ${
                                                selectedTriggerType === trigger.type
                                                    ? 'bg-primary/10 border-primary text-primary'
                                                    : 'bg-white dark:bg-card-dark border-border-light dark:border-border-dark text-subtle-light hover:border-primary/50'
                                            }`}
                                        >
                                            <div className={`${selectedTriggerType === trigger.type ? 'text-primary' : 'text-subtle-light'}`}>
                                                {trigger.icon}
                                            </div>
                                            <span className="font-medium text-sm">{trigger.title}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Location Field */}
                            {selectedTriggerType && (selectedTriggerType === TriggerType.WALK_LOCATION || selectedTriggerType === TriggerType.ENVIRONMENTAL_CHANGE) && (
                                <div>
                                    <label className="block text-sm font-semibold text-foreground-light dark:text-foreground-dark mb-3 uppercase tracking-wider">
                                        Location {selectedTriggerType === TriggerType.WALK_LOCATION && '*'}
                                    </label>
                                    <input
                                        type="text"
                                        value={triggerLocation}
                                        onChange={(e) => setTriggerLocation(e.target.value)}
                                        placeholder="e.g., City Park"
                                        required={selectedTriggerType === TriggerType.WALK_LOCATION}
                                        className="w-full p-4 border border-border-light dark:border-border-dark rounded-xl bg-background-light dark:bg-background-dark text-foreground-light dark:text-foreground-dark placeholder-subtle-light focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                    />
                                </div>
                            )}

                            {/* Notes */}
                            <div>
                                <label className="block text-sm font-semibold text-foreground-light dark:text-foreground-dark mb-3 uppercase tracking-wider">Details</label>
                                <textarea
                                    value={triggerNotes}
                                    onChange={(e) => setTriggerNotes(e.target.value)}
                                    placeholder="Add any additional context..."
                                    rows={3}
                                    className="w-full p-4 border border-border-light dark:border-border-dark rounded-xl bg-background-light dark:bg-background-dark text-foreground-light dark:text-foreground-dark placeholder-subtle-light focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none transition-all"
                                />
                            </div>

                            {/* Info Box */}
                            {selectedTriggerType && (
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
                                    <div className="flex gap-3">
                                        <div className="text-primary shrink-0 mt-0.5">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        </div>
                                        <p className="text-sm text-subtle-light dark:text-blue-200">
                                            {selectedTriggerType === TriggerType.FOOD && "Logging food helps identify dietary allergies."}
                                            {selectedTriggerType === TriggerType.WALK_LOCATION && "Track location to find environmental hotspots."}
                                            {selectedTriggerType === TriggerType.WEATHER && "Weather changes can affect skin and respiratory health."}
                                            {selectedTriggerType === TriggerType.POLLEN && "High pollen counts are a common cause of itching."}
                                            {selectedTriggerType === TriggerType.HOUSEHOLD_PRODUCT && "Chemicals in cleaning products can be irritants."}
                                            {selectedTriggerType === TriggerType.ENVIRONMENTAL_CHANGE && "New furniture or bedding can introduce allergens."}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Spacer */}
                            <div className="h-20"></div>
                        </form>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-white dark:bg-card-dark border-t border-border-light dark:border-border-dark rounded-t-2xl">
                    <button
                        onClick={activeTab === 'symptom' ? handleSymptomSubmit : handleTriggerSubmit}
                        disabled={activeTab === 'symptom' ? (isSymptomSubmitting || selectedSymptoms.size === 0) : (isTriggerSubmitting || !selectedTriggerType)}
                        className="w-full bg-primary text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:bg-primary-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                    >
                        {activeTab === 'symptom' 
                            ? (isSymptomSubmitting ? 'Saving...' : 'Save Symptom Log')
                            : (isTriggerSubmitting ? 'Saving...' : 'Save Trigger Log')
                        }
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LogEntry;