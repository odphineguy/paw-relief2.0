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
      <div className="flex items-center justify-center w-12 h-12 bg-blue-500 dark:bg-blue-600 rounded-lg shrink-0">
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
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
              title="Personal Information"
              subtitle="Manage your details"
              onClick={() => navigate('/personal-information')}
            />
            <SettingsSection
              icon={
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              }
              title="Privacy Settings"
              subtitle="Manage your privacy settings"
              onClick={() => navigate('/privacy-settings')}
            />
            <SettingsSection
              icon={
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
              title="Export Data"
              subtitle="Download your information"
              onClick={() => navigate('/export-data')}
            />
          </div>
        </div>

        {/* Support */}
        <div className="mb-8">
          <h2 className="text-xl text-foreground-light dark:text-foreground-dark mb-4">Support</h2>
          <div className="space-y-3">
            <a
              href="https://pawrelief.app"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center gap-4 p-4 bg-card-light dark:bg-card-dark rounded-xl shadow-sm hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-blue-500 dark:bg-blue-600 rounded-lg shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m-4 4h8m-4 8h8m-4-4h8" />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-base font-semibold text-foreground-light dark:text-foreground-dark">Open Help Center</h3>
                <p className="text-sm text-subtle-light dark:text-subtle-dark">Visit the landing site for FAQs and policies</p>
              </div>
              <div className="text-subtle-light dark:text-subtle-dark">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </a>
          </div>
        </div>

        {/* Logout Button */}
        <LogoutButton />
      </div>
    </div>
  );
};

export default AppSettings;
