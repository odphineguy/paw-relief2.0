import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDogs } from '../context/DogContext';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import { DogIcon, ChevronRightIcon } from '../components/icons';
import { format, differenceInYears, addYears } from 'date-fns';
import BarcodeScannerModal from '../components/BarcodeScannerModal';
import ThemeSwitch from '../components/ThemeSwitch';

const Profile: React.FC = () => {
    const { selectedDog, loading } = useDogs();
    const { signOut } = useAuth();
    const navigate = useNavigate();
    const [isScannerOpen, setIsScannerOpen] = useState(false);

    const handleSignOut = async () => {
        try {
            await signOut();
            navigate('/splash');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const getBirthdayInfo = (isoDate: string) => {
        const birthDate = new Date(isoDate);
        const age = differenceInYears(new Date(), birthDate);
        const nextBirthday = addYears(birthDate, age + 1);
        return {
            age: `${age} years old`,
            next: format(nextBirthday, 'MMMM d, yyyy')
        }
    };
    
    return (
        <>
            <div className="flex flex-col h-full">
                <Header title="" showBackButton={false} />
                {loading ? (
                    <div className="flex justify-center items-center h-64"><DogIcon className="w-10 h-10 animate-spin text-primary" /></div>
                ) : selectedDog ? (
                    <div className="p-4 space-y-6">
                        {/* Consolidated Pet Profile Card */}
                        <div className="bg-card-light dark:bg-card-dark rounded-2xl overflow-hidden shadow-lg">
                            {/* Pet Image - Large Hero Style */}
                            <div className="relative h-64 bg-gradient-to-br from-primary/20 to-primary/5">
                                <img
                                    src={selectedDog.photoUrl}
                                    alt={selectedDog.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Pet Name and Breed */}
                            <div className="px-6 pt-6 pb-4 border-b border-border-light dark:border-border-dark">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{selectedDog.name}</h2>
                                <p className="text-gray-600 dark:text-gray-400 text-lg">{selectedDog.breed}</p>
                            </div>

                            {/* Pet Details Section */}
                            <div className="p-6 space-y-5">
                                {/* Basic Information */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-background-light dark:bg-background-dark rounded-lg p-4">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Age</p>
                                        <p className="text-lg font-bold text-gray-900 dark:text-white">{getBirthdayInfo(selectedDog.birthday).age}</p>
                                    </div>
                                    <div className="bg-background-light dark:bg-background-dark rounded-lg p-4">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Weight</p>
                                        <p className="text-lg font-bold text-gray-900 dark:text-white">{selectedDog.weight} lbs</p>
                                    </div>
                                </div>

                                {/* Birthday */}
                                <div className="bg-background-light dark:bg-background-dark rounded-lg p-4">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Next Birthday</p>
                                    <p className="text-base font-semibold text-gray-900 dark:text-white">{getBirthdayInfo(selectedDog.birthday).next}</p>
                                </div>

                                {/* Known Allergies */}
                                <div className="bg-background-light dark:bg-background-dark rounded-lg p-4">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Known Allergies</p>
                                    {selectedDog.knownAllergies && selectedDog.knownAllergies.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {selectedDog.knownAllergies.map(allergy => (
                                                <span key={allergy} className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-sm font-medium">{allergy}</span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-base font-semibold text-gray-900 dark:text-white">None</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Veterinarian Tools Card */}
                        <InfoCard title="Veterinarian Tools">
                            <div className="space-y-2">
                                <Link to="/report" className="flex justify-between items-center p-2 text-left bg-background-light dark:bg-background-dark rounded-lg hover:bg-primary/10 dark:hover:bg-primary/10">
                                    <span className="text-sm font-medium text-primary">Veterinarian Report</span>
                                    <ChevronRightIcon className="w-4 h-4 text-gray-400"/>
                                </Link>
                                <button onClick={() => setIsScannerOpen(true)} className="w-full flex justify-between items-center p-2 text-left bg-background-light dark:bg-background-dark rounded-lg hover:bg-primary/10 dark:hover:bg-primary/10">
                                    <span className="text-sm font-medium text-primary">Food Ingredient Checker</span>
                                    <ChevronRightIcon className="w-4 h-4 text-gray-400"/>
                                </button>
                            </div>
                        </InfoCard>

                        {/* Pet Management Card */}
                        <InfoCard title="Pet Management">
                            <Link to="/create-dog-profile" className="flex justify-between items-center p-2 text-left bg-background-light dark:bg-background-dark rounded-lg hover:bg-primary/10 dark:hover:bg-primary/10">
                                <span className="text-sm font-medium text-primary">Manage Pet Profiles</span>
                                <ChevronRightIcon className="w-4 h-4 text-gray-400"/>
                            </Link>
                        </InfoCard>

                        {/* Settings Card */}
                        <InfoCard title="Settings">
                            <div className="space-y-2">
                                <Link to="/app-settings" className="flex justify-between items-center p-2 text-left bg-background-light dark:bg-background-dark rounded-lg hover:bg-primary/10 dark:hover:bg-primary/10">
                                    <span className="text-sm font-medium text-primary">App Settings</span>
                                    <ChevronRightIcon className="w-4 h-4 text-gray-400"/>
                                </Link>
                                <div className="flex justify-between items-center p-2 bg-background-light dark:bg-background-dark rounded-lg">
                                    <span className="text-sm font-medium text-foreground-light dark:text-foreground-dark">Appearance</span>
                                    <ThemeSwitch />
                                </div>
                                <button
                                    onClick={handleSignOut}
                                    className="w-full flex justify-between items-center p-2 text-left bg-background-light dark:bg-background-dark rounded-lg hover:bg-red-500/10 dark:hover:bg-red-500/10"
                                >
                                    <span className="text-sm font-medium text-red-600 dark:text-red-400">Sign Out</span>
                                    <ChevronRightIcon className="w-4 h-4 text-gray-400"/>
                                </button>
                            </div>
                        </InfoCard>
                    </div>
                ) : (
                    <div className="p-4 text-center">
                        <p className="text-foreground-light dark:text-foreground-dark">No dog profile selected.</p>
                    </div>
                )}
            </div>
            <BarcodeScannerModal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} />
        </>
    );
};

interface InfoCardProps {
    title: string;
    children: React.ReactNode;
}
const InfoCard: React.FC<InfoCardProps> = ({ title, children }) => (
    <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-sm">
        <h3 className="text-lg font-bold text-foreground-light dark:text-foreground-dark mb-2">{title}</h3>
        <div className="space-y-2">{children}</div>
    </div>
);

interface InfoRowProps {
    label: string;
    value: string;
}
const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => (
    <div className="flex justify-between items-center">
        <p className="text-gray-500 dark:text-gray-400">{label}</p>
        <p className="font-semibold text-foreground-light dark:text-foreground-dark">{value}</p>
    </div>
);


export default Profile;