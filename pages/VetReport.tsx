import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDogs } from '../context/DogContext';
import { SymptomLog, Reminder } from '../types';
import { getSymptomLogs, getReminders } from '../services/api';
import { format, isWithinInterval } from 'date-fns';
import { ArrowLeftIcon, PawIcon, CalendarIcon } from '../components/icons';
import Header from '../components/Header';

type DateRangeOption = '7d' | '30d' | '90d';

interface ReportData {
    logs: SymptomLog[];
    reminders: Reminder[];
    startDate: Date;
    endDate: Date;
}

interface ReportOptions {
    symptomFrequency: boolean;
    suspectedTriggers: boolean;
    medicationAdherence: boolean;
}

const VetReport: React.FC = () => {
    const navigate = useNavigate();
    const { selectedDog } = useDogs();
    const [dateRange, setDateRange] = useState<DateRangeOption>('30d');
    const [reportOptions, setReportOptions] = useState<ReportOptions>({
        symptomFrequency: true,
        suspectedTriggers: true,
        medicationAdherence: true
    });
    const [loading, setLoading] = useState(false);
    const [reportData, setReportData] = useState<ReportData | null>(null);

    const handleGenerateReport = async () => {
        if (!selectedDog) return;
        setLoading(true);
        setReportData(null);

        try {
            const endDate = new Date();
            let startDate: Date;
            let daysToSubtract: number;
            switch (dateRange) {
                case '7d':
                    daysToSubtract = 7;
                    break;
                case '90d':
                    daysToSubtract = 90;
                    break;
                case '30d':
                default:
                    daysToSubtract = 30;
                    break;
            }
            startDate = new Date(endDate.valueOf());
            startDate.setDate(startDate.getDate() - daysToSubtract);

            const [allLogs, allReminders] = await Promise.all([
                getSymptomLogs(selectedDog.id),
                getReminders(selectedDog.id),
            ]);

            const filteredLogs = allLogs.filter(log =>
                isWithinInterval(new Date(log.createdAt), { start: startDate, end: endDate })
            );

            const filteredReminders = allReminders.filter(reminder =>
                isWithinInterval(new Date(reminder.nextDue), { start: startDate, end: endDate })
            );

            setReportData({
                logs: filteredLogs,
                reminders: filteredReminders,
                startDate,
                endDate
            });

        } catch (error) {
            console.error("Failed to generate report", error);
            alert("Could not generate the report. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSharePDF = () => {
        if (!reportData || !selectedDog) return;
        
        // Generate PDF content
        let reportText = `Vet Report for ${selectedDog.name}\n`;
        reportText += `Period: ${format(reportData.startDate, 'MMM d, yyyy')} - ${format(reportData.endDate, 'MMM d, yyyy')}\n\n`;
        
        if (reportOptions.symptomFrequency) {
            reportText += '--- SYMPTOM FREQUENCY ---\n';
            if (reportData.logs.length > 0) {
                reportData.logs.forEach(log => {
                    reportText += `${format(new Date(log.createdAt), 'MMM d')}: ${log.symptomType} (Severity: ${log.severity}/5)\n`;
                });
            } else {
                reportText += 'No symptoms logged in this period.\n';
            }
            reportText += '\n';
        }

        if (reportOptions.suspectedTriggers) {
            reportText += '--- SUSPECTED TRIGGERS ---\n';
            const allTriggers = new Set();
            reportData.logs.forEach(log => {
                log.triggers.forEach(trigger => allTriggers.add(trigger));
            });
            if (allTriggers.size > 0) {
                reportText += Array.from(allTriggers).join(', ') + '\n';
            } else {
                reportText += 'No triggers identified in this period.\n';
            }
            reportText += '\n';
        }

        if (reportOptions.medicationAdherence) {
            reportText += '--- MEDICATION ADHERENCE ---\n';
            if (reportData.reminders.length > 0) {
                reportData.reminders.forEach(reminder => {
                    reportText += `${format(new Date(reminder.nextDue), 'MMM d')}: ${reminder.name} (${reminder.completed ? 'Administered' : 'Missed'})\n`;
                });
            } else {
                reportText += 'No medications recorded in this period.\n';
            }
        }

        // For now, use the Web Share API or clipboard
        if (navigator.share) {
            navigator.share({
                title: `Vet Report for ${selectedDog.name}`,
                text: reportText,
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(reportText);
            alert('Report copied to clipboard!');
        }
    };

    const handleEmailReport = () => {
        if (!reportData || !selectedDog) return;
        
        const subject = encodeURIComponent(`Vet Report for ${selectedDog.name}`);
        const body = encodeURIComponent(`Please find the attached vet report for ${selectedDog.name} covering the period ${format(reportData.startDate, 'MMM d, yyyy')} - ${format(reportData.endDate, 'MMM d, yyyy')}.`);
        
        const mailtoLink = `mailto:?subject=${subject}&body=${body}`;
        window.open(mailtoLink, '_blank');
    };

    const toggleReportOption = (option: keyof ReportOptions) => {
        setReportOptions(prev => ({
            ...prev,
            [option]: !prev[option]
        }));
    };

    const getDateRangeLabel = (option: DateRangeOption) => {
        switch (option) {
            case '7d': return 'Last 7 Days';
            case '30d': return 'Last 30 Days';
            case '90d': return 'Last 90 Days';
            default: return 'Last 30 Days';
        }
    };

    return (
        <div className="flex flex-col h-full bg-background-light dark:bg-background-dark">
            <Header title="" showBackButton={true} />

            <div className="p-4 space-y-6">
                {/* Page Title */}
                <h1 className="text-2xl font-bold text-foreground-light dark:text-foreground-dark">Vet Report</h1>
                
                {/* Report Details Section */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-foreground-light dark:text-foreground-dark">Report Details</h2>
                    
                    {/* Date Range Selector */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground-light dark:text-foreground-dark">Date Range</label>
                        <div className="relative">
                            <select 
                                value={dateRange} 
                                onChange={(e) => setDateRange(e.target.value as DateRangeOption)}
                                className="w-full p-3 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg text-foreground-light dark:text-foreground-dark appearance-none pr-10"
                            >
                                <option value="7d">Last 7 Days</option>
                                <option value="30d">Last 30 Days</option>
                                <option value="90d">Last 90 Days</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Include in Report Options */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-foreground-light dark:text-foreground-dark">Include in Report:</h3>
                        
                        {/* Symptom Frequency Card */}
                        <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl border border-border-light dark:border-border-dark">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-foreground-light dark:text-foreground-dark">Symptom Frequency</h4>
                                        <p className="text-sm text-subtle-light dark:text-subtle-dark">Frequency of symptoms over the selected period</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => toggleReportOption('symptomFrequency')}
                                    className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                                        reportOptions.symptomFrequency 
                                            ? 'bg-primary border-primary' 
                                            : 'border-border-light dark:border-border-dark'
                                    }`}
                                >
                                    {reportOptions.symptomFrequency && (
                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Suspected Triggers Card */}
                        <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl border border-border-light dark:border-border-dark">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-foreground-light dark:text-foreground-dark">Suspected Triggers</h4>
                                        <p className="text-sm text-subtle-light dark:text-subtle-dark">Potential allergens or environmental factors</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => toggleReportOption('suspectedTriggers')}
                                    className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                                        reportOptions.suspectedTriggers 
                                            ? 'bg-primary border-primary' 
                                            : 'border-border-light dark:border-border-dark'
                                    }`}
                                >
                                    {reportOptions.suspectedTriggers && (
                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Medication Adherence Card */}
                        <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl border border-border-light dark:border-border-dark">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-foreground-light dark:text-foreground-dark">Medication Adherence</h4>
                                        <p className="text-sm text-subtle-light dark:text-subtle-dark">Adherence to prescribed medications</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => toggleReportOption('medicationAdherence')}
                                    className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                                        reportOptions.medicationAdherence 
                                            ? 'bg-primary border-primary' 
                                            : 'border-border-light dark:border-border-dark'
                                    }`}
                                >
                                    {reportOptions.medicationAdherence && (
                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sharing Options Section */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-foreground-light dark:text-foreground-dark">Sharing Options</h2>
                    
                    <div className="space-y-3">
                        {/* Share PDF Button */}
                        <button
                            onClick={handleSharePDF}
                            className="w-full bg-primary text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center space-x-3 shadow-lg hover:bg-primary/90 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 8v8M14 8v8" />
                            </svg>
                            <span>Share PDF</span>
                        </button>

                        {/* Email Report Button */}
                        <button
                            onClick={handleEmailReport}
                            className="w-full bg-card-light dark:bg-card-dark text-primary font-semibold py-4 px-6 rounded-xl flex items-center justify-center space-x-3 border border-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span>Email Report</span>
                        </button>
                    </div>
                </div>

                {/* Generate Report Button */}
                <button
                    onClick={handleGenerateReport}
                    disabled={loading}
                    className="w-full bg-primary text-white font-bold py-4 px-6 rounded-xl hover:bg-primary/90 transition-colors disabled:bg-gray-400 flex items-center justify-center space-x-3 shadow-lg shadow-primary/30"
                >
                    {loading && <PawIcon className="w-6 h-6 animate-spin" />}
                    <span>{loading ? 'Generating Report...' : 'Generate Report'}</span>
                </button>

                {/* Generated Report Display */}
                {reportData && (
                    <div className="space-y-4">
                        <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl border border-border-light dark:border-border-dark">
                            <h3 className="text-lg font-bold text-foreground-light dark:text-foreground-dark mb-2">Report Generated</h3>
                            <p className="text-sm text-subtle-light dark:text-subtle-dark">
                                Period: {format(reportData.startDate, 'MMM d, yyyy')} - {format(reportData.endDate, 'MMM d, yyyy')}
                            </p>
                        </div>

                        {reportOptions.symptomFrequency && reportData.logs.length > 0 && (
                            <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl border border-border-light dark:border-border-dark">
                                <h4 className="font-semibold text-foreground-light dark:text-foreground-dark mb-2">Symptom Frequency</h4>
                                <p className="text-sm text-subtle-light dark:text-subtle-dark">
                                    {reportData.logs.length} symptoms logged in this period
                                </p>
                            </div>
                        )}

                        {reportOptions.suspectedTriggers && reportData.logs.length > 0 && (
                            <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl border border-border-light dark:border-border-dark">
                                <h4 className="font-semibold text-foreground-light dark:text-foreground-dark mb-2">Suspected Triggers</h4>
                                <p className="text-sm text-subtle-light dark:text-subtle-dark">
                                    {new Set(reportData.logs.flatMap(log => log.triggers)).size} unique triggers identified
                                </p>
                            </div>
                        )}

                        {reportOptions.medicationAdherence && reportData.reminders.length > 0 && (
                            <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl border border-border-light dark:border-border-dark">
                                <h4 className="font-semibold text-foreground-light dark:text-foreground-dark mb-2">Medication Adherence</h4>
                                <p className="text-sm text-subtle-light dark:text-subtle-dark">
                                    {reportData.reminders.filter(r => r.completed).length} of {reportData.reminders.length} medications administered
                                </p>
                            </div>
                        )}

                        <button 
                            onClick={() => setReportData(null)} 
                            className="w-full text-center text-primary font-semibold py-2 hover:text-primary/80 transition-colors"
                        >
                            Generate New Report
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VetReport;