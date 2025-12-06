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
        onClick={() => handleNotificationChange(settingKey, !enabled)}
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
          {/* Health & Medical Notifications */}
          <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-foreground-light dark:text-foreground-dark mb-4">Health & Medical</h2>
            
            <div className="space-y-4">
              <NotificationToggle
                settingKey="medicationReminders"
                title="Medication Reminders"
                description="Get notified when it's time for medication"
                enabled={notifications.medicationReminders}
              />
              
              <NotificationToggle
                settingKey="appointmentReminders"
                title="Appointment Reminders"
                description="Reminders for vet appointments and checkups"
                enabled={notifications.appointmentReminders}
              />
              
              <NotificationToggle
                settingKey="healthAlerts"
                title="Health Alerts"
                description="Important health notifications and warnings"
                enabled={notifications.healthAlerts}
              />
              
              <NotificationToggle
                settingKey="weeklyReports"
                title="Weekly Health Reports"
                description="Weekly summary of your dog's health data"
                enabled={notifications.weeklyReports}
              />
              
              <NotificationToggle
                settingKey="emergencyAlerts"
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
                settingKey="systemUpdates"
                title="System Updates"
                description="Notifications about app updates and new features"
                enabled={notifications.systemUpdates}
              />
              
              <NotificationToggle
                settingKey="marketingEmails"
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
                settingKey="pushNotifications"
                title="Push Notifications"
                description="Receive notifications on your device"
                enabled={notifications.pushNotifications}
              />
              
              <NotificationToggle
                settingKey="emailNotifications"
                title="Email Notifications"
                description="Receive notifications via email"
                enabled={notifications.emailNotifications}
              />
              
              <NotificationToggle
                settingKey="smsNotifications"
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
