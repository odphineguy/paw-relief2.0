import React, { useState } from 'react';
import Header from '../components/Header';

const PrivacySettings: React.FC = () => {
  const [privacySettings, setPrivacySettings] = useState({
    dataCollection: true,
    analytics: false,
    crashReporting: true,
    locationTracking: false,
    healthDataSharing: false,
    marketingData: false,
    thirdPartySharing: false,
    dataRetention: '2 years',
    accountDeletion: false
  });

  const handleSettingChange = (key: string, value: any) => {
    setPrivacySettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    console.log('Saving privacy settings:', privacySettings);
    // Add save logic here
  };

  const PrivacyToggle = ({ 
    settingKey, 
    title, 
    description, 
    enabled 
  }: { 
    settingKey: string; 
    title: string; 
    description: string; 
    enabled: boolean; 
  }) => (
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-semibold text-foreground-light dark:text-foreground-dark">{title}</h3>
        <p className="text-sm text-subtle-light dark:text-subtle-dark">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => handleSettingChange(settingKey, !enabled)}
        className="shrink-0 relative"
        style={{ width: '51px', height: '31px' }}
      >
        {/* Track */}
        <div 
          className="absolute inset-0 rounded-full transition-colors duration-200"
          style={{ backgroundColor: enabled ? '#3b82f6' : '#d1d5db' }}
        />
        {/* Knob */}
        <div 
          className="absolute top-[2px] rounded-full bg-white shadow-md transition-transform duration-200"
          style={{ 
            width: '27px', 
            height: '27px',
            left: '2px',
            transform: enabled ? 'translateX(20px)' : 'translateX(0px)'
          }}
        />
      </button>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark">
      <Header title="" />
      
      <div className="flex-1 px-4 pb-28 overflow-y-auto">
        <div className="space-y-6">
          {/* Data Collection */}
          <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-foreground-light dark:text-foreground-dark mb-4">Data Collection</h2>
            
            <div className="space-y-4">
              <PrivacyToggle
                settingKey="dataCollection"
                title="Essential Data Collection"
                description="Collect data necessary for app functionality"
                enabled={privacySettings.dataCollection}
              />
              
              <PrivacyToggle
                settingKey="analytics"
                title="Analytics & Usage Data"
                description="Help us improve the app by sharing usage statistics"
                enabled={privacySettings.analytics}
              />
              
              <PrivacyToggle
                settingKey="crashReporting"
                title="Crash Reporting"
                description="Automatically report crashes to help fix issues"
                enabled={privacySettings.crashReporting}
              />
            </div>
          </div>

          {/* Location & Tracking */}
          <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-foreground-light dark:text-foreground-dark mb-4">Location & Tracking</h2>
            
            <div className="space-y-4">
              <PrivacyToggle
                settingKey="locationTracking"
                title="Location Tracking"
                description="Track location for weather alerts and local vet recommendations"
                enabled={privacySettings.locationTracking}
              />
            </div>
          </div>

          {/* Health Data */}
          <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-foreground-light dark:text-foreground-dark mb-4">Health Data</h2>
            
            <div className="space-y-4">
              <PrivacyToggle
                settingKey="healthDataSharing"
                title="Health Data Sharing"
                description="Share anonymized health data for research purposes"
                enabled={privacySettings.healthDataSharing}
              />
              
              <PrivacyToggle
                settingKey="marketingData"
                title="Marketing Data"
                description="Use data for personalized marketing and recommendations"
                enabled={privacySettings.marketingData}
              />
            </div>
          </div>

          {/* Third Party Sharing */}
          <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-foreground-light dark:text-foreground-dark mb-4">Third Party Sharing</h2>
            
            <div className="space-y-4">
              <PrivacyToggle
                settingKey="thirdPartySharing"
                title="Third Party Data Sharing"
                description="Share data with trusted partners for enhanced services"
                enabled={privacySettings.thirdPartySharing}
              />
            </div>
          </div>

          {/* Data Retention */}
          <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-foreground-light dark:text-foreground-dark mb-4">Data Retention</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground-light dark:text-foreground-dark mb-2">
                  Data Retention Period
                </label>
                <select
                  value={privacySettings.dataRetention}
                  onChange={(e) => handleSettingChange('dataRetention', e.target.value)}
                  className="w-full px-4 py-3 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg text-foreground-light dark:text-foreground-dark focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="1 year">1 year</option>
                  <option value="2 years">2 years</option>
                  <option value="5 years">5 years</option>
                  <option value="Indefinitely">Indefinitely</option>
                </select>
                <p className="text-xs text-subtle-light dark:text-subtle-dark mt-2">
                  How long we keep your data after account deletion
                </p>
              </div>
            </div>
          </div>

          {/* Account Management */}
          <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-foreground-light dark:text-foreground-dark mb-4">Account Management</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div>
                  <h3 className="text-base font-semibold text-red-600 dark:text-red-400">Delete Account</h3>
                  <p className="text-sm text-red-500 dark:text-red-500">Permanently delete your account and all data</p>
                </div>
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  Delete
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleSave}
              className="flex-1 bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30"
            >
              Save Privacy Settings
            </button>
            <button className="flex-1 bg-card-light dark:bg-card-dark text-foreground-light dark:text-foreground-dark border border-border-light dark:border-border-dark font-bold py-3 px-4 rounded-lg hover:bg-background-light dark:hover:bg-background-dark transition-colors">
              Export Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettings;
