import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDogs } from '../context/DogContext';
import Header from '../components/Header';
import MedicationModal from '../components/MedicationModal';
import { Reminder, ReminderType } from '../types';
import { getReminders, updateReminder } from '../services/api';
import { format } from 'date-fns';
import { PawIcon, PillBottleIcon, SyringeIcon, PlusCircleIcon, EarIcon, ToiletIcon, CalendarIcon, BowlIcon } from '../components/icons';

const Meds: React.FC = () => {
    const { selectedDog } = useDogs();
    const navigate = useNavigate();
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [loading, setLoading] = useState(true);
    const [showMedicationModal, setShowMedicationModal] = useState(false);

    useEffect(() => {
        if (selectedDog) {
            fetchReminders();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDog]);
    
    const fetchReminders = async () => {
         if(!selectedDog) return;
         setLoading(true);
         try {
             const data = await getReminders(selectedDog.id);
             setReminders(data);
         } catch(err) {
            console.error("Failed to fetch reminders", err)
         } finally {
            setLoading(false);
         }
    };
    
    const handleToggleComplete = async (reminderId: string, currentStatus: boolean) => {
        try {
            await updateReminder(reminderId, !currentStatus);
            fetchReminders();
        } catch(error) {
            console.error("Failed to update reminder", error);
        }
    }

    const upcomingReminders = reminders.filter(r => !r.completed && r.type !== ReminderType.BIRTHDAY);
    const completedReminders = reminders.filter(r => r.completed && r.type !== ReminderType.BIRTHDAY);

    return (
        <div className="flex flex-col h-full bg-background-light dark:bg-background-dark font-body">
            <Header title="Medications" showBackButton={false} />
            
            {loading ? (
                <div className="flex justify-center items-center h-64"><PawIcon className="w-10 h-10 animate-spin text-primary" /></div>
            ) : selectedDog ? (
                <div className="flex-1 p-4 space-y-6 pb-24 overflow-y-auto">
                    {/* Summary Block - Medical Chart Style */}
                    <div className="bg-white dark:bg-card-dark rounded-lg border border-border-light dark:border-border-dark overflow-hidden">
                        <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-3 border-b border-border-light dark:border-border-dark flex justify-between items-center">
                            <h2 className="text-sm font-bold text-foreground-light dark:text-foreground-dark uppercase tracking-wider">Treatment Plan</h2>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Active</span>
                            </div>
                        </div>
                        <div className="p-4 flex items-center justify-between">
                             <div>
                                <p className="text-xs text-subtle-light dark:text-subtle-dark uppercase tracking-wide mb-1">Patient</p>
                                <p className="font-bold text-foreground-light dark:text-foreground-dark text-lg">{selectedDog.name}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-subtle-light dark:text-subtle-dark uppercase tracking-wide mb-1">Scheduled</p>
                                <p className="font-bold text-primary text-xl">{upcomingReminders.length} <span className="text-sm text-subtle-light font-normal">items</span></p>
                            </div>
                        </div>
                    </div>

                    {/* Upcoming Section */}
                    <div>
                        <div className="flex items-center justify-between mb-2 px-1">
                            <h3 className="text-xs font-bold text-subtle-light dark:text-subtle-dark uppercase tracking-wider">Upcoming Doses</h3>
                        </div>
                        {upcomingReminders.length > 0 ? (
                            <div className="space-y-2">
                                {upcomingReminders.map(r => <ReminderCard key={r.id} reminder={r} onToggle={handleToggleComplete} />)}
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-card-dark rounded-lg p-6 border border-border-light dark:border-border-dark border-dashed text-center">
                                <p className="text-sm text-subtle-light dark:text-subtle-dark">No upcoming medications scheduled.</p>
                            </div>
                        )}
                    </div>

                    {/* Completed Section */}
                    <div>
                        <div className="flex items-center justify-between mb-2 px-1">
                            <h3 className="text-xs font-bold text-subtle-light dark:text-subtle-dark uppercase tracking-wider">History</h3>
                        </div>
                        {completedReminders.length > 0 ? (
                            <div className="space-y-2">
                                {completedReminders.map(r => <ReminderCard key={r.id} reminder={r} onToggle={handleToggleComplete} />)}
                            </div>
                        ) : (
                            <div className="text-center py-4 text-xs text-subtle-light italic">
                                No completed history for today.
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="p-4 text-center space-y-3 mt-10">
                    <PawIcon className="w-12 h-12 text-subtle-light mx-auto" />
                    <p className="text-foreground-light dark:text-foreground-dark">Add a pet to manage medications.</p>
                    <button
                        onClick={() => navigate('/create-dog-profile')}
                        className="px-6 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-colors shadow-soft"
                    >
                        Add Pet
                    </button>
                </div>
            )}

            {/* Floating Action Button */}
            <button
                onClick={() => setShowMedicationModal(true)}
                className="fixed bottom-24 right-4 bg-primary hover:bg-primary-hover text-white p-4 rounded-full shadow-lg transition-transform hover:scale-105 z-10"
                aria-label="Add Medication"
            >
                <PlusCircleIcon className="w-6 h-6" />
            </button>

            {/* Medication Modal */}
            <MedicationModal
                isOpen={showMedicationModal}
                onClose={() => setShowMedicationModal(false)}
                onSuccess={fetchReminders}
            />
        </div>
    );
};

interface ReminderCardProps {
    reminder: Reminder;
    onToggle: (id: string, completed: boolean) => void;
}

const ReminderCard: React.FC<ReminderCardProps> = ({ reminder, onToggle }) => {
    // Determine icon based on reminder type
    const getIcon = () => {
        switch (reminder.type) {
            case ReminderType.MEDICATION:
                return <PillBottleIcon className="w-5 h-5" />;
            case ReminderType.TOPICAL_TREATMENT:
                return <SyringeIcon className="w-5 h-5" />;
            case ReminderType.EAR_CLEANING:
                return <EarIcon className="w-5 h-5" />;
            case ReminderType.PAW_WIPES:
                return <BowlIcon className="w-5 h-5" />;
            case ReminderType.VET_VISIT:
                return <CalendarIcon className="w-5 h-5" />;
            case ReminderType.BIRTHDAY:
                return <CalendarIcon className="w-5 h-5" />;
            default:
                return <PillBottleIcon className="w-5 h-5" />;
        }
    };

    return (
        <div className={`bg-white dark:bg-card-dark rounded-lg p-3 border transition-colors duration-200 flex items-center gap-3 ${
            reminder.completed 
                ? 'border-border-light dark:border-border-dark opacity-60 bg-slate-50 dark:bg-slate-900/50' 
                : 'border-border-light dark:border-border-dark hover:border-primary/50'
        }`}>
            {/* Icon */}
            <div className={`w-10 h-10 rounded flex items-center justify-center flex-shrink-0 border ${
                reminder.completed
                    ? 'bg-white dark:bg-card-dark border-border-light dark:border-border-dark text-subtle-light'
                    : 'bg-white dark:bg-card-dark border-border-light dark:border-border-dark text-primary'
            }`}>
                {getIcon()}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <h3 className={`text-sm font-bold truncate ${
                    reminder.completed
                        ? 'text-subtle-light dark:text-subtle-dark line-through'
                        : 'text-foreground-light dark:text-foreground-dark'
                }`}>
                    {reminder.name}
                </h3>
                <div className="flex items-center gap-2 text-xs">
                     <span className={`${
                        reminder.completed
                            ? 'text-subtle-light'
                            : 'text-subtle-light dark:text-subtle-dark'
                    }`}>
                        {reminder.dosage || reminder.type}
                    </span>
                    {reminder.nextDue && !reminder.completed && (
                            <span className="text-warning font-semibold">
                            • Due {format(new Date(reminder.nextDue), 'h:mm a')}
                            </span>
                    )}
                </div>
            </div>

            {/* Checkbox (Custom) */}
            <button
                onClick={() => onToggle(reminder.id, reminder.completed)}
                className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${
                    reminder.completed 
                        ? 'bg-emerald-500 border-emerald-500 text-white' 
                        : 'bg-white dark:bg-card-dark border-subtle-light hover:border-primary'
                }`}
            >
                {reminder.completed && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                )}
            </button>
        </div>
    );
};

export default Meds;