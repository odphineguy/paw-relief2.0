import React, { useState } from 'react';
import Header from '../components/Header';

const NotificationSettings: React.FC = () => {
  const [notifications, setNotifications] = useState({
    medicationReminders: true,
    appointmentReminders: true,
    healthAlerts: true,
    weeklyReports: false,
    emergencyAlerts: true,
    systemUpdates: false,
    marketingEmails: false,
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false
  });

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    console.log('Saving notification settings:', notifications);
    // Add save logic here
  };

  const NotificationToggle = ({ 
    key, 
    title, 
    description, 
    enabled 
  }: { 
    key: string; 
    title: string; 
    description: string; 
    enabled: boolean; 
  }) => (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <h3 className="text-base font-semibold text-foreground-light dark:text-foreground-dark">{title}</h3>
        <p className="text-sm text-subtle-light dark:text-subtle-dark">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => handleNotificationChange(key, e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
      </label>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark">
      <Header title="" />
      
      <div className="flex-1 px-4 pb-28 overflow-y-auto">
        <div className="space-y-6">
          {/* Health & Medical Notifications */}
          <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-foreground-light dark:text-foreground-dark mb-4">Health & Medical</h2>
            
            <div className="space-y-4">
              <NotificationToggle
                key="medicationReminders"
                title="Medication Reminders"
                description="Get notified when it's time for medication"
                enabled={notifications.medicationReminders}
              />
              
              <NotificationToggle
                key="appointmentReminders"
                title="Appointment Reminders"
                description="Reminders for vet appointments and checkups"
                enabled={notifications.appointmentReminders}
              />
              
              <NotificationToggle
                key="healthAlerts"
                title="Health Alerts"
                description="Important health notifications and warnings"
                enabled={notifications.healthAlerts}
              />
              
              <NotificationToggle
                key="weeklyReports"
                title="Weekly Health Reports"
                description="Weekly summary of your dog's health data"
                enabled={notifications.weeklyReports}
              />
              
              <NotificationToggle
                key="emergencyAlerts"
                title="Emergency Alerts"
                description="Critical health alerts and emergency notifications"
                enabled={notifications.emergencyAlerts}
              />
            </div>
          </div>

          {/* App Notifications */}
          <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-foreground-light dark:text-foreground-dark mb-4">App Notifications</h2>
            
            <div className="space-y-4">
              <NotificationToggle
                key="systemUpdates"
                title="System Updates"
                description="Notifications about app updates and new features"
                enabled={notifications.systemUpdates}
              />
              
              <NotificationToggle
                key="marketingEmails"
                title="Marketing & Tips"
                description="Helpful tips and promotional content"
                enabled={notifications.marketingEmails}
              />
            </div>
          </div>

          {/* Delivery Methods */}
          <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-foreground-light dark:text-foreground-dark mb-4">Delivery Methods</h2>
            
            <div className="space-y-4">
              <NotificationToggle
                key="pushNotifications"
                title="Push Notifications"
                description="Receive notifications on your device"
                enabled={notifications.pushNotifications}
              />
              
              <NotificationToggle
                key="emailNotifications"
                title="Email Notifications"
                description="Receive notifications via email"
                enabled={notifications.emailNotifications}
              />
              
              <NotificationToggle
                key="smsNotifications"
                title="SMS Notifications"
                description="Receive notifications via text message"
                enabled={notifications.smsNotifications}
              />
            </div>
          </div>

          {/* Notification Schedule */}
          <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-foreground-light dark:text-foreground-dark mb-4">Notification Schedule</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground-light dark:text-foreground-dark mb-2">
                  Quiet Hours
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-subtle-light dark:text-subtle-dark mb-1">Start Time</label>
                    <input
                      type="time"
                      defaultValue="22:00"
                      className="w-full px-4 py-3 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg text-foreground-light dark:text-foreground-dark focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-subtle-light dark:text-subtle-dark mb-1">End Time</label>
                    <input
                      type="time"
                      defaultValue="08:00"
                      className="w-full px-4 py-3 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg text-foreground-light dark:text-foreground-dark focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
                <p className="text-xs text-subtle-light dark:text-subtle-dark mt-2">
                  Emergency alerts will still be delivered during quiet hours
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleSave}
              className="flex-1 bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30"
            >
              Save Settings
            </button>
            <button className="flex-1 bg-card-light dark:bg-card-dark text-foreground-light dark:text-foreground-dark border border-border-light dark:border-border-dark font-bold py-3 px-4 rounded-lg hover:bg-background-light dark:hover:bg-background-dark transition-colors">
              Test Notifications
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
