import React, { useState } from 'react';
import Header from '../components/Header';
import { useTheme } from '../context/ThemeContext';

const AppPreferences: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [preferences, setPreferences] = useState({
    language: 'English',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12-hour',
    notifications: true,
    soundEffects: true,
    hapticFeedback: true,
    autoSync: true,
    dataUsage: 'WiFi Only'
  });

  const handlePreferenceChange = (key: string, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    console.log('Saving preferences:', preferences);
    // Add save logic here
  };

  return (
    <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark">
      <Header title="" />
      
      <div className="flex-1 px-4 pb-28 overflow-y-auto">
        <div className="space-y-6">
          {/* Language & Region */}
          <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-foreground-light dark:text-foreground-dark mb-4">Language & Region</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground-light dark:text-foreground-dark mb-2">
                  Language
                </label>
                <select
                  value={preferences.language}
                  onChange={(e) => handlePreferenceChange('language', e.target.value)}
                  className="w-full px-4 py-3 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg text-foreground-light dark:text-foreground-dark focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground-light dark:text-foreground-dark mb-2">
                  Date Format
                </label>
                <select
                  value={preferences.dateFormat}
                  onChange={(e) => handlePreferenceChange('dateFormat', e.target.value)}
                  className="w-full px-4 py-3 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg text-foreground-light dark:text-foreground-dark focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground-light dark:text-foreground-dark mb-2">
                  Time Format
                </label>
                <select
                  value={preferences.timeFormat}
                  onChange={(e) => handlePreferenceChange('timeFormat', e.target.value)}
                  className="w-full px-4 py-3 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg text-foreground-light dark:text-foreground-dark focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="12-hour">12-hour (AM/PM)</option>
                  <option value="24-hour">24-hour</option>
                </select>
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-foreground-light dark:text-foreground-dark mb-4">Appearance</h2>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-foreground-light dark:text-foreground-dark">Theme</h3>
                <p className="text-sm text-subtle-light dark:text-subtle-dark">Choose your preferred theme</p>
              </div>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {theme === 'dark' ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  )}
                </svg>
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-foreground-light dark:text-foreground-dark mb-4">Notifications</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-foreground-light dark:text-foreground-dark">Push Notifications</h3>
                  <p className="text-sm text-subtle-light dark:text-subtle-dark">Receive notifications about reminders and updates</p>
                </div>
                <button
                  type="button"
                  onClick={() => handlePreferenceChange('notifications', !preferences.notifications)}
                  className="shrink-0 relative"
                  style={{ width: '51px', height: '31px' }}
                >
                  <div 
                    className="absolute inset-0 rounded-full transition-colors duration-200"
                    style={{ backgroundColor: preferences.notifications ? '#3b82f6' : '#d1d5db' }}
                  />
                  <div 
                    className="absolute top-[2px] rounded-full bg-white shadow-md transition-transform duration-200"
                    style={{ 
                      width: '27px', 
                      height: '27px',
                      left: '2px',
                      transform: preferences.notifications ? 'translateX(20px)' : 'translateX(0px)'
                    }}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-foreground-light dark:text-foreground-dark">Sound Effects</h3>
                  <p className="text-sm text-subtle-light dark:text-subtle-dark">Play sounds for notifications and interactions</p>
                </div>
                <button
                  type="button"
                  onClick={() => handlePreferenceChange('soundEffects', !preferences.soundEffects)}
                  className="shrink-0 relative"
                  style={{ width: '51px', height: '31px' }}
                >
                  <div 
                    className="absolute inset-0 rounded-full transition-colors duration-200"
                    style={{ backgroundColor: preferences.soundEffects ? '#3b82f6' : '#d1d5db' }}
                  />
                  <div 
                    className="absolute top-[2px] rounded-full bg-white shadow-md transition-transform duration-200"
                    style={{ 
                      width: '27px', 
                      height: '27px',
                      left: '2px',
                      transform: preferences.soundEffects ? 'translateX(20px)' : 'translateX(0px)'
                    }}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-foreground-light dark:text-foreground-dark">Haptic Feedback</h3>
                  <p className="text-sm text-subtle-light dark:text-subtle-dark">Vibrate on touch interactions</p>
                </div>
                <button
                  type="button"
                  onClick={() => handlePreferenceChange('hapticFeedback', !preferences.hapticFeedback)}
                  className="shrink-0 relative"
                  style={{ width: '51px', height: '31px' }}
                >
                  <div 
                    className="absolute inset-0 rounded-full transition-colors duration-200"
                    style={{ backgroundColor: preferences.hapticFeedback ? '#3b82f6' : '#d1d5db' }}
                  />
                  <div 
                    className="absolute top-[2px] rounded-full bg-white shadow-md transition-transform duration-200"
                    style={{ 
                      width: '27px', 
                      height: '27px',
                      left: '2px',
                      transform: preferences.hapticFeedback ? 'translateX(20px)' : 'translateX(0px)'
                    }}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Data & Sync */}
          <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-foreground-light dark:text-foreground-dark mb-4">Data & Sync</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-foreground-light dark:text-foreground-dark">Auto Sync</h3>
                  <p className="text-sm text-subtle-light dark:text-subtle-dark">Automatically sync data when connected</p>
                </div>
                <button
                  type="button"
                  onClick={() => handlePreferenceChange('autoSync', !preferences.autoSync)}
                  className="shrink-0 relative"
                  style={{ width: '51px', height: '31px' }}
                >
                  <div 
                    className="absolute inset-0 rounded-full transition-colors duration-200"
                    style={{ backgroundColor: preferences.autoSync ? '#3b82f6' : '#d1d5db' }}
                  />
                  <div 
                    className="absolute top-[2px] rounded-full bg-white shadow-md transition-transform duration-200"
                    style={{ 
                      width: '27px', 
                      height: '27px',
                      left: '2px',
                      transform: preferences.autoSync ? 'translateX(20px)' : 'translateX(0px)'
                    }}
                  />
                </button>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground-light dark:text-foreground-dark mb-2">
                  Data Usage
                </label>
                <select
                  value={preferences.dataUsage}
                  onChange={(e) => handlePreferenceChange('dataUsage', e.target.value)}
                  className="w-full px-4 py-3 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg text-foreground-light dark:text-foreground-dark focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="WiFi Only">WiFi Only</option>
                  <option value="WiFi and Cellular">WiFi and Cellular</option>
                  <option value="Cellular Only">Cellular Only</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleSave}
              className="flex-1 bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30"
            >
              Save Preferences
            </button>
            <button className="flex-1 bg-card-light dark:bg-card-dark text-foreground-light dark:text-foreground-dark border border-border-light dark:border-border-dark font-bold py-3 px-4 rounded-lg hover:bg-background-light dark:hover:bg-background-dark transition-colors">
              Reset to Default
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppPreferences;
