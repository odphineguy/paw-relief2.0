import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Logs from './pages/Logs';
import Meds from './pages/Meds';
import Profile from './pages/Profile';
import VetReport from './pages/VetReport';
import AppSettings from './pages/AppSettings';
import PersonalInformation from './pages/PersonalInformation';
import PasswordSettings from './pages/PasswordSettings';
import AppPreferences from './pages/AppPreferences';
import NotificationSettings from './pages/NotificationSettings';
import PrivacySettings from './pages/PrivacySettings';
import ExportData from './pages/ExportData';
import FAQs from './pages/FAQs';
import ContactUs from './pages/ContactUs';
import UserGuides from './pages/UserGuides';
import TermsAndPrivacy from './pages/TermsAndPrivacy';
import Login from './pages/Login';
import CreateDogProfile from './pages/CreateDogProfile';
import TriggerDetective from './pages/TriggerDetective';
import AllergenAlerts from './pages/AllergenAlerts';
import BottomNav from './components/BottomNav';
import { DogProvider } from './context/DogContext';
import { ThemeProvider } from './context/ThemeContext';

const App: React.FC = () => {
    return (
        <ThemeProvider>
            <DogProvider>
                <HashRouter>
                    <div className="min-h-screen bg-background-light dark:bg-background-dark text-foreground-light dark:text-foreground-dark flex flex-col font-display">
                        <main className="flex-grow pb-20">
                            <div className="max-w-md mx-auto bg-background-light dark:bg-background-dark h-full min-h-screen">
                                <Routes>
                                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                                    <Route path="/dashboard" element={<Dashboard />} />
                                    <Route path="/logs" element={<Logs />} />
                                    <Route path="/meds" element={<Meds />} />
                                    <Route path="/profile" element={<Profile />} />
                                    <Route path="/report" element={<VetReport />} />
                                    <Route path="/app-settings" element={<AppSettings />} />
                                    <Route path="/personal-information" element={<PersonalInformation />} />
                                    <Route path="/password-settings" element={<PasswordSettings />} />
                                    <Route path="/app-preferences" element={<AppPreferences />} />
                                    <Route path="/notification-settings" element={<NotificationSettings />} />
                                    <Route path="/privacy-settings" element={<PrivacySettings />} />
                                    <Route path="/export-data" element={<ExportData />} />
                                    <Route path="/faqs" element={<FAQs />} />
                                    <Route path="/contact-us" element={<ContactUs />} />
                                    <Route path="/user-guides" element={<UserGuides />} />
                                    <Route path="/terms-and-privacy" element={<TermsAndPrivacy />} />
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/create-dog-profile" element={<CreateDogProfile />} />
                                    <Route path="/trigger-detective" element={<TriggerDetective />} />
                                    <Route path="/allergen-alerts" element={<AllergenAlerts />} />
                                </Routes>
                            </div>
                        </main>
                        <BottomNav />
                    </div>
                </HashRouter>
            </DogProvider>
        </ThemeProvider>
    );
};

export default App;