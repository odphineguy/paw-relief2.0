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
            let yPos = 0;

            // Blue header banner
            pdf.setFillColor(59, 130, 246); // Blue color
            pdf.rect(0, 0, pageWidth, 50, 'F');

            // White title text
            pdf.setTextColor(255, 255, 255);
            pdf.setFontSize(28);
            pdf.setFont('helvetica', 'bold');
            pdf.text('Paw Relief', 15, 22);

            pdf.setFontSize(20);
            pdf.setFont('helvetica', 'normal');
            pdf.text('Veterinarian Report', 15, 38);

            yPos = 60;

            // Subtitle with date and period
            pdf.setTextColor(150, 150, 150);
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'normal');
            const dateStr = format(new Date(), 'MM/dd/yyyy');
            const daysLabel = dateRange === '7d' ? '7' : dateRange === '90d' ? '90' : '30';
            pdf.text(`A report generated on ${dateStr}, for pet symptoms for the past ${daysLabel} days`, 15, yPos);
            yPos += 15;

            // Pet name centered
            pdf.setTextColor(59, 130, 246);
            pdf.setFontSize(18);
            pdf.setFont('helvetica', 'bold');
            pdf.text(selectedDog.name, pageWidth / 2, yPos, { align: 'center' });
            yPos += 20;

            // Symptom Occurrences Bar Chart
            if (reportOptions.symptomFrequency && filteredLogs.length > 0) {
                const symptomCounts: Record<string, number> = {};
                filteredLogs.forEach(log => {
                    symptomCounts[log.symptomType] = (symptomCounts[log.symptomType] || 0) + 1;
                });

                const maxCount = Math.max(...Object.values(symptomCounts), 1);
                const chartHeight = 80;
                const chartWidth = pageWidth - 40;
                const chartLeft = 20;
                const chartBottom = yPos + chartHeight;

                const numBars = Object.keys(symptomCounts).length;
                const barWidth = Math.min(20, (chartWidth - 20) / numBars - 5);
                const barSpacing = (chartWidth - (barWidth * numBars)) / (numBars + 1);

                // Draw grid lines and Y-axis labels
                pdf.setDrawColor(220, 220, 220);
                pdf.setLineWidth(0.5);
                const yAxisSteps = Math.ceil(maxCount / 2) * 2; // Round up to even number
                for (let i = 0; i <= yAxisSteps; i += 2) {
                    const yLine = chartBottom - (i / yAxisSteps) * chartHeight;
                    pdf.line(chartLeft, yLine, chartLeft + chartWidth, yLine);

                    // Y-axis labels
                    pdf.setFontSize(9);
                    pdf.setTextColor(100, 100, 100);
                    pdf.text(i.toString(), chartLeft - 5, yLine + 2, { align: 'right' });
                }

                // Draw bars
                let barX = chartLeft + barSpacing;
                Object.entries(symptomCounts).forEach(([symptom, count]) => {
                    const barHeight = (count / yAxisSteps) * chartHeight;
                    pdf.setFillColor(59, 130, 246); // Blue bars
                    pdf.rect(barX, chartBottom - barHeight, barWidth, barHeight, 'F');

                    barX += barWidth + barSpacing;
                });

                yPos = chartBottom + 10;

                // Labels below bars (rotated)
                barX = chartLeft + barSpacing;
                pdf.setFontSize(8);
                pdf.setTextColor(60, 60, 60);
                Object.entries(symptomCounts).forEach(([symptom]) => {
                    // Shorten label if needed
                    const shortLabel = symptom.replace('Red/Irritated Skin', 'Red/Irr Skin')
                                             .replace('Excessive Scratching', 'Excessive Scratching')
                                             .replace('Ear Infections', 'Ear Infection')
                                             .replace('Watery Eyes', 'Watery Eyes');

                    // Position the text at the bottom center of each bar, then rotate
                    const textX = barX + barWidth/2;
                    const textY = yPos;

                    pdf.text(shortLabel, textX, textY, {
                        align: 'left',
                        angle: 45,
                        maxWidth: 30
                    });
                    barX += barWidth + barSpacing;
                });

                yPos += 8;
            }

            // Suspected Triggers
            if (reportOptions.suspectedTriggers) {
                // Keep on same page if possible
                if (yPos > 220) {
                    pdf.addPage();
                    yPos = 20;
                }

                pdf.setFontSize(16);
                pdf.setFont('helvetica', 'bold');
                pdf.setTextColor(59, 130, 246);
                pdf.text('Suspected Triggers', pageWidth / 2, yPos, { align: 'center' });
                yPos += 15;

                const allTriggerTypes = ['Food', 'Pollen', 'Household Product', 'Walk Location', 'Environmental Changes'];
                const activeTriggers = filteredTriggers.length > 0
                    ? [...new Set(filteredTriggers.map(t => t.triggerType))]
                    : [];

                allTriggerTypes.forEach(triggerType => {
                    const isActive = activeTriggers.includes(triggerType);

                    // Draw checkbox
                    pdf.setDrawColor(0, 0, 0);
                    pdf.setLineWidth(0.5);
                    pdf.rect(25, yPos - 4, 4, 4, 'S');

                    // Fill checkbox if active
                    if (isActive) {
                        pdf.setFillColor(0, 0, 0);
                        pdf.rect(25, yPos - 4, 4, 4, 'F');
                        // Checkmark
                        pdf.setDrawColor(255, 255, 255);
                        pdf.setLineWidth(0.8);
                        pdf.line(25.5, yPos - 1, 26.5, yPos);
                        pdf.line(26.5, yPos, 28.5, yPos - 3.5);
                    }

                    // Trigger name
                    pdf.setFontSize(11);
                    pdf.setFont('helvetica', 'normal');
                    pdf.setTextColor(0, 0, 0);

                    // Strikethrough if active (like in mockup)
                    if (isActive) {
                        const textWidth = pdf.getTextWidth(triggerType);
                        pdf.setDrawColor(0, 0, 0);
                        pdf.setLineWidth(0.3);
                        pdf.line(32, yPos - 1.5, 32 + textWidth, yPos - 1.5);
                    }

                    pdf.text(triggerType, 32, yPos);

                    yPos += 8;
                });

                yPos += 10;
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

            // Symptom Timeline (Table format)
            if (reportOptions.symptomFrequency && filteredLogs.length > 0) {
                // Check if we need a new page
                if (yPos > 180) {
                    pdf.addPage();
                    yPos = 20;
                }

                pdf.setFontSize(16);
                pdf.setFont('helvetica', 'bold');
                pdf.setTextColor(59, 130, 246);
                pdf.text('Symptom Timeline', pageWidth / 2, yPos, { align: 'center' });
                yPos += 15;

                // Table headers
                const tableLeft = 20;
                const tableWidth = pageWidth - 40;
                const col1Width = tableWidth * 0.6;
                const col2Width = tableWidth * 0.4;

                pdf.setFillColor(240, 240, 240);
                pdf.rect(tableLeft, yPos - 8, tableWidth, 12, 'F');

                pdf.setFontSize(11);
                pdf.setFont('helvetica', 'bold');
                pdf.setTextColor(0, 0, 0);
                pdf.text('Symptom', tableLeft + 5, yPos);
                pdf.text('Date', tableLeft + col1Width + 5, yPos);

                yPos += 10;

                const sortedLogs = [...filteredLogs].sort((a, b) =>
                    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                );

                // Table rows with alternating background
                let rowIndex = 0;
                sortedLogs.forEach(log => {
                    if (yPos > 270) {
                        pdf.addPage();
                        yPos = 20;
                        rowIndex = 0;
                    }

                    // Alternating row background
                    if (rowIndex % 2 === 0) {
                        pdf.setFillColor(245, 250, 255);
                        pdf.rect(tableLeft, yPos - 8, tableWidth, 12, 'F');
                    }

                    pdf.setFontSize(10);
                    pdf.setFont('helvetica', 'normal');
                    pdf.setTextColor(59, 130, 246);
                    pdf.text(log.symptomType, tableLeft + 5, yPos);

                    pdf.setTextColor(0, 0, 0);
                    pdf.text(format(new Date(log.createdAt), 'MMMM d, yyyy'), tableLeft + col1Width + 5, yPos);

                    yPos += 12;
                    rowIndex++;
                });

                yPos += 5;
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