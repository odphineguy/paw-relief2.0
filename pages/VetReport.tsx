import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDogs } from '../context/DogContext';
import { SymptomLog, Reminder } from '../types';
import { getSymptomLogs, getReminders, getTriggerLogs } from '../services/api';
import { format, isWithinInterval } from 'date-fns';
import { ArrowLeftIcon, PawIcon, CalendarIcon } from '../components/icons';
import Header from '../components/Header';
import jsPDF from 'jspdf';

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

            const [allLogs, allReminders, allTriggers] = await Promise.all([
                getSymptomLogs(selectedDog.id),
                getReminders(selectedDog.id),
                getTriggerLogs(selectedDog.id),
            ]);

            const filteredLogs = allLogs.filter(log =>
                isWithinInterval(new Date(log.createdAt), { start: startDate, end: endDate })
            );

            const filteredReminders = allReminders.filter(reminder =>
                isWithinInterval(new Date(reminder.nextDue), { start: startDate, end: endDate })
            );

            const filteredTriggers = allTriggers.filter(trigger =>
                isWithinInterval(new Date(trigger.loggedDate), { start: startDate, end: endDate })
            );

            // Generate PDF
            const pdf = new jsPDF();
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            let yPos = 20;

            // Symptom Occurrences Section
            if (reportOptions.symptomFrequency) {
                // Title in gray
                pdf.setFontSize(11);
                pdf.setFont('helvetica', 'normal');
                pdf.setTextColor(150, 150, 150);
                pdf.text('Symptom Occurrences', 20, yPos);
                yPos += 10;

                // Count in large bold black
                pdf.setFontSize(36);
                pdf.setFont('helvetica', 'bold');
                pdf.setTextColor(0, 0, 0);
                pdf.text(filteredLogs.length.toString(), 20, yPos);
                yPos += 8;

                // Date range subtitle in cyan
                pdf.setFontSize(11);
                pdf.setFont('helvetica', 'normal');
                pdf.setTextColor(100, 200, 220);
                pdf.text(`Last ${dateRange === '7d' ? '7' : dateRange === '90d' ? '90' : '30'} Days`, 20, yPos);
                yPos += 20;

                // Bar chart
                if (filteredLogs.length > 0) {
                    const symptomCounts: Record<string, number> = {};
                    filteredLogs.forEach(log => {
                        symptomCounts[log.symptomType] = (symptomCounts[log.symptomType] || 0) + 1;
                    });

                    const maxCount = Math.max(...Object.values(symptomCounts));
                    const barWidth = 30;
                    const maxBarHeight = 50;
                    const barSpacing = 10;
                    let barX = 20;

                    Object.entries(symptomCounts).forEach(([symptom, count]) => {
                        // Draw bar in light cyan
                        const barHeight = (count / maxCount) * maxBarHeight;
                        pdf.setFillColor(200, 230, 240);
                        pdf.rect(barX, yPos + maxBarHeight - barHeight, barWidth, barHeight, 'F');

                        barX += barWidth + barSpacing;
                    });

                    yPos += maxBarHeight + 5;

                    // Labels below bars
                    barX = 20;
                    pdf.setFontSize(8);
                    pdf.setTextColor(100, 200, 220);
                    Object.entries(symptomCounts).forEach(([symptom]) => {
                        const lines = pdf.splitTextToSize(symptom, barWidth);
                        pdf.text(lines, barX + barWidth/2, yPos, { align: 'center' });
                        barX += barWidth + barSpacing;
                    });

                    yPos += 20;
                }
            }

            // Suspected Triggers
            if (reportOptions.suspectedTriggers) {
                if (yPos > 200) {
                    pdf.addPage();
                    yPos = 20;
                }

                pdf.setFontSize(14);
                pdf.setFont('helvetica', 'bold');
                pdf.setTextColor(0, 0, 0);
                pdf.text('Suspected Triggers', 20, yPos);
                yPos += 10;

                if (filteredTriggers.length > 0) {
                    const uniqueTriggers = [...new Set(filteredTriggers.map(t => t.triggerType))];

                    // Draw pill-shaped badges
                    let pillX = 20;
                    pdf.setFontSize(10);
                    pdf.setFont('helvetica', 'normal');

                    uniqueTriggers.forEach(trigger => {
                        const textWidth = pdf.getTextWidth(trigger);
                        const pillWidth = textWidth + 12;

                        // Check if we need to wrap to next line
                        if (pillX + pillWidth > pageWidth - 20) {
                            pillX = 20;
                            yPos += 12;
                        }

                        // Draw rounded rectangle (pill shape) in light gray
                        pdf.setFillColor(240, 240, 240);
                        pdf.roundedRect(pillX, yPos - 6, pillWidth, 8, 4, 4, 'F');

                        // Draw text in dark gray
                        pdf.setTextColor(80, 80, 80);
                        pdf.text(trigger, pillX + 6, yPos);

                        pillX += pillWidth + 6;
                    });

                    yPos += 15;
                } else {
                    pdf.setFontSize(10);
                    pdf.setFont('helvetica', 'normal');
                    pdf.setTextColor(150, 150, 150);
                    pdf.text('No triggers identified in this period.', 20, yPos);
                    yPos += 10;
                }
            }

            // Medications Given
            if (reportOptions.medicationAdherence) {
                if (yPos > 200) {
                    pdf.addPage();
                    yPos = 20;
                }

                pdf.setFontSize(14);
                pdf.setFont('helvetica', 'bold');
                pdf.setTextColor(0, 0, 0);
                pdf.text('Medications Given', 20, yPos);
                yPos += 10;

                if (filteredReminders.length > 0) {
                    const medications = filteredReminders.filter(r => r.completed);

                    if (medications.length > 0) {
                        medications.forEach(reminder => {
                            if (yPos > 270) {
                                pdf.addPage();
                                yPos = 20;
                            }

                            // Medication name in black
                            pdf.setFontSize(11);
                            pdf.setFont('helvetica', 'bold');
                            pdf.setTextColor(0, 0, 0);
                            pdf.text(reminder.name, 20, yPos);
                            yPos += 6;

                            // Dosage in cyan
                            if (reminder.dosage) {
                                pdf.setFont('helvetica', 'normal');
                                pdf.setTextColor(100, 200, 220);
                                pdf.text(reminder.dosage, 20, yPos);
                                yPos += 8;
                            }
                        });
                    } else {
                        pdf.setFontSize(10);
                        pdf.setFont('helvetica', 'normal');
                        pdf.setTextColor(150, 150, 150);
                        pdf.text('No medications administered in this period.', 20, yPos);
                        yPos += 10;
                    }
                } else {
                    pdf.setFontSize(10);
                    pdf.setFont('helvetica', 'normal');
                    pdf.setTextColor(150, 150, 150);
                    pdf.text('No medications recorded in this period.', 20, yPos);
                    yPos += 10;
                }
            }

            // Symptom Timeline
            if (reportOptions.symptomFrequency && filteredLogs.length > 0) {
                if (yPos > 180) {
                    pdf.addPage();
                    yPos = 20;
                }

                pdf.setFontSize(14);
                pdf.setFont('helvetica', 'bold');
                pdf.setTextColor(0, 0, 0);
                pdf.text('Symptom Timeline', 20, yPos);
                yPos += 10;

                const sortedLogs = [...filteredLogs].sort((a, b) =>
                    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                );

                sortedLogs.forEach(log => {
                    if (yPos > 270) {
                        pdf.addPage();
                        yPos = 20;
                    }

                    // Draw paw icon (simplified circle)
                    pdf.setFillColor(200, 200, 200);
                    pdf.circle(25, yPos - 2, 2, 'F');

                    // Symptom name in black
                    pdf.setFontSize(11);
                    pdf.setFont('helvetica', 'normal');
                    pdf.setTextColor(0, 0, 0);
                    pdf.text(log.symptomType, 32, yPos);
                    yPos += 6;

                    // Date in cyan
                    pdf.setTextColor(100, 200, 220);
                    pdf.text(format(new Date(log.createdAt), 'MMMM d, yyyy'), 32, yPos);
                    yPos += 10;
                });
            }

            // Download PDF
            const fileName = `paw-relief-report-${selectedDog.name.toLowerCase()}-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
            pdf.save(fileName);

        } catch (error) {
            console.error("Failed to generate report", error);
            alert("Could not generate the report. Please try again.");
        } finally {
            setLoading(false);
        }
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
                {/* Date Range Section */}
                <div className="space-y-3">
                    <label className="block text-base text-foreground-light dark:text-foreground-dark">
                        Date Range
                    </label>
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value as DateRangeOption)}
                        className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-foreground-light dark:text-foreground-dark font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="7d">Last 7 Days</option>
                        <option value="30d">Last 30 Days</option>
                        <option value="90d">Last 90 Days</option>
                    </select>
                </div>

                {/* Include in Report Section */}
                <div className="space-y-4">
                    <h2 className="text-base text-foreground-light dark:text-foreground-dark">Include in Report:</h2>

                    <div className="space-y-3">
                        {/* Symptom Frequency Option */}
                        <div
                            onClick={() => toggleReportOption('symptomFrequency')}
                            className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center gap-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-colors"
                        >
                            <div className="w-12 h-12 bg-blue-500 dark:bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 dark:text-white">Symptom Frequency</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Frequency of symptoms over the selected period</p>
                            </div>
                            <div className={`w-6 h-6 rounded flex items-center justify-center ${reportOptions.symptomFrequency ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'}`}>
                                {reportOptions.symptomFrequency && (
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>
                        </div>

                        {/* Suspected Triggers Option */}
                        <div
                            onClick={() => toggleReportOption('suspectedTriggers')}
                            className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center gap-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-colors"
                        >
                            <div className="w-12 h-12 bg-blue-500 dark:bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 dark:text-white">Suspected Triggers</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Potential allergens or environmental factors</p>
                            </div>
                            <div className={`w-6 h-6 rounded flex items-center justify-center ${reportOptions.suspectedTriggers ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'}`}>
                                {reportOptions.suspectedTriggers && (
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>
                        </div>

                        {/* Medication Adherence Option */}
                        <div
                            onClick={() => toggleReportOption('medicationAdherence')}
                            className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center gap-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-colors"
                        >
                            <div className="w-12 h-12 bg-blue-500 dark:bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 dark:text-white">Medication Adherence</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Adherence to prescribed medications</p>
                            </div>
                            <div className={`w-6 h-6 rounded flex items-center justify-center ${reportOptions.medicationAdherence ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'}`}>
                                {reportOptions.medicationAdherence && (
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sharing Options Section */}
                <div className="space-y-4">
                    <h2 className="text-base text-foreground-light dark:text-foreground-dark">Sharing Options</h2>

                    <div className="space-y-3">
                        {/* Download Report PDF Button */}
                        <button
                            onClick={handleGenerateReport}
                            disabled={loading}
                            className="w-full bg-primary text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center space-x-3 shadow-lg hover:bg-primary/90 transition-colors disabled:bg-primary/60 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <PawIcon className="w-6 h-6 animate-spin" />
                                    <span>Generating PDF...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                    <span>Download Report PDF</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VetReport;