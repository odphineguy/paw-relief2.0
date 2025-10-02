import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDogs } from '../context/DogContext';
import Header from '../components/Header';
import { SymptomLog, Reminder, AllergenAlerts, SymptomType, ReminderType } from '../types';
import { getSymptomLogs, getReminders, getLocalAllergenAlerts } from '../services/api';
import { format } from 'date-fns';
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { useTheme } from '../context/ThemeContext';

const getSeverityColor = (severity: number) => {
  switch (severity) {
    case 1:
      return '#22c55e'; // green
    case 2:
      return '#84cc16'; // lime
    case 3:
      return '#eab308'; // yellow
    case 4:
      return '#f97316'; // orange
    case 5:
      return '#ef4444'; // red
    default:
      return '#6b7280'; // gray
  }
};

const PIE_CHART_COLORS = ['#71c4ef', '#a7f3d0', '#f87171', '#fdba74', '#d4eaf7', '#b6c9f0'];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { selectedDog } = useDogs();
  const { theme } = useTheme();
  const [logs, setLogs] = useState<SymptomLog[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [alerts, setAlerts] = useState<AllergenAlerts | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedDog) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const [logsData, remindersData, alertsData] = await Promise.all([
            getSymptomLogs(selectedDog.id),
            getReminders(selectedDog.id),
            getLocalAllergenAlerts(),
          ]);
          setLogs(logsData);
          setReminders(remindersData.filter(r => !r.completed));
          setAlerts(alertsData);
        } catch (error) {
          console.error("Failed to fetch dashboard data", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [selectedDog]);

  const symptomTypeCounts = logs.reduce((acc, log) => {
    acc[log.symptomType] = (acc[log.symptomType] || 0) + 1;
    return acc;
  }, {} as Record<SymptomType, number>);

  const pieChartData = Object.entries(symptomTypeCounts).map(([name, value]) => ({
    name,
    value,
  }));

  const tooltipStyle = {
    backgroundColor: theme === 'dark' ? '#1e293b' : '#fffefb',
    border: '1px solid' + (theme === 'dark' ? '#334155' : '#e7eef3'),
    borderRadius: '8px',
    color: theme === 'dark' ? '#f0f4f8' : '#1d1c1c'
  };

  // Get recent symptoms (last 3)
  const recentSymptoms = logs.slice(0, 2);

  // Get upcoming reminders (next 2 not completed)
  const upcomingReminders = reminders.slice(0, 2);

  return (
    <div className="flex flex-col h-screen justify-between bg-background-light dark:bg-background-dark">
                <Header title="" showBackButton={false} />
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-foreground-light dark:text-foreground-dark">Loading...</div>
        </div>
      ) : selectedDog ? (
        <div className="px-4 pb-8 overflow-y-auto">
          {/* Trigger Detective Section */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-foreground-light dark:text-foreground-dark tracking-tight mb-4">
              Trigger Detective
            </h2>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Recent Insight</h3>
                  <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                    High pollen count seems to correlate with increased sneezing after park visits.
                  </p>
                </div>
              </div>
              <div className="mt-4 flex gap-3">
                <button 
                  onClick={() => navigate('/trigger-detective')}
                  className="flex-1 bg-primary text-white font-semibold py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Add Trigger Info
                </button>
                <button 
                  onClick={() => navigate('/allergen-alerts')}
                  className="flex-1 bg-primary text-white font-semibold py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  View Analysis
                </button>
              </div>
            </div>
          </section>

          {/* Recent Symptoms */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-foreground-light dark:text-foreground-dark tracking-tight mb-4">
              Recent Symptoms
            </h2>
            <div className="space-y-3">
              {recentSymptoms.map((log) => (
                <div key={log.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center text-red-600 dark:text-red-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{log.symptomType}</h3>
                    <p className="text-sm text-blue-600 dark:text-blue-400">{log.notes || 'No notes'}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Upcoming Reminders */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-foreground-light dark:text-foreground-dark tracking-tight mb-4">
              Upcoming Reminders
            </h2>
            <div className="space-y-3">
              {upcomingReminders.map((reminder) => (
                <div key={reminder.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center text-green-600 dark:text-green-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{reminder.title}</h3>
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      {reminder.date ? (() => {
                        try {
                          return format(new Date(reminder.date), 'MMM d, h:mm a');
                        } catch {
                          return 'Date unavailable';
                        }
                      })() : 'No date set'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Symptom Distribution Chart */}
          {pieChartData.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-bold text-foreground-light dark:text-foreground-dark tracking-tight mb-4">
                Symptom Distribution
              </h2>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </section>
          )}

          {/* Action Buttons */}
          <section className="mb-8">
            <div className="flex gap-4">
              <button className="flex-1 bg-primary text-white font-semibold py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors">
                Log Symptom
              </button>
              <button className="flex-1 bg-primary text-white font-semibold py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors">
                Manage Reminders
              </button>
            </div>
          </section>
        </div>
      ) : (
        <div className="flex justify-center items-center h-64">
          <p className="text-foreground-light dark:text-foreground-dark">Please select a dog to view dashboard</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;