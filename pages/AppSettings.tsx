import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const AppSettings: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Handle logout logic here
    console.log('Logging out...');
    // You can add your logout logic here
  };

  const SettingsSection = ({ icon, title, subtitle, onClick }: {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 bg-card-light dark:bg-card-dark rounded-xl shadow-sm hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors"
    >
      <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg shrink-0">
        {icon}
      </div>
      <div className="flex-1 text-left">
        <h3 className="text-base font-semibold text-foreground-light dark:text-foreground-dark">{title}</h3>
        <p className="text-sm text-subtle-light dark:text-subtle-dark">{subtitle}</p>
      </div>
      <div className="text-subtle-light dark:text-subtle-dark">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );

  const LogoutButton = () => (
    <button
      onClick={handleLogout}
      className="w-full flex items-center gap-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors mt-6"
    >
      <div className="flex items-center justify-center w-10 h-10 bg-red-100 dark:bg-red-900/40 rounded-lg shrink-0">
        <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      </div>
      <div className="flex-1 text-left">
        <h3 className="text-base font-semibold text-red-600 dark:text-red-400">Logout</h3>
        <p className="text-sm text-red-500 dark:text-red-500">Sign out of your account</p>
      </div>
    </button>
  );

  return (
    <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark">
      <Header title="" />
      
      <div className="flex-1 px-4 pb-28 overflow-y-auto">
        {/* Account Section */}
        <div className="mb-8">
          <h2 className="text-xl text-foreground-light dark:text-foreground-dark mb-4">Account</h2>
          <div className="space-y-3">
            <SettingsSection
              icon={
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
              title="Personal Information"
              subtitle="Manage your details"
              onClick={() => navigate('/personal-information')}
            />
            <SettingsSection
              icon={
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
              title="Password"
              subtitle="Change your password"
              onClick={() => navigate('/password-settings')}
            />
          </div>
        </div>

        {/* Preferences Section */}
        <div className="mb-8">
          <h2 className="text-xl text-foreground-light dark:text-foreground-dark mb-4">Preferences</h2>
          <div className="space-y-3">
            <SettingsSection
              icon={
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
              title="App Preferences"
              subtitle="Customize your experience"
              onClick={() => navigate('/app-preferences')}
            />
            <SettingsSection
              icon={
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 0 0-15 0v5h5l-5 5-5-5h5v-5a10 10 0 0 1 20 0v5z" />
                </svg>
              }
              title="Notifications"
              subtitle="Manage notification settings"
              onClick={() => navigate('/notification-settings')}
            />
          </div>
        </div>

        {/* Privacy & Data Section */}
        <div className="mb-8">
          <h2 className="text-xl text-foreground-light dark:text-foreground-dark mb-4">Privacy & Data</h2>
          <div className="space-y-3">
            <SettingsSection
              icon={
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              }
              title="Privacy Settings"
              subtitle="Manage your privacy settings"
              onClick={() => navigate('/privacy-settings')}
            />
            <SettingsSection
              icon={
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
              title="Export Data"
              subtitle="Download your information"
              onClick={() => navigate('/export-data')}
            />
          </div>
        </div>

        {/* Help & Support Section */}
        <div className="mb-8">
          <h2 className="text-xl text-foreground-light dark:text-foreground-dark mb-4">Help & Support</h2>
          <div className="space-y-3">
            <SettingsSection
              icon={
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              title="FAQs"
              subtitle="Find answers to common questions"
              onClick={() => navigate('/faqs')}
            />
            <SettingsSection
              icon={
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
              title="Contact Us"
              subtitle="Get in touch with our support team"
              onClick={() => navigate('/contact-us')}
            />
            <SettingsSection
              icon={
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              }
              title="User Guides"
              subtitle="Learn how to use the app"
              onClick={() => navigate('/user-guides')}
            />
            <SettingsSection
              icon={
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
              title="Terms & Privacy"
              subtitle="Read our policies"
              onClick={() => navigate('/terms-and-privacy')}
            />
          </div>
        </div>

        {/* Logout Button */}
        <LogoutButton />
      </div>
    </div>
  );
};

export default AppSettings;
