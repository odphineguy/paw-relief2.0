import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDogs } from '../context/DogContext';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import { DogIcon, ChevronRightIcon, UserIcon, ActivityIcon, FileTextIcon, ScanEyeIcon } from '../components/icons';
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
            <div className="flex flex-col h-full bg-background-light dark:bg-background-dark font-body">
                <Header title="Profile" showBackButton={false} />
                <div className="flex-1 p-4 space-y-6 overflow-y-auto pb-24">
                    
                    {/* Pet Profile Hero */}
                    {loading ? (
                         <div className="flex justify-center py-8">
                            <DogIcon className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : selectedDog ? (
                        <div className="bg-white dark:bg-card-dark rounded-lg border border-border-light dark:border-border-dark overflow-hidden">
                            <div className="h-24 bg-slate-100 dark:bg-slate-800 relative">
                                <div className="absolute -bottom-12 left-4">
                                     <img 
                                        src={selectedDog.photoUrl} 
                                        alt={selectedDog.name} 
                                        className="w-24 h-24 rounded-xl border-4 border-white dark:border-card-dark object-cover bg-white"
                                    />
                                </div>
                            </div>
                            <div className="pt-14 px-4 pb-4">
                                <div className="flex justify-between items-start mb-1">
                                    <div>
                                        <h2 className="text-2xl font-display font-bold text-foreground-light dark:text-foreground-dark leading-tight">
                                            {selectedDog.name}
                                        </h2>
                                        <p className="text-sm font-medium text-subtle-light dark:text-subtle-dark">
                                            {selectedDog.breed}
                                        </p>
                                    </div>
                                    <button 
                                        onClick={() => navigate('/create-dog-profile')}
                                        className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-border-light dark:border-border-dark rounded text-xs font-semibold transition-colors text-foreground-light dark:text-foreground-dark"
                                    >
                                        Edit
                                    </button>
                                </div>
                                <p className="text-xs text-subtle-light dark:text-subtle-dark mb-4">
                                    {getBirthdayInfo(selectedDog.birthday).age} • Next Birthday: {getBirthdayInfo(selectedDog.birthday).next}
                                </p>

                                {selectedDog.knownAllergies && selectedDog.knownAllergies.length > 0 && (
                                    <div className="pt-3 border-t border-border-light dark:border-border-dark">
                                        <p className="text-[10px] font-bold uppercase text-subtle-light tracking-widest mb-2">Medical Alerts</p>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedDog.knownAllergies.map(allergy => (
                                                <span key={allergy} className="px-2 py-1 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded text-xs font-semibold border border-red-100 dark:border-red-900/30 flex items-center gap-1">
                                                    <AlertTriangleIcon className="w-3 h-3" />
                                                    {allergy}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8 bg-white dark:bg-card-dark rounded-lg border border-border-light dark:border-border-dark border-dashed">
                             <DogIcon className="w-12 h-12 text-subtle-light mx-auto mb-3" />
                             <p className="text-subtle-light mb-4 text-sm">No pet profile active</p>
                             <button
                                onClick={() => navigate('/create-dog-profile')}
                                className="px-4 py-2 bg-primary text-white rounded-lg font-medium shadow-sm hover:bg-primary-hover text-sm"
                             >
                                Add Pet
                            </button>
                        </div>
                    )}

                    {/* Tools Section */}
                    <Section title="Clinical Tools">
                        <ToolButton 
                            icon={<FileTextIcon className="w-5 h-5" />}
                            label="Veterinary Report"
                            description="Generate health summary PDF"
                            onClick={() => navigate('/report')}
                        />
                        <ToolButton 
                            icon={<ScanEyeIcon className="w-5 h-5" />}
                            label="Ingredient Scanner"
                            description="Analyze food labels"
                            onClick={() => setIsScannerOpen(true)}
                        />
                    </Section>

                    {/* Settings Section */}
                    <Section title="System">
                        <div className="bg-white dark:bg-card-dark rounded-lg border border-border-light dark:border-border-dark divide-y divide-border-light dark:divide-border-dark">
                            <div className="p-3 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-1.5 rounded bg-slate-100 dark:bg-slate-800 text-subtle-light">
                                        <UserIcon className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-foreground-light dark:text-foreground-dark">Dark Mode</p>
                                    </div>
                                </div>
                                <ThemeSwitch />
                            </div>
                            <a 
                                href="https://pawrelief.app" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="p-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            >
                                 <div className="flex items-center gap-3">
                                    <div className="p-1.5 rounded bg-slate-100 dark:bg-slate-800 text-subtle-light">
                                        <ActivityIcon className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-foreground-light dark:text-foreground-dark">Help & Support</p>
                                    </div>
                                </div>
                                <ChevronRightIcon className="w-4 h-4 text-subtle-light" />
                            </a>
                        </div>
                    </Section>

                    {/* Account Actions */}
                    <div className="pt-4">
                        <button
                            onClick={handleSignOut}
                            className="w-full p-4 flex items-center justify-center gap-2 text-red-600 dark:text-red-400 font-medium hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors"
                        >
                            Sign Out
                        </button>
                        <p className="text-center text-xs text-subtle-light mt-4">
                            Paw Relief v2.0
                        </p>
                    </div>

                </div>
            </div>
            <BarcodeScannerModal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} />
        </>
    );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="space-y-2">
        <h3 className="text-xs font-bold text-subtle-light dark:text-subtle-dark uppercase tracking-wider px-1">{title}</h3>
        <div className="space-y-2">{children}</div>
    </div>
);

const ToolButton: React.FC<{ icon: React.ReactNode; label: string; description: string; onClick: () => void }> = ({ icon, label, description, onClick }) => (
    <button 
        onClick={onClick}
        className="w-full bg-white dark:bg-card-dark p-3 rounded-lg border border-border-light dark:border-border-dark hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-3 text-left group"
    >
        <div className="p-2 rounded bg-slate-100 dark:bg-slate-800 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
            {icon}
        </div>
        <div className="flex-1">
            <h4 className="text-sm font-bold text-foreground-light dark:text-foreground-dark">{label}</h4>
            <p className="text-xs text-subtle-light dark:text-subtle-dark">{description}</p>
        </div>
        <ChevronRightIcon className="w-4 h-4 text-subtle-light group-hover:text-primary transition-colors" />
    </button>
);

export default Profile;