import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { getUserProfile, updateUserProfile, deleteAllUserData } from '../services/api';
import { useAuth } from '../context/AuthContext';

const PrivacySettings: React.FC = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
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

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profile = await getUserProfile();
      if (profile) {
        setPrivacySettings({
          dataCollection: profile.essentialDataCollection,
          analytics: profile.analyticsUsageData,
          crashReporting: profile.crashReporting,
          locationTracking: profile.locationTracking,
          healthDataSharing: profile.healthDataSharing,
          marketingData: profile.marketingData,
          thirdPartySharing: profile.thirdPartySharing,
          dataRetention: '2 years',
          accountDeletion: false
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (key: string, value: any) => {
    setPrivacySettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateUserProfile({
        essentialDataCollection: privacySettings.dataCollection,
        analyticsUsageData: privacySettings.analytics,
        crashReporting: privacySettings.crashReporting,
        locationTracking: privacySettings.locationTracking,
        healthDataSharing: privacySettings.healthDataSharing,
        marketingData: privacySettings.marketingData,
        thirdPartySharing: privacySettings.thirdPartySharing,
      });
      alert('Privacy settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      alert('Please type DELETE to confirm');
      return;
    }
    
    try {
      await deleteAllUserData();
      await signOut();
      navigate('/splash');
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account. Please try again.');
    }
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

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark">
        <Header title="" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-foreground-light dark:text-foreground-dark">Loading settings...</div>
        </div>
      </div>
    );
  }

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
              {!showDeleteConfirm ? (
                <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div>
                    <h3 className="text-base font-semibold text-red-600 dark:text-red-400">Delete Account</h3>
                    <p className="text-sm text-red-500 dark:text-red-500">Permanently delete your account and all data</p>
                  </div>
                  <button 
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              ) : (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <h3 className="text-base font-semibold text-red-600 dark:text-red-400 mb-2">Are you sure?</h3>
                  <p className="text-sm text-red-500 dark:text-red-500 mb-4">
                    This will permanently delete all your data including pets, symptom logs, and medications. This cannot be undone.
                  </p>
                  <p className="text-sm text-red-600 dark:text-red-400 mb-2">Type DELETE to confirm:</p>
                  <input
                    type="text"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    className="w-full px-3 py-2 mb-3 bg-white dark:bg-gray-800 border border-red-300 dark:border-red-700 rounded-lg text-foreground-light dark:text-foreground-dark"
                    placeholder="Type DELETE"
                  />
                  <div className="flex gap-2">
                    <button 
                      onClick={handleDeleteAccount}
                      disabled={deleteConfirmText !== 'DELETE'}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-red-300 disabled:cursor-not-allowed"
                    >
                      Confirm Delete
                    </button>
                    <button 
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setDeleteConfirmText('');
                      }}
                      className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleSave}
              disabled={saving || loading}
              className="flex-1 bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30 disabled:bg-primary/50"
            >
              {saving ? 'Saving...' : 'Save Privacy Settings'}
            </button>
            <button 
              onClick={() => navigate('/export-data')}
              className="flex-1 bg-card-light dark:bg-card-dark text-foreground-light dark:text-foreground-dark border border-border-light dark:border-border-dark font-bold py-3 px-4 rounded-lg hover:bg-background-light dark:hover:bg-background-dark transition-colors"
            >
              Export Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettings;
