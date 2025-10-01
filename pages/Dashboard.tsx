import React, { useEffect, useState } from 'react';
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
            <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center rounded-lg bg-primary/10 shrink-0 size-12">
                  <svg className="lucide lucide-search-check" fill="none" height="28" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 256 256" width="28">
                    <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm45.66,85.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z"></path>
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-base font-semibold text-foreground-light dark:text-foreground-dark">Recent Insight</p>
                  <p className="text-sm text-subtle-light dark:text-subtle-dark mt-1">
                    High pollen count seems to correlate with increased sneezing after park visits.
                  </p>
                </div>
              </div>
              <div className="mt-4 flex gap-3">
                <button className="flex-1 h-10 px-4 bg-primary/20 dark:bg-primary/30 text-primary rounded-xl font-bold text-sm shadow-lg shadow-primary/30">
                  Add Trigger Info
                </button>
                <button className="flex-1 h-10 px-4 bg-primary/20 dark:bg-primary/30 text-primary rounded-xl font-bold text-sm shadow-lg shadow-primary/30">
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
                <div key={log.id} className="flex items-center gap-4 bg-card-light dark:bg-card-dark p-3 rounded-xl shadow-sm">
                  <div className="flex items-center justify-center rounded-lg bg-primary/10 shrink-0 size-12 text-primary">
                    <svg fill="currentColor" height="28" viewBox="0 0 256 256" width="28">
                      <path d="M188,100a8,8,0,1,1-8,8,8,8,0,0,1,8-8H188.34133.84,53.26,53.26,0,0,1-8.8H11.32a8,8,0,0,1-8,8h0,0,1-8.8H11.32,104.11,104.11,0,0,0,128,24Z"></path>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-semibold text-foreground-light dark:text-foreground-dark">{log.symptomType}</p>
                    <p className="text-sm text-subtle-light dark:text-subtle-dark">{log.notes || 'No notes'}</p>
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
                <div key={reminder.id} className="flex items-center gap-4 bg-card-light dark:bg-card-dark p-3 rounded-xl shadow-sm">
                  <div className="flex items-center justify-center rounded-lg bg-primary/10 shrink-0 size-12 text-primary">
                    <svg fill="currentColor" height="28" viewBox="0 0 256 256" width="28">
                      <path d="M224,104h-8.37a88,88,0,0,0-175.26,0H32a8,8,0,0,0-8,8,88.1,88.1,0,0,0,88,88h0a88.1,88.1,0,0,0,88-88A8,8,0,0,0,224,104Zm-96,72a72.08,72.08,0,0,1-71.87-68h143.74A72.08,72.08,0,0,1,128,176Z"></path>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-semibold text-foreground-light dark:text-foreground-dark">{reminder.title}</p>
                    <p className="text-sm text-subtle-light dark:text-subtle-dark">
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
              <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-sm">
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
              <button className="flex-1 h-12 px-6 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/30">
                Log Symptom
              </button>
              <button className="flex-1 h-12 px-6 bg-primary/20 dark:bg-primary/30 text-primary rounded-xl font-bold text-sm">
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