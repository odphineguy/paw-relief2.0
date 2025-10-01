import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDogs } from '../context/DogContext';
import Header from '../components/Header';
import { PawIcon, ChevronRightIcon } from '../components/icons';
import { format, differenceInYears, addYears } from 'date-fns';
import BarcodeScannerModal from '../components/BarcodeScannerModal';
import ThemeSwitch from '../components/ThemeSwitch';

const Profile: React.FC = () => {
    const { selectedDog, loading } = useDogs();
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    
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
                    <div className="flex justify-center items-center h-64"><PawIcon className="w-10 h-10 animate-spin text-primary" /></div>
                ) : selectedDog ? (
                    <div>
                        <div className="p-4 flex flex-col items-center bg-card-light dark:bg-card-dark pb-8 rounded-b-3xl">
                            <img src={selectedDog.photoUrl} alt={selectedDog.name} className="w-32 h-32 rounded-full object-cover border-4 border-primary shadow-lg -mt-2" />
                            <h2 className="text-3xl font-bold mt-4 text-foreground-light dark:text-foreground-dark">{selectedDog.name}</h2>
                            <p className="text-gray-500 dark:text-gray-400">{selectedDog.breed}</p>
                        </div>

                        <div className="p-4 space-y-4">
                            <InfoCard title="Details">
                                <InfoRow label="Age" value={getBirthdayInfo(selectedDog.birthday).age} />
                                <InfoRow label="Weight" value={`${selectedDog.weight} lbs`} />
                                <InfoRow label="Next Birthday" value={getBirthdayInfo(selectedDog.birthday).next} />
                            </InfoCard>

                            <InfoCard title="Known Allergies">
                            <div className="flex flex-wrap gap-2">
                                    {selectedDog.knownAllergies.map(allergy => (
                                        <span key={allergy} className="px-3 py-1 bg-primary/10 dark:bg-primary/10 text-primary dark:text-primary rounded-full text-sm font-semibold">{allergy}</span>
                                    ))}
                                </div>
                            </InfoCard>

                            <InfoCard title="Veterinarian Tools">
                                <div className="space-y-2">
                                    <Link to="/report" className="flex justify-between items-center p-2 text-left bg-background-light dark:bg-background-dark rounded-lg hover:bg-primary/10 dark:hover:bg-primary/10">
                                        <span className="text-sm font-medium text-primary">Generate Vet Report</span>
                                        <ChevronRightIcon className="w-4 h-4 text-gray-400"/>
                                    </Link>
                                    <button onClick={() => setIsScannerOpen(true)} className="w-full flex justify-between items-center p-2 text-left bg-background-light dark:bg-background-dark rounded-lg hover:bg-primary/10 dark:hover:bg-primary/10">
                                        <span className="text-sm font-medium text-primary">Food Ingredient Checker</span>
                                        <ChevronRightIcon className="w-4 h-4 text-gray-400"/>
                                    </button>
                                </div>
                            </InfoCard>

                            <InfoCard title="Pet Management">
                                <Link to="/create-dog-profile" className="flex justify-between items-center p-2 text-left bg-background-light dark:bg-background-dark rounded-lg hover:bg-primary/10 dark:hover:bg-primary/10">
                                    <span className="text-sm font-medium text-primary">Manage Pet Profiles</span>
                                    <ChevronRightIcon className="w-4 h-4 text-gray-400"/>
                                </Link>
                            </InfoCard>

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
                                </div>
                            </InfoCard>
                        </div>
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