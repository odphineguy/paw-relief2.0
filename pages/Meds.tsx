import React, { useEffect, useState } from 'react';
import { useDogs } from '../context/DogContext';
import Header from '../components/Header';
import MedicationModal from '../components/MedicationModal';
import { Reminder, ReminderType } from '../types';
import { getReminders, updateReminder } from '../services/api';
import { format, isToday } from 'date-fns';
import { PawIcon, PillBottleIcon, SyringeIcon, PlusCircleIcon, EarIcon, ToiletIcon, CalendarIcon, UserIcon, BowlIcon } from '../components/icons';

const Meds: React.FC = () => {
    const { selectedDog } = useDogs();
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
        <div className="flex flex-col h-full bg-background-light dark:bg-background-dark">
            <Header title="" showBackButton={false} />
            {loading ? (
                <div className="flex justify-center items-center h-64"><PawIcon className="w-10 h-10 animate-spin text-primary" /></div>
            ) : selectedDog ? (
                <div className="flex-1 p-4 space-y-6 pb-24">
                    {/* Upcoming Section */}
                    <div>
                        <h2 className="text-xl text-gray-900 dark:text-white mb-4">Upcoming</h2>
                        {upcomingReminders.length > 0 ? (
                            <div className="space-y-3">
                                {upcomingReminders.map(r => <ReminderCard key={r.id} reminder={r} onToggle={handleToggleComplete} />)}
                            </div>
                        ) : (
                            <div className="bg-card-light dark:bg-card-dark rounded-xl p-6 shadow-sm">
                                <p className="text-gray-500 dark:text-gray-400 text-center">No upcoming reminders.</p>
                            </div>
                        )}
                    </div>

                    {/* Completed Section */}
                    <div>
                        <h2 className="text-xl text-gray-900 dark:text-white mb-4">Completed</h2>
                        {completedReminders.length > 0 ? (
                            <div className="space-y-3">
                                {completedReminders.map(r => <ReminderCard key={r.id} reminder={r} onToggle={handleToggleComplete} />)}
                            </div>
                        ) : (
                            <div className="bg-card-light dark:bg-card-dark rounded-xl p-6 shadow-sm">
                                <p className="text-gray-500 dark:text-gray-400 text-center">No completed reminders.</p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="p-4 text-center">
                    <p className="text-foreground-light dark:text-foreground-dark">Please select a dog to view medications.</p>
                </div>
            )}

            {/* Floating Action Button */}
            <button
                onClick={() => setShowMedicationModal(true)}
                className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl shadow-lg flex items-center space-x-2 transition-colors z-10"
            >
                <PlusCircleIcon className="w-5 h-5" />
                <span className="font-medium">New Medication</span>
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
                return <PillBottleIcon className="w-6 h-6" />;
            case ReminderType.TOPICAL_TREATMENT:
                return <SyringeIcon className="w-6 h-6" />;
            case ReminderType.EAR_CLEANING:
                return <EarIcon className="w-6 h-6" />;
            case ReminderType.PAW_WIPES:
                return <BowlIcon className="w-6 h-6" />;
            case ReminderType.VET_VISIT:
                return <CalendarIcon className="w-6 h-6" />;
            case ReminderType.BIRTHDAY:
                return <CalendarIcon className="w-6 h-6" />;
            default:
                return <PillBottleIcon className="w-6 h-6" />;
        }
    };

    return (
        <div className="bg-card-light dark:bg-card-dark rounded-xl p-4 shadow-sm flex items-center gap-4">
            {/* Icon */}
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                reminder.completed
                    ? 'bg-gray-100 dark:bg-gray-700'
                    : 'bg-blue-500 dark:bg-blue-600'
            }`}>
                <div className={reminder.completed ? 'text-gray-400' : 'text-white'}>
                    {getIcon()}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <h3 className={`font-semibold ${
                    reminder.completed
                        ? 'line-through text-gray-400 dark:text-gray-500'
                        : 'text-gray-900 dark:text-white'
                }`}>
                    {reminder.name}
                </h3>
                <p className={`text-sm ${
                    reminder.completed
                        ? 'text-gray-400 dark:text-gray-500'
                        : 'text-gray-500 dark:text-gray-400'
                }`}>
                    {reminder.dosage || reminder.type}
                </p>
            </div>

            {/* Toggle Switch */}
            <div className="flex-shrink-0">
                <button
                    onClick={() => onToggle(reminder.id, reminder.completed)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                        reminder.completed ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                    }`}
                >
                    <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            reminder.completed ? 'translate-x-[26px]' : 'translate-x-1'
                        }`}
                    />
                </button>
            </div>
        </div>
    );
};

export default Meds;