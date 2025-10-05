import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDogs } from '../context/DogContext';
import Header from '../components/Header';
import { SymptomLog, Reminder, AllergenAlerts, SymptomType, ReminderType } from '../types';
import { getSymptomLogs, getReminders, getLocalAllergenAlerts } from '../services/api';
import { format } from 'date-fns';
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { useTheme } from '../context/ThemeContext';
import { ChartCombinedIcon, EarIcon, ScanEyeIcon, ToiletIcon, PawIcon, AlertTriangleIcon, FlameIcon } from '../components/icons';

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

const PIE_CHART_COLORS = ['#3b82f6', '#10b981', '#a855f7', '#f97316', '#ec4899', '#06b6d4'];

// Function to get icon for each symptom type
const getSymptomIcon = (symptom: SymptomType) => {
  switch (symptom) {
    case SymptomType.EAR_INFECTIONS:
      return <EarIcon className="w-6 h-6" />;
    case SymptomType.WATERY_EYES:
      return <ScanEyeIcon className="w-6 h-6" />;
    case SymptomType.DIGESTIVE_ISSUES:
      return <ToiletIcon className="w-6 h-6" />;
    case SymptomType.PAW_LICKING:
      return <PawIcon className="w-6 h-6" />;
    case SymptomType.HOT_SPOTS:
      return <FlameIcon className="w-6 h-6" />;
    case SymptomType.EXCESSIVE_SCRATCHING:
    case SymptomType.RED_IRRITATED_SKIN:
    case SymptomType.SNEEZING:
    default:
      return <AlertTriangleIcon className="w-6 h-6" />;
  }
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { selectedDog, dogs, setSelectedDog } = useDogs();
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
          {/* Your Paws Section */}
          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl text-foreground-light dark:text-foreground-dark tracking-tight">
                Your Paws
              </h2>
              <button
                onClick={() => navigate('/create-dog-profile')}
                className="w-10 h-10 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {dogs.map((dog) => (
                <button
                  key={dog.id}
                  onClick={() => setSelectedDog(dog)}
                  className={`flex flex-col items-center gap-2 transition-all ${
                    selectedDog?.id === dog.id ? 'scale-105' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className={`w-20 h-20 rounded-full overflow-hidden border-4 ${
                    selectedDog?.id === dog.id
                      ? 'border-blue-500 dark:border-blue-400'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    <img
                      src={dog.photoUrl}
                      alt={dog.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className={`text-sm font-medium ${
                    selectedDog?.id === dog.id
                      ? 'text-blue-500 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {dog.name}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* Identified Patterns - Trigger Analysis */}
          <section className="mb-8">
            <h2 className="text-xl text-foreground-light dark:text-foreground-dark tracking-tight mb-4">
              Identified Patterns
            </h2>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-700 p-6 rounded-xl border border-gray-200 dark:border-gray-600">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Trigger vs. Symptoms
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">High</span>
                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">+15%</span>
                  </div>
                </div>
                <span className="text-xs text-cyan-600 dark:text-cyan-400 font-medium">Last 30 Days</span>
              </div>

              {/* Simplified Visualization Area */}
              <div className="bg-white/60 dark:bg-gray-900/30 rounded-lg p-4 mb-4 h-32 flex items-end justify-around gap-2">
                {/* Simple bar visualization representing trigger frequency */}
                {['FOOD', 'LOCATION', 'WEATHER', 'POLLEN', 'PRODUCTS'].map((label, index) => {
                  const heights = [60, 45, 55, 75, 50];
                  return (
                    <div key={label} className="flex flex-col items-center flex-1">
                      <div
                        className="w-full bg-gradient-to-t from-cyan-500 to-blue-400 dark:from-cyan-600 dark:to-blue-500 rounded-t transition-all"
                        style={{ height: `${heights[index]}%` }}
                      />
                      <span className="text-[9px] text-cyan-600 dark:text-cyan-400 font-medium mt-2 uppercase tracking-wider">
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Action Button */}
              <button
                onClick={() => navigate('/trigger-analysis')}
                className="w-full bg-cyan-500 hover:bg-cyan-600 dark:bg-cyan-600 dark:hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-sm"
              >
                View Detailed Analysis
              </button>
            </div>
          </section>

          {/* Symptom Distribution Chart */}
          {pieChartData.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl text-foreground-light dark:text-foreground-dark tracking-tight mb-4">
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

          {/* Upcoming Reminders */}
          <section className="mb-8">
            <h2 className="text-xl text-foreground-light dark:text-foreground-dark tracking-tight mb-4">
              Upcoming Reminders
            </h2>
            <div className="space-y-3">
              {upcomingReminders.map((reminder) => (
                <div key={reminder.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-500 dark:bg-blue-600 rounded-lg flex items-center justify-center text-white">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{reminder.name}</h3>
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      {reminder.nextDue ? (() => {
                        try {
                          return format(new Date(reminder.nextDue), 'MMM d, h:mm a');
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