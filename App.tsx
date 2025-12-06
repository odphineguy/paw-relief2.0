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
import TriggerAnalysis from './pages/TriggerAnalysis';
import LogEntry from './pages/LogEntry';
import Splash from './pages/Splash';
import Testimonials from './pages/Testimonials';
import LoginSignup from './pages/LoginSignup';
import Onboarding from './pages/Onboarding';
import Welcome from './pages/Welcome';
import Subscription from './pages/Subscription';
import ResetPassword from './pages/ResetPassword';
import BottomNav from './components/BottomNav';
import ProtectedRoute from './components/ProtectedRoute';
import { DogProvider } from './context/DogContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

const App: React.FC = () => {
    return (
        <ThemeProvider>
            <AuthProvider>
                <DogProvider>
                    <HashRouter>
                    <div className="min-h-screen bg-background-light dark:bg-background-dark text-foreground-light dark:text-foreground-dark flex flex-col font-display">
                        <main className="flex-grow pb-20">
                            <div className="max-w-md mx-auto bg-background-light dark:bg-background-dark h-full min-h-screen">
                                <Routes>
                                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                                    <Route path="/splash" element={<Splash />} />
                                    <Route path="/testimonials" element={<Testimonials />} />
                                    <Route path="/login" element={<LoginSignup />} />
                                    <Route path="/onboarding" element={<Onboarding />} />
                                    <Route path="/welcome" element={<Welcome />} />
                                    <Route path="/subscription" element={<Subscription />} />
                                    <Route path="/reset-password" element={<ResetPassword />} />
                                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                                    <Route path="/logs" element={<ProtectedRoute><Logs /></ProtectedRoute>} />
                                    <Route path="/meds" element={<ProtectedRoute><Meds /></ProtectedRoute>} />
                                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                                    <Route path="/log-entry" element={<ProtectedRoute><LogEntry /></ProtectedRoute>} />
                                    <Route path="/report" element={<ProtectedRoute><VetReport /></ProtectedRoute>} />
                                    <Route path="/app-settings" element={<ProtectedRoute><AppSettings /></ProtectedRoute>} />
                                    <Route path="/personal-information" element={<ProtectedRoute><PersonalInformation /></ProtectedRoute>} />
                                    <Route path="/password-settings" element={<ProtectedRoute><PasswordSettings /></ProtectedRoute>} />
                                    <Route path="/app-preferences" element={<ProtectedRoute><AppPreferences /></ProtectedRoute>} />
                                    <Route path="/notification-settings" element={<ProtectedRoute><NotificationSettings /></ProtectedRoute>} />
                                    <Route path="/privacy-settings" element={<ProtectedRoute><PrivacySettings /></ProtectedRoute>} />
                                    <Route path="/export-data" element={<ProtectedRoute><ExportData /></ProtectedRoute>} />
                                    <Route path="/faqs" element={<ProtectedRoute><FAQs /></ProtectedRoute>} />
                                    <Route path="/contact-us" element={<ProtectedRoute><ContactUs /></ProtectedRoute>} />
                                    <Route path="/user-guides" element={<ProtectedRoute><UserGuides /></ProtectedRoute>} />
                                    <Route path="/terms-and-privacy" element={<ProtectedRoute><TermsAndPrivacy /></ProtectedRoute>} />
                                    <Route path="/create-dog-profile" element={<ProtectedRoute><CreateDogProfile /></ProtectedRoute>} />
                                    <Route path="/trigger-detective" element={<ProtectedRoute><TriggerDetective /></ProtectedRoute>} />
                                    <Route path="/trigger-analysis" element={<ProtectedRoute><TriggerAnalysis /></ProtectedRoute>} />
                                </Routes>
                            </div>
                        </main>
                        <BottomNav />
                    </div>
                </HashRouter>
                </DogProvider>
            </AuthProvider>
        </ThemeProvider>
    );
};

export default App;