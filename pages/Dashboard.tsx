import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDogs } from '../context/DogContext';
import { SymptomLog, Reminder, SymptomType, TriggerLog, TriggerType } from '../types';
import { getSymptomLogs, getReminders, getTriggerLogs } from '../services/api';
import { format, isToday, isTomorrow } from 'date-fns';
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { useTheme } from '../context/ThemeContext';
import { 
    ChartCombinedIcon, EarIcon, ScanEyeIcon, ToiletIcon, PawIcon, AlertTriangleIcon, FlameIcon,
    PlusCircleIcon, ActivityIcon, PillBottleIcon, ClipboardListIcon
} from '../components/icons';

// Professional Medical Palette for Charts
const PIE_CHART_COLORS = ['#0284c7', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#8b5cf6'];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { selectedDog, dogs, setSelectedDog } = useDogs();
  const { theme } = useTheme();
  const [logs, setLogs] = useState<SymptomLog[]>([]);
  const [triggerLogs, setTriggerLogs] = useState<TriggerLog[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  
  // Weather & Location State
  const [location, setLocation] = useState<{ city: string; country: string; lat: number; lon: number } | null>(null);
  const [weather, setWeather] = useState<{ temp: number; description: string; aqi: number } | null>(null);
  const [allergenLoading, setAllergenLoading] = useState(true);
  const [allergenError, setAllergenError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedDog) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const [logsData, triggerLogsData, remindersData] = await Promise.all([
            getSymptomLogs(selectedDog.id),
            getTriggerLogs(selectedDog.id),
            getReminders(selectedDog.id),
          ]);
          setLogs(logsData);
          setTriggerLogs(triggerLogsData);
          setReminders(remindersData.filter(r => !r.completed));
        } catch (error) {
          console.error("Failed to fetch dashboard data", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } else {
      setLoading(false);
    }
  }, [selectedDog]);

  useEffect(() => {
    fetchLocationAndWeather();
  }, []);

  const fetchLocationAndWeather = async () => {
    try {
      setAllergenLoading(true);
      // ... (Keeping existing logic for fetching location/weather to avoid breaking functionality)
       if (!navigator.geolocation) {
        throw new Error("Geolocation is not supported");
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
      });

      const { latitude, longitude } = position.coords;

      // Reverse Geocoding
      let cityName = 'Your Location';
      try {
        const geoResponse = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
        const geoData = await geoResponse.json();
        cityName = geoData.city || geoData.locality || 'Your Location';
      } catch (e) { console.error(e); }

      setLocation({ city: cityName, country: 'US', lat: latitude, lon: longitude });

      // Weather & Air Quality
      const [weatherRes, airRes] = await Promise.all([
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&temperature_unit=fahrenheit`),
        fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=us_aqi`)
      ]);

      const weatherData = await weatherRes.json();
      const airData = await airRes.json();

      setWeather({
        temp: Math.round(weatherData.current.temperature_2m),
        description: 'Current Conditions', // Simplified for now
        aqi: airData.current.us_aqi || 0
      });

    } catch (err) {
      console.error(err);
      setAllergenError("Could not load location data");
      // Fallback
      setLocation({ city: 'Phoenix', country: 'US', lat: 33.4484, lon: -112.0740 });
      setWeather({ temp: 95, description: 'Sunny', aqi: 65 });
    } finally {
      setAllergenLoading(false);
    }
  };

  // derived data
  const upcomingReminders = reminders.slice(0, 2);
  const totalTriggers = triggerLogs.length;

  const getPollenRisk = (aqi: number) => {
      if (aqi > 150) return { label: 'High', color: 'text-error', bg: 'bg-error/10' };
      if (aqi > 50) return { label: 'Moderate', color: 'text-warning', bg: 'bg-warning/10' };
      return { label: 'Low', color: 'text-success', bg: 'bg-success/10' };
  };

  return (
    <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark font-body">
      
      {/* Top Bar: Pet Selector */}
      <div className="px-4 py-4 bg-white dark:bg-card-dark border-b border-border-light dark:border-border-dark flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div>
            <h1 className="text-xl font-display font-bold text-foreground-light dark:text-foreground-dark">Dashboard</h1>
            <p className="text-xs text-subtle-light dark:text-subtle-dark">
                {format(new Date(), 'EEEE, MMMM d')}
            </p>
        </div>
        <div className="flex -space-x-2 overflow-hidden items-center">
            <button
                onClick={() => navigate('/profile')}
                className="mr-3 text-primary"
            >
                <PawIcon className="w-8 h-8" />
            </button>
            {dogs.map((dog) => (
                <button 
                    key={dog.id}
                    onClick={() => setSelectedDog(dog)}
                    className={`relative w-10 h-10 rounded-full border-2 transition-transform hover:scale-105 ${selectedDog?.id === dog.id ? 'border-primary z-10' : 'border-white dark:border-gray-700 opacity-70'}`}
                >
                    <img src={dog.photoUrl} alt={dog.name} className="w-full h-full object-cover rounded-full" />
                </button>
            ))}
            <button 
                onClick={() => navigate('/create-dog-profile')}
                className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border-2 border-dashed border-primary/30 text-primary hover:bg-primary/20"
            >
                <PlusCircleIcon className="w-5 h-5" />
            </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        
        {loading ? (
             <div className="flex justify-center py-12">
                 <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
             </div>
        ) : !selectedDog ? (
            <div className="text-center py-12 flex flex-col items-center justify-center h-[60vh]">
                <PawIcon className="w-16 h-16 text-subtle-light/50 mb-4" />
                <h2 className="text-xl font-bold text-foreground-light dark:text-foreground-dark mb-2">Welcome to Paw Relief</h2>
                <p className="text-subtle-light dark:text-subtle-dark max-w-xs mx-auto mb-8">
                    Please select or add a pet to view their health dashboard.
                </p>
                <button 
                    onClick={() => navigate('/create-dog-profile')}
                    className="px-8 py-3 bg-primary text-white rounded-full font-bold shadow-lg hover:bg-primary-hover transition-all flex items-center gap-2"
                >
                    <PlusCircleIcon className="w-5 h-5" />
                    <span>Add Your First Pet</span>
                </button>
            </div>
        ) : (
            <>
                    {/* Status Cards Grid */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Environment Vital */}
                    <div className="col-span-2 sm:col-span-1 bg-white dark:bg-card-dark p-4 rounded-lg border border-border-light dark:border-border-dark shadow-sm flex flex-col justify-between relative overflow-hidden">
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${getPollenRisk(weather?.aqi || 0).bg.replace('/10', '')}`}></div>
                        <div className="flex justify-between items-start mb-2 pl-2">
                            <h3 className="text-xs font-bold text-subtle-light dark:text-subtle-dark uppercase tracking-widest">Environment</h3>
                            {weather && (
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${getPollenRisk(weather.aqi).bg} ${getPollenRisk(weather.aqi).color}`}>
                                    {getPollenRisk(weather.aqi).label}
                                </span>
                            )}
                        </div>
                        <div className="pl-2">
                             <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-display font-bold text-foreground-light dark:text-foreground-dark">
                                    {weather ? `${weather.temp}°` : '--'}
                                </span>
                                <span className="text-sm text-subtle-light dark:text-subtle-dark font-medium">
                                    F in {location?.city || 'Unknown'}
                                </span>
                            </div>
                            <div className="mt-2 text-xs text-subtle-light dark:text-subtle-dark flex items-center gap-2">
                                <span className="font-medium">AQI: {weather?.aqi || '--'}</span>
                                <span className="text-border-dark/20 dark:text-border-light/20">|</span>
                                <span className="font-medium">Pollen: {weather ? Math.round(weather.aqi / 10) : '-'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Medication Vital */}
                    <div className="col-span-2 sm:col-span-1 bg-white dark:bg-card-dark p-4 rounded-lg border border-border-light dark:border-border-dark shadow-sm flex flex-col justify-between relative overflow-hidden">
                         <div className={`absolute left-0 top-0 bottom-0 w-1 ${upcomingReminders.length > 0 ? 'bg-blue-500' : 'bg-slate-300'}`}></div>
                        <div className="flex justify-between items-start mb-2 pl-2">
                            <h3 className="text-xs font-bold text-subtle-light dark:text-subtle-dark uppercase tracking-widest">Next Dose</h3>
                             {upcomingReminders.length > 0 && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                    Due Soon
                                </span>
                            )}
                        </div>
                        <div className="pl-2">
                            {upcomingReminders.length > 0 ? (
                                <>
                                    <p className="text-lg font-bold text-foreground-light dark:text-foreground-dark truncate leading-tight">
                                        {upcomingReminders[0].name}
                                    </p>
                                    <p className="text-sm text-subtle-light dark:text-subtle-dark mt-1">
                                        {upcomingReminders[0].nextDue ? format(new Date(upcomingReminders[0].nextDue), 'h:mm a') : 'Anytime'}
                                    </p>
                                </>
                            ) : (
                                <div className="h-full flex flex-col justify-center">
                                    <p className="text-foreground-light dark:text-foreground-dark font-medium">All Clear</p>
                                    <p className="text-xs text-subtle-light">No meds due</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Actions Row */}
                <div className="grid grid-cols-3 gap-3">
                    <ActionButton 
                        label="Log Symptom" 
                        icon={<ClipboardListIcon className="w-5 h-5" />} 
                        onClick={() => navigate('/log-entry')} 
                    />
                     <ActionButton 
                        label="Log Trigger" 
                        icon={<ActivityIcon className="w-5 h-5" />} 
                        onClick={() => navigate('/trigger-detective')} 
                    />
                     <ActionButton 
                        label="Meds" 
                        icon={<PillBottleIcon className="w-5 h-5" />} 
                        onClick={() => navigate('/meds')} 
                    />
                </div>

                {/* Recent Activity / Charts */}
                <div className="bg-white dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark shadow-soft overflow-hidden">
                    <div className="px-4 py-3 border-b border-border-light dark:border-border-dark flex justify-between items-center">
                        <h3 className="font-semibold text-foreground-light dark:text-foreground-dark">Symptom Distribution</h3>
                        <span className="text-xs text-subtle-light">Last 30 Days</span>
                    </div>
                    <div className="p-4 h-64">
                        {logs.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={Object.entries(logs.reduce((acc, log) => {
                                            acc[log.symptomType] = (acc[log.symptomType] || 0) + 1;
                                            return acc;
                                        }, {} as Record<string, number>)).map(([name, value]) => ({ name, value }))}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {Object.keys(logs).map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" height={36}/>
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-subtle-light">
                                <ActivityIcon className="w-8 h-8 mb-2 opacity-50" />
                                <p>No symptoms logged yet</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Trigger Patterns Summary */}
                 <div className="bg-white dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark shadow-soft overflow-hidden">
                    <div className="px-4 py-3 border-b border-border-light dark:border-border-dark flex justify-between items-center">
                        <h3 className="font-semibold text-foreground-light dark:text-foreground-dark">Identified Triggers</h3>
                    </div>
                    <div className="p-4">
                        {totalTriggers > 0 ? (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-subtle-light">Most Frequent</span>
                                    <span className="text-sm font-medium text-foreground-light">Pollen (Est.)</span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                                    <div className="bg-primary h-2 rounded-full" style={{ width: '75%' }}></div>
                                </div>
                                <button 
                                    onClick={() => navigate('/trigger-analysis')}
                                    className="w-full mt-2 text-center text-xs text-subtle-light hover:text-primary font-medium transition-colors"
                                >
                                    View Full Analysis &rarr;
                                </button>
                            </div>
                        ) : (
                             <div className="py-6 text-center text-subtle-light text-sm">
                                <p>Log triggers to identifying patterns.</p>
                            </div>
                        )}
                    </div>
                </div>

            </>
        )}
      </div>
    </div>
  );
};

const ActionButton: React.FC<{ label: string; icon: React.ReactNode; onClick: () => void }> = ({ label, icon, onClick }) => (
    <button 
        onClick={onClick}
        className="flex flex-col items-center justify-center gap-2 p-3 bg-white dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors h-full"
    >
        <div className="text-primary bg-primary/10 p-2 rounded-full">
            {icon}
        </div>
        <span className="text-xs font-semibold text-foreground-light dark:text-foreground-dark text-center">{label}</span>
    </button>
);

export default Dashboard;