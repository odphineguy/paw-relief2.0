import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { exportUserData, UserDataExport } from '../services/api';

const ExportData: React.FC = () => {
  const navigate = useNavigate();
  const [exportSettings, setExportSettings] = useState({
    includeHealthData: true,
    includeMedicationHistory: true,
    includeAppointmentHistory: true,
    includePhotos: false,
    includeNotes: true,
    dateRange: 'all',
    format: 'JSON'
  });

  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  const handleSettingChange = (key: string, value: any) => {
    setExportSettings(prev => ({ ...prev, [key]: value }));
  };

  const downloadFile = (data: UserDataExport, format: string) => {
    let content: string;
    let mimeType: string;
    let fileExtension: string;

    if (format === 'JSON') {
      content = JSON.stringify(data, null, 2);
      mimeType = 'application/json';
      fileExtension = 'json';
    } else if (format === 'CSV') {
      // Convert to CSV format
      content = convertToCSV(data);
      mimeType = 'text/csv';
      fileExtension = 'csv';
    } else {
      // For PDF, we'll just use JSON for now (PDF generation would need a library)
      content = JSON.stringify(data, null, 2);
      mimeType = 'application/json';
      fileExtension = 'json';
    }

    // Create blob and download
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `paw-relief-data-${new Date().toISOString().split('T')[0]}.${fileExtension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const convertToCSV = (data: UserDataExport): string => {
    const lines: string[] = [];
    
    // User info
    lines.push('=== USER INFO ===');
    lines.push(`Email,${data.user.email}`);
    lines.push(`Account Created,${data.user.createdAt}`);
    lines.push(`Export Date,${data.exportDate}`);
    lines.push('');

    // Dogs
    lines.push('=== PETS ===');
    lines.push('Name,Breed,Age,Weight,Birthday,Known Allergies');
    data.dogs.forEach(dog => {
      lines.push(`${dog.name},${dog.breed},${dog.age},${dog.weight},${dog.birthday},"${(dog.knownAllergies || []).join(', ')}"`);
    });
    lines.push('');

    // Symptom Logs
    lines.push('=== SYMPTOM LOGS ===');
    lines.push('Date,Symptom Type,Severity,Notes');
    data.symptomLogs.forEach(log => {
      lines.push(`${log.createdAt},${log.symptomType},${log.severity},"${log.notes || ''}"`);
    });
    lines.push('');

    // Trigger Logs
    lines.push('=== TRIGGER LOGS ===');
    lines.push('Date,Trigger Type,Location,Weather,Pollen Level,Notes');
    data.triggerLogs.forEach(log => {
      lines.push(`${log.loggedDate},${log.triggerType},${log.location || ''},${log.weatherConditions || ''},${log.pollenLevel || ''},"${log.notes || ''}"`);
    });
    lines.push('');

    // Reminders
    lines.push('=== MEDICATIONS & REMINDERS ===');
    lines.push('Name,Type,Dosage,Next Due,Repeat Interval,Completed');
    data.reminders.forEach(reminder => {
      lines.push(`${reminder.name},${reminder.type},${reminder.dosage || ''},${reminder.nextDue},${reminder.repeatInterval || 'none'},${reminder.completed}`);
    });

    return lines.join('\n');
  };

  const handleExport = async () => {
    setIsExporting(true);
    setExportComplete(false);
    
    try {
      const data = await exportUserData();
      downloadFile(data, exportSettings.format);
      setExportComplete(true);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const DataOption = ({ 
    key, 
    title, 
    description, 
    enabled,
    size 
  }: { 
    key: string; 
    title: string; 
    description: string; 
    enabled: boolean;
    size?: string;
  }) => (
    <div className="flex items-center justify-between p-4 bg-background-light dark:bg-background-dark rounded-lg border border-border-light dark:border-border-dark">
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => handleSettingChange(key, e.target.checked)}
            className="w-4 h-4 text-primary bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark rounded focus:ring-primary focus:ring-2"
          />
          <div>
            <h3 className="text-base font-semibold text-foreground-light dark:text-foreground-dark">{title}</h3>
            <p className="text-sm text-subtle-light dark:text-subtle-dark">{description}</p>
            {size && <p className="text-xs text-subtle-light dark:text-subtle-dark mt-1">Size: {size}</p>}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark">
      <Header title="" />
      
      <div className="flex-1 px-4 pb-28 overflow-y-auto">
        <div className="space-y-6">
          {/* Export Information */}
          <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-foreground-light dark:text-foreground-dark mb-4">Export Your Data</h2>
            <p className="text-subtle-light dark:text-subtle-dark mb-4">
              Download a copy of your data in a portable format. You can choose what to include and the format you prefer.
            </p>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200">Data Export Information</h3>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    Your exported data will be available for download for 7 days. Make sure to download it before the link expires.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Data Selection */}
          <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-foreground-light dark:text-foreground-dark mb-4">Select Data to Export</h2>
            
            <div className="space-y-3">
              <DataOption
                key="includeHealthData"
                title="Health Records"
                description="Symptom logs, health assessments, and medical history"
                enabled={exportSettings.includeHealthData}
                size="2.3 MB"
              />
              
              <DataOption
                key="includeMedicationHistory"
                title="Medication History"
                description="Medication logs, reminders, and dosage information"
                enabled={exportSettings.includeMedicationHistory}
                size="856 KB"
              />
              
              <DataOption
                key="includeAppointmentHistory"
                title="Appointment History"
                description="Vet appointments, checkups, and visit records"
                enabled={exportSettings.includeAppointmentHistory}
                size="1.2 MB"
              />
              
              <DataOption
                key="includePhotos"
                title="Photos & Media"
                description="All uploaded photos and media files"
                enabled={exportSettings.includePhotos}
                size="45.7 MB"
              />
              
              <DataOption
                key="includeNotes"
                title="Notes & Observations"
                description="Personal notes, observations, and comments"
                enabled={exportSettings.includeNotes}
                size="324 KB"
              />
            </div>
          </div>

          {/* Export Settings */}
          <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-foreground-light dark:text-foreground-dark mb-4">Export Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground-light dark:text-foreground-dark mb-2">
                  Date Range
                </label>
                <select
                  value={exportSettings.dateRange}
                  onChange={(e) => handleSettingChange('dateRange', e.target.value)}
                  className="w-full px-4 py-3 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg text-foreground-light dark:text-foreground-dark focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="all">All Time</option>
                  <option value="last30days">Last 30 Days</option>
                  <option value="last6months">Last 6 Months</option>
                  <option value="lastyear">Last Year</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground-light dark:text-foreground-dark mb-2">
                  Export Format
                </label>
                <select
                  value={exportSettings.format}
                  onChange={(e) => handleSettingChange('format', e.target.value)}
                  className="w-full px-4 py-3 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg text-foreground-light dark:text-foreground-dark focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="JSON">JSON (Machine readable)</option>
                  <option value="CSV">CSV (Spreadsheet compatible)</option>
                  <option value="PDF">PDF (Human readable)</option>
                </select>
                <p className="text-xs text-subtle-light dark:text-subtle-dark mt-2">
                  JSON is recommended for importing into other apps, CSV for spreadsheets, PDF for reading
                </p>
              </div>
            </div>
          </div>

          {/* Export Summary */}
          <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-foreground-light dark:text-foreground-dark mb-4">Export Summary</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-subtle-light dark:text-subtle-dark">Selected data types:</span>
                <span className="font-semibold text-foreground-light dark:text-foreground-dark">
                  {Object.values(exportSettings).filter(v => v === true).length} of 5
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-subtle-light dark:text-subtle-dark">Estimated size:</span>
                <span className="font-semibold text-foreground-light dark:text-foreground-dark">~50.2 MB</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-subtle-light dark:text-subtle-dark">Format:</span>
                <span className="font-semibold text-foreground-light dark:text-foreground-dark">{exportSettings.format}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-subtle-light dark:text-subtle-dark">Date range:</span>
                <span className="font-semibold text-foreground-light dark:text-foreground-dark">
                  {exportSettings.dateRange === 'all' ? 'All Time' : exportSettings.dateRange}
                </span>
              </div>
            </div>
          </div>

          {exportComplete && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="text-sm font-semibold text-green-800 dark:text-green-200">Export Complete!</h3>
                  <p className="text-xs text-green-700 dark:text-green-300">Your data has been downloaded to your device.</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="flex-1 bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30 disabled:bg-primary/50 disabled:cursor-not-allowed"
            >
              {isExporting ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Downloading...
                </div>
              ) : (
                <>
                  <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download My Data
                </>
              )}
            </button>
            <button 
              onClick={() => navigate(-1)}
              className="flex-1 bg-card-light dark:bg-card-dark text-foreground-light dark:text-foreground-dark border border-border-light dark:border-border-dark font-bold py-3 px-4 rounded-lg hover:bg-background-light dark:hover:bg-background-dark transition-colors"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportData;
