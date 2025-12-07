import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDogs } from '../context/DogContext';
import { SymptomLog, Reminder } from '../types';
import { getSymptomLogs, getReminders, getTriggerLogs } from '../services/api';
import { format, isWithinInterval } from 'date-fns';
import { ArrowLeftIcon, PawIcon, CalendarIcon, FileTextIcon } from '../components/icons';
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
            let yPos = 0;

            // Blue header banner
            pdf.setFillColor(2, 132, 199); // Primary Blue (sky-600)
            pdf.rect(0, 0, pageWidth, 40, 'F');

            // White title text
            pdf.setTextColor(255, 255, 255);
            pdf.setFontSize(24);
            pdf.setFont('helvetica', 'bold');
            pdf.text('Veterinary Report', 20, 20);
            
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'normal');
            pdf.text(`Patient: ${selectedDog.name}`, 20, 30);

            yPos = 55;

            // Report Metadata
            pdf.setTextColor(100, 116, 139); // Slate-500
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'normal');
            const dateStr = format(new Date(), 'MMMM d, yyyy');
            const rangeLabel = dateRange === '7d' ? 'Last 7 Days' : dateRange === '90d' ? 'Last 90 Days' : 'Last 30 Days';
            pdf.text(`Generated on ${dateStr}  •  Period: ${rangeLabel}`, 20, yPos);
            yPos += 15;

            // Symptom Occurrences Bar Chart
            if (reportOptions.symptomFrequency && filteredLogs.length > 0) {
                pdf.setFontSize(14);
                pdf.setFont('helvetica', 'bold');
                pdf.setTextColor(15, 23, 42); // Slate-900
                pdf.text('Symptom Frequency', 20, yPos);
                yPos += 10;

                const symptomCounts: Record<string, number> = {};
                filteredLogs.forEach(log => {
                    symptomCounts[log.symptomType] = (symptomCounts[log.symptomType] || 0) + 1;
                });

                const maxCount = Math.max(...Object.values(symptomCounts), 1);
                const chartHeight = 60;
                const chartWidth = pageWidth - 40;
                const chartLeft = 20;
                const chartBottom = yPos + chartHeight;

                const numBars = Object.keys(symptomCounts).length;
                const barWidth = Math.min(15, (chartWidth - 20) / numBars - 5);
                const barSpacing = (chartWidth - (barWidth * numBars)) / (numBars + 1);

                // Draw Baseline
                pdf.setDrawColor(226, 232, 240); // Slate-200
                pdf.line(chartLeft, chartBottom, chartLeft + chartWidth, chartBottom);

                // Draw bars
                let barX = chartLeft + barSpacing;
                Object.entries(symptomCounts).forEach(([symptom, count]) => {
                    const barHeight = (count / maxCount) * chartHeight;
                    pdf.setFillColor(56, 189, 248); // Sky-400
                    pdf.rect(barX, chartBottom - barHeight, barWidth, barHeight, 'F');
                    barX += barWidth + barSpacing;
                });

                yPos = chartBottom + 10;

                // Labels below bars (rotated)
                barX = chartLeft + barSpacing;
                pdf.setFontSize(8);
                pdf.setTextColor(71, 85, 105); // Slate-600
                Object.entries(symptomCounts).forEach(([symptom]) => {
                    // Shorten label if needed
                    const shortLabel = symptom.length > 15 ? symptom.substring(0, 12) + '...' : symptom;
                    
                    // Position the text at the bottom center of each bar, then rotate
                    const textX = barX + barWidth/2;
                    const textY = yPos;

                    pdf.text(shortLabel, textX, textY, {
                        align: 'left',
                        angle: 45,
                    });
                    barX += barWidth + barSpacing;
                });

                yPos += 25;
            }

            // Suspected Triggers
            if (reportOptions.suspectedTriggers) {
                if (yPos > 240) { pdf.addPage(); yPos = 30; }

                pdf.setFontSize(14);
                pdf.setFont('helvetica', 'bold');
                pdf.setTextColor(15, 23, 42);
                pdf.text('Potential Triggers', 20, yPos);
                yPos += 10;

                const allTriggerTypes = ['Food', 'Pollen', 'Household Product', 'Walk Location', 'Environmental Changes'];
                const activeTriggers = filteredTriggers.length > 0
                    ? [...new Set(filteredTriggers.map(t => t.triggerType))]
                    : [];

                allTriggerTypes.forEach(triggerType => {
                    const isActive = activeTriggers.includes(triggerType);

                    // Checkbox style
                    pdf.setDrawColor(203, 213, 225); // Slate-300
                    pdf.setFillColor(isActive ? 16, 185, 129 : 255, 255, 255); // Emerald-500 if active
                    pdf.roundedRect(20, yPos - 4, 4, 4, 1, 1, 'FD');

                    // Trigger name
                    pdf.setFontSize(10);
                    pdf.setFont('helvetica', isActive ? 'bold' : 'normal');
                    pdf.setTextColor(isActive ? 15, 23, 42 : 100, 116, 139);
                    pdf.text(triggerType, 30, yPos);

                    yPos += 8;
                });

                yPos += 15;
            }

            // Medications
            if (reportOptions.medicationAdherence) {
                if (yPos > 240) { pdf.addPage(); yPos = 30; }

                pdf.setFontSize(14);
                pdf.setFont('helvetica', 'bold');
                pdf.setTextColor(15, 23, 42);
                pdf.text('Recent Medications', 20, yPos);
                yPos += 10;

                if (filteredReminders.length > 0) {
                    const medications = filteredReminders.filter(r => r.completed);
                    if (medications.length > 0) {
                        medications.slice(0, 10).forEach(reminder => {
                            // Bullet
                            pdf.setFillColor(56, 189, 248);
                            pdf.circle(22, yPos - 1, 1, 'F');

                            pdf.setFontSize(10);
                            pdf.setFont('helvetica', 'bold');
                            pdf.setTextColor(51, 65, 85);
                            pdf.text(reminder.name, 28, yPos);
                            
                            if (reminder.dosage) {
                                pdf.setFont('helvetica', 'normal');
                                pdf.setTextColor(100, 116, 139);
                                pdf.text(` - ${reminder.dosage}`, 28 + pdf.getTextWidth(reminder.name), yPos);
                            }
                            yPos += 7;
                        });
                    } else {
                        pdf.setFont('helvetica', 'italic');
                        pdf.setTextColor(148, 163, 184);
                        pdf.text('No medications recorded.', 20, yPos);
                        yPos += 10;
                    }
                } else {
                    pdf.setFont('helvetica', 'italic');
                    pdf.setTextColor(148, 163, 184);
                    pdf.text('No medication data available.', 20, yPos);
                    yPos += 10;
                }
            }

            // Footer
            pdf.setFontSize(8);
            pdf.setTextColor(148, 163, 184);
            pdf.text('Generated by Paw Relief App', pageWidth / 2, pageHeight - 10, { align: 'center' });

            // Download PDF
            const fileName = `Vet_Report_${selectedDog.name.replace(/\s+/g, '_')}_${format(new Date(), 'yyyyMMdd')}.pdf`;
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

    return (
        <div className="flex flex-col h-full bg-background-light dark:bg-background-dark font-body">
            <Header title="Vet Report" showBackButton={true} />

            <div className="flex-1 p-4 space-y-6 overflow-y-auto">
                <div className="bg-white dark:bg-card-dark p-6 rounded-2xl border border-border-light dark:border-border-dark shadow-soft text-center">
                    <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileTextIcon className="w-8 h-8" />
                    </div>
                    <h2 className="text-lg font-bold text-foreground-light dark:text-foreground-dark mb-2">Generate Report</h2>
                    <p className="text-sm text-subtle-light dark:text-subtle-dark mb-6">
                        Create a comprehensive health summary for your veterinarian visit.
                    </p>

                    {/* Date Range Selector */}
                    <div className="flex bg-background-light dark:bg-background-dark rounded-lg p-1 mb-6">
                        {(['7d', '30d', '90d'] as DateRangeOption[]).map((option) => (
                            <button
                                key={option}
                                onClick={() => setDateRange(option)}
                                className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all ${
                                    dateRange === option
                                        ? 'bg-white dark:bg-card-dark text-primary shadow-sm'
                                        : 'text-subtle-light hover:text-foreground-light'
                                }`}
                            >
                                {option === '7d' ? '7 Days' : option === '30d' ? '30 Days' : '90 Days'}
                            </button>
                        ))}
                    </div>

                    {/* Options Toggles */}
                    <div className="space-y-3 text-left">
                        <div onClick={() => toggleReportOption('symptomFrequency')} className="flex items-center justify-between p-3 rounded-xl border border-border-light dark:border-border-dark hover:bg-background-light dark:hover:bg-background-dark cursor-pointer transition-colors">
                            <span className="text-sm font-medium text-foreground-light dark:text-foreground-dark">Symptom History</span>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${reportOptions.symptomFrequency ? 'bg-primary border-primary' : 'border-subtle-light'}`}>
                                {reportOptions.symptomFrequency && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                            </div>
                        </div>
                        <div onClick={() => toggleReportOption('suspectedTriggers')} className="flex items-center justify-between p-3 rounded-xl border border-border-light dark:border-border-dark hover:bg-background-light dark:hover:bg-background-dark cursor-pointer transition-colors">
                            <span className="text-sm font-medium text-foreground-light dark:text-foreground-dark">Trigger Analysis</span>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${reportOptions.suspectedTriggers ? 'bg-primary border-primary' : 'border-subtle-light'}`}>
                                {reportOptions.suspectedTriggers && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                            </div>
                        </div>
                        <div onClick={() => toggleReportOption('medicationAdherence')} className="flex items-center justify-between p-3 rounded-xl border border-border-light dark:border-border-dark hover:bg-background-light dark:hover:bg-background-dark cursor-pointer transition-colors">
                            <span className="text-sm font-medium text-foreground-light dark:text-foreground-dark">Medication Log</span>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${reportOptions.medicationAdherence ? 'bg-primary border-primary' : 'border-subtle-light'}`}>
                                {reportOptions.medicationAdherence && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Action */}
            <div className="p-6 bg-white dark:bg-card-dark border-t border-border-light dark:border-border-dark">
                <button
                    onClick={handleGenerateReport}
                    disabled={loading}
                    className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg hover:bg-primary-hover transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                    {loading ? (
                        <>
                            <PawIcon className="w-5 h-5 animate-spin" />
                            <span>Generating...</span>
                        </>
                    ) : (
                        <>
                            <CalendarIcon className="w-5 h-5" />
                            <span>Download PDF Report</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default VetReport;