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
                <div className="p-4 space-y-6 overflow-y-auto pb-24">
                    {/* Hero */}
                    <div className="rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white p-5 shadow-md relative overflow-hidden">
                        <div className="absolute -right-10 -top-10 w-36 h-36 bg-white/10 rounded-full blur-2xl" />
                        <div className="absolute -left-8 bottom-0 w-28 h-28 bg-white/10 rounded-full blur-xl" />
                        <div className="flex items-center gap-3 relative">
                            <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white/60 shadow-lg">
                                <img src={selectedDog?.photoUrl} alt={selectedDog?.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-white/80">Profile & tools</p>
                                <h2 className="text-2xl font-bold leading-tight">{selectedDog?.name || 'Your pet'}</h2>
                                {selectedDog?.breed && <p className="text-white/75 text-sm capitalize">{selectedDog.breed}</p>}
                            </div>
                            <button
                                onClick={() => navigate('/create-dog-profile')}
                                className="px-3 py-2 rounded-lg bg-white/15 hover:bg-white/25 text-xs font-semibold backdrop-blur-sm border border-white/20"
                            >
                                Manage Pets
                            </button>
                        </div>
                    </div>

                    {/* Pet Profiles Section */}
                    <InfoCard title="My Pets">
                        {loading ? (
                            <div className="flex justify-center items-center py-8">
                                <DogIcon className="w-8 h-8 animate-spin text-primary" />
                            </div>
                        ) : selectedDog ? (
                            <div className="space-y-4">
                                {/* Selected Pet Card */}
                                <div className="bg-background-light dark:bg-background-dark rounded-xl overflow-hidden">
                                    <div className="relative h-40 bg-gradient-to-br from-primary/20 to-primary/5">
                                        <img
                                            src={selectedDog.photoUrl}
                                            alt={selectedDog.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedDog.name}</h3>
                                        <p className="text-gray-600 dark:text-gray-400">{selectedDog.breed} • {getBirthdayInfo(selectedDog.birthday).age}</p>
                                        {selectedDog.knownAllergies && selectedDog.knownAllergies.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {selectedDog.knownAllergies.slice(0, 3).map(allergy => (
                                                    <span key={allergy} className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-xs font-medium">{allergy}</span>
                                                ))}
                                                {selectedDog.knownAllergies.length > 3 && (
                                                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs font-medium">+{selectedDog.knownAllergies.length - 3}</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <Link 
                                    to="/create-dog-profile" 
                                    className="flex justify-between items-center p-3 text-left bg-background-light dark:bg-background-dark rounded-lg hover:bg-primary/10 dark:hover:bg-primary/10"
                                >
                                    <span className="text-sm font-medium text-primary">Manage Pet Profiles</span>
                                    <ChevronRightIcon className="w-4 h-4 text-gray-400"/>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="text-center py-6 bg-background-light dark:bg-background-dark rounded-xl">
                                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <DogIcon className="w-8 h-8 text-blue-500 dark:text-blue-400" />
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400 mb-3">No pets added yet</p>
                                    <button
                                        onClick={() => navigate('/create-dog-profile')}
                                        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                                    >
                                        Add Your First Pet
                                    </button>
                                </div>
                            </div>
                        )}
                    </InfoCard>

                    {/* Veterinarian Tools Card */}
                    <InfoCard title="Veterinarian Tools">
                        <div className="space-y-3">
                            <Link to="/report" className="flex justify-between items-center p-3 text-left bg-background-light dark:bg-background-dark rounded-lg border border-border-light dark:border-border-dark hover:bg-primary/5 dark:hover:bg-primary/10">
                                <span className="text-sm font-medium text-primary">Veterinarian Report</span>
                                <ChevronRightIcon className="w-4 h-4 text-gray-400"/>
                            </Link>
                            <button onClick={() => setIsScannerOpen(true)} className="w-full flex justify-between items-center p-3 text-left bg-background-light dark:bg-background-dark rounded-lg border border-border-light dark:border-border-dark hover:bg-primary/5 dark:hover:bg-primary/10">
                                <span className="text-sm font-medium text-primary">Food Ingredient Checker</span>
                                <ChevronRightIcon className="w-4 h-4 text-gray-400"/>
                            </button>
                        </div>
                    </InfoCard>

                    {/* Settings Card */}
                    <InfoCard title="Settings">
                        <div className="space-y-2">
                            <div className="flex justify-between items-center p-2 bg-background-light dark:bg-background-dark rounded-lg border border-border-light dark:border-border-dark">
                                <div>
                                    <p className="text-sm font-medium text-foreground-light dark:text-foreground-dark">Appearance</p>
                                    <p className="text-xs text-subtle-light dark:text-subtle-dark">Switch between light and dark</p>
                                </div>
                                <ThemeSwitch />
                            </div>
                            <a
                                href="https://pawrelief.app"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex justify-between items-center p-2 text-left bg-background-light dark:bg-background-dark rounded-lg border border-border-light dark:border-border-dark hover:bg-primary/5 dark:hover:bg-primary/10"
                            >
                                <span className="text-sm font-medium text-primary">Help Center & Policies</span>
                                <ChevronRightIcon className="w-4 h-4 text-gray-400"/>
                            </a>
                        </div>
                    </InfoCard>

                    {/* Account Card */}
                    <InfoCard title="Account">
                        <div className="space-y-2">
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