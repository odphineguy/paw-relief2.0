import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDogs } from '../context/DogContext';
import Header from '../components/Header';
import { SymptomLog, Reminder, SymptomType, ReminderType, TriggerLog, TriggerType } from '../types';
import { getSymptomLogs, getReminders, getTriggerLogs } from '../services/api';
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

// Location and weather interfaces
interface LocationData {
  city: string;
  country: string;
  lat: number;
  lon: number;
}

interface WeatherData {
  temp: number;
  description: string;
  aqi: number;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { selectedDog, dogs, setSelectedDog } = useDogs();
  const { theme } = useTheme();
  const [logs, setLogs] = useState<SymptomLog[]>([]);
  const [triggerLogs, setTriggerLogs] = useState<TriggerLog[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
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
      // No dog selected, stop loading
      setLoading(false);
    }
  }, [selectedDog]);

  useEffect(() => {
    fetchLocationAndWeather();
  }, []);

  const fetchLocationAndWeather = async () => {
    try {
      setAllergenLoading(true);

      // Get user's geolocation
      if (!navigator.geolocation) {
        console.error("Geolocation is not supported by your browser");
        throw new Error("Geolocation is not supported by your browser");
      }

      console.log("Requesting geolocation...");
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          (error) => {
            console.error("Geolocation error:", error);
            reject(error);
          },
          {
            enableHighAccuracy: false,
            timeout: 10000,
            maximumAge: 300000 // 5 minutes
          }
        );
      });

      const { latitude, longitude } = position.coords;
      console.log("Got position:", latitude, longitude);

      // Use BigDataCloud reverse geocoding (free, no API key, no CORS issues)
      console.log("Fetching location name...");
      let cityName = 'Your Location';
      let countryCode = '';

      try {
        const geoResponse = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        );
        const geoData = await geoResponse.json();
        console.log("Geocoding response:", geoData);

        cityName = geoData.city || geoData.locality || geoData.principalSubdivision || 'Your Location';
        countryCode = geoData.countryCode || '';
      } catch (geoError) {
        console.error("Geocoding error (non-fatal):", geoError);
        // Continue without city name
      }

      setLocation({
        city: cityName,
        country: countryCode,
        lat: latitude,
        lon: longitude
      });

      // Fetch weather and air quality from Open-Meteo
      console.log("Fetching weather...");
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&temperature_unit=fahrenheit&timezone=auto`
      );
      const weatherData = await weatherResponse.json();
      console.log("Weather response:", weatherData);

      // Fetch air quality
      console.log("Fetching air quality...");
      const airResponse = await fetch(
        `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=us_aqi,pm10,pm2_5`
      );
      const airData = await airResponse.json();
      console.log("Air quality response:", airData);

      setWeather({
        temp: Math.round(weatherData.current.temperature_2m),
        description: getWeatherDescription(weatherData.current.weather_code),
        aqi: airData.current.us_aqi || 0
      });

      console.log("Successfully loaded location and weather data");

    } catch (err) {
      console.error("Error fetching location/weather data:", err);
      setAllergenError(err instanceof Error ? err.message : "Failed to load location data");
      // Set default Phoenix data as fallback
      setLocation({ city: 'Phoenix', country: 'US', lat: 33.4484, lon: -112.0740 });
      setWeather({ temp: 95, description: 'Sunny', aqi: 65 });
    } finally {
      setAllergenLoading(false);
    }
  };

  const getWeatherDescription = (code: number): string => {
    // WMO Weather interpretation codes
    if (code === 0) return 'Clear';
    if (code <= 3) return 'Partly Cloudy';
    if (code <= 48) return 'Foggy';
    if (code <= 67) return 'Rainy';
    if (code <= 77) return 'Snowy';
    if (code <= 99) return 'Stormy';
    return 'Clear';
  };

  // Icon components
  const SunIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );

  const PollenIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  );

  const AirQualityIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
    </svg>
  );

  const PawPrintIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );

  const HourglassIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const AirPurifierIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 0020 12c0-4.418-3.582-8-8-8V3a1 1 0 00-2 0v1H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2h-4zm-4 10a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );

  const AllergenCard = ({ icon: Icon, title, subtitle, level, maxLevel, colorClass }: {
    icon: React.ElementType;
    title: string;
    subtitle: string;
    level: number;
    maxLevel: number;
    colorClass: string;
  }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 flex items-center justify-between shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center">
        <div className="bg-blue-500 dark:bg-blue-600 p-3 rounded-lg mr-3">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">{title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
        </div>
      </div>
      <div className="w-24 h-2 rounded-full bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
        <div
          className={`h-full rounded-full ${colorClass}`}
          style={{ width: `${(level / maxLevel) * 100}%` }}
        ></div>
      </div>
    </div>
  );

  const RecommendationCard: React.FC<{
    icon: React.ElementType;
    text: string;
  }> = ({ icon: Icon, text }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 flex items-center shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="bg-blue-500 dark:bg-blue-600 p-3 rounded-lg mr-3">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <p className="text-gray-900 dark:text-white text-base">{text}</p>
    </div>
  );

  const symptomTypeCounts = logs.reduce((acc, log) => {
    acc[log.symptomType] = (acc[log.symptomType] || 0) + 1;
    return acc;
  }, {} as Record<SymptomType, number>);

  const pieChartData = Object.entries(symptomTypeCounts).map(([name, value]) => ({
    name,
    value,
  }));

  // Calculate trigger patterns (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentTriggerLogs = triggerLogs.filter(log => 
    new Date(log.loggedDate) >= thirtyDaysAgo
  );
  
  const triggerCounts: Record<string, number> = recentTriggerLogs.reduce((acc, log) => {
    acc[log.triggerType] = (acc[log.triggerType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedTriggers = Object.entries(triggerCounts)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .map(([trigger, count]) => ({
      trigger: trigger as TriggerType,
      count: count as number,
    }));

  const totalTriggers = Object.values(triggerCounts).reduce((sum, count) => sum + count, 0);
  const topTrigger = sortedTriggers[0];
  const topTriggerPercentage = topTrigger ? Math.round((topTrigger.count / totalTriggers) * 100) : 0;

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
        <div className="px-4 pb-8 overflow-y-auto space-y-8">
          {/* Hero + quick stats */}
          <section className="pt-3 space-y-4">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white p-5 shadow-md">
              <div className="absolute -right-10 -top-10 w-36 h-36 bg-white/10 rounded-full blur-2xl"></div>
              <div className="absolute -left-8 bottom-0 w-28 h-28 bg-white/10 rounded-full blur-xl"></div>

              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/60 shadow-lg">
                  <img src={selectedDog.photoUrl} alt={selectedDog.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white/80">Today with</p>
                  <h3 className="text-2xl font-bold leading-tight">{selectedDog.name}</h3>
                  <p className="text-sm text-white/75 capitalize">{selectedDog.breed}</p>
                </div>
                <div className="bg-white/15 text-white px-3 py-2 rounded-lg text-xs font-semibold backdrop-blur-sm border border-white/20">
                  Healthy routine
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-4">
                <StatPill label="Symptoms" value={logs.length} />
                <StatPill label="Triggers" value={totalTriggers} />
                <StatPill label="Reminders" value={upcomingReminders.length} />
              </div>
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Log Symptom', onClick: () => navigate('/log-entry'), accent: 'from-blue-500 to-indigo-500' },
                { label: 'Log Trigger', onClick: () => navigate('/trigger-detective'), accent: 'from-cyan-500 to-blue-500' },
                { label: 'New Medication', onClick: () => navigate('/meds'), accent: 'from-emerald-500 to-teal-500' },
                { label: 'Profile & Tools', onClick: () => navigate('/profile'), accent: 'from-slate-600 to-slate-800' },
              ].map((action) => (
                <button
                  key={action.label}
                  onClick={action.onClick}
                  className="rounded-xl bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark p-4 text-left hover:-translate-y-0.5 hover:shadow-lg transition-all relative overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${action.accent} opacity-10`} />
                  <div className="relative">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/90 text-white mb-3">
                      <span className="text-lg font-bold">+</span>
                    </span>
                    <p className="font-semibold text-foreground-light dark:text-foreground-dark">{action.label}</p>
                    <p className="text-xs text-subtle-light dark:text-subtle-dark mt-1">Quick access</p>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Your Paws Section */}
          <section className="space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="text-xl text-foreground-light dark:text-foreground-dark tracking-tight">Your Paws</h2>
              <button
                onClick={() => navigate('/create-dog-profile')}
                className="px-3 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
              >
                Add Pet
              </button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-1">
              {dogs.map((dog) => (
                <button
                  key={dog.id}
                  onClick={() => setSelectedDog(dog)}
                  className={`flex-shrink-0 w-24 rounded-2xl border ${
                    selectedDog?.id === dog.id
                      ? 'border-blue-500 bg-blue-50/60 dark:border-blue-400 dark:bg-blue-900/20'
                      : 'border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark'
                  } p-2 flex flex-col items-center gap-2 transition-all`}
                >
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white dark:border-gray-700 shadow-sm">
                    <img src={dog.photoUrl} alt={dog.name} className="w-full h-full object-cover" />
                  </div>
                  <span
                    className={`text-sm font-semibold ${
                      selectedDog?.id === dog.id ? 'text-blue-600 dark:text-blue-400' : 'text-foreground-light dark:text-foreground-dark'
                    }`}
                  >
                    {dog.name}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* Allergen Alerts */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl text-foreground-light dark:text-foreground-dark tracking-tight">
                Allergen Alerts
              </h2>
              {allergenError && (
                <button
                  onClick={fetchLocationAndWeather}
                  className="text-sm bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
                >
                  Retry Location
                </button>
              )}
            </div>

            {/* Location Section */}
            <div className="relative rounded-xl overflow-hidden shadow-lg mb-6">
              {allergenLoading ? (
                <div className="w-full h-60 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <div className="text-white">Loading location...</div>
                </div>
              ) : (
                <>
                  {/* Static Map Background */}
                  {location?.lat && location?.lon && (
                    <div className="relative h-60 w-full">
                      <img
                        src={`https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/pin-s+3b82f6(${location.lon},${location.lat})/${location.lon},${location.lat},12,0/600x300@2x?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw`}
                        alt="Location Map"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to OpenStreetMap tiles if MapBox fails
                          const target = e.target as HTMLImageElement;
                          const zoom = 12;
                          const tileSize = 256;
                          const x = Math.floor((location.lon + 180) / 360 * Math.pow(2, zoom));
                          const y = Math.floor((1 - Math.log(Math.tan(location.lat * Math.PI / 180) + 1 / Math.cos(location.lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom));
                          target.src = `https://tile.openstreetmap.org/${zoom}/${x}/${y}.png`;
                        }}
                      />

                      {/* Gradient overlay for better text readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                      {/* Location Pin Marker */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full">
                        <svg className="w-10 h-10 text-blue-500 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0C7.802 0 4.403 3.403 4.403 7.602c0 6.243 7.597 16.398 7.597 16.398s7.597-10.155 7.597-16.398C19.597 3.403 16.198 0 12 0zm0 11.25c-2.07 0-3.75-1.68-3.75-3.75S9.93 3.75 12 3.75s3.75 1.68 3.75 3.75-1.68 3.75-3.75 3.75z"/>
                        </svg>
                      </div>
                    </div>
                  )}

                  {/* Location and Weather Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h2 className="text-2xl font-bold drop-shadow-md">{location?.city || 'Your Location'}</h2>
                        <p className="text-white/90 text-sm drop-shadow">
                          {location?.country ? `${location.country.toUpperCase()}` : 'Current Location'}
                        </p>
                      </div>
                      {location?.lat && location?.lon && (
                        <a
                          href={`https://www.google.com/maps?q=${location.lat},${location.lon}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white/20 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm hover:bg-white/30 transition-colors"
                        >
                          Open Map →
                        </a>
                      )}
                    </div>

                    {/* Weather Info */}
                    <div className="bg-black/50 backdrop-blur-md rounded-lg p-3 flex items-center gap-3 border border-white/20">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {weather?.description === 'Clear' || weather?.description === 'Sunny' ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                          )}
                        </svg>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white drop-shadow-lg">{weather?.temp || '--'}°F</p>
                        <p className="text-white/90 text-sm drop-shadow">{weather?.description || 'Loading...'}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Today's Allergens */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground-light dark:text-foreground-dark">Today's Allergens</h3>
                <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                  Live updates
                </span>
              </div>

              {weather && (
                <>
                  <AllergenCard
                    icon={PollenIcon}
                    title={(() => {
                      const pollenLevel = Math.min(10, Math.round((weather.aqi / 15) * 1.2));
                      if (pollenLevel >= 7) return "High Pollen";
                      if (pollenLevel >= 4) return "Moderate Pollen";
                      return "Low Pollen";
                    })()}
                    subtitle={`Estimated from air quality`}
                    level={Math.min(10, Math.round((weather.aqi / 15) * 1.2))}
                    maxLevel={10}
                    colorClass={(() => {
                      const pollenLevel = Math.min(10, Math.round((weather.aqi / 15) * 1.2));
                      if (pollenLevel >= 7) return "bg-red-500";
                      if (pollenLevel >= 4) return "bg-yellow-500";
                      return "bg-green-500";
                    })()}
                  />

                  <AllergenCard
                    icon={AirQualityIcon}
                    title={(() => {
                      if (weather.aqi >= 100) return "Unhealthy Air Quality";
                      if (weather.aqi >= 50) return "Moderate Air Quality";
                      return "Good Air Quality";
                    })()}
                    subtitle={`AQI: ${weather.aqi}`}
                    level={weather.aqi}
                    maxLevel={150}
                    colorClass={(() => {
                      if (weather.aqi >= 100) return "bg-red-500";
                      if (weather.aqi >= 50) return "bg-yellow-500";
                      return "bg-green-500";
                    })()}
                  />
                </>
              )}
            </div>

            {/* Recommendations */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground-light dark:text-foreground-dark">Recommendations</h3>

              {weather && (() => {
                const pollenLevel = Math.min(10, Math.round((weather.aqi / 15) * 1.2));
                const aqi = weather.aqi;
                const recommendations = [];

                // Determine pollen severity
                const isHighPollen = pollenLevel >= 7;
                const isModeratePollen = pollenLevel >= 4 && pollenLevel < 7;
                const isLowPollen = pollenLevel < 4;

                // Determine air quality severity
                const isPoorAir = aqi >= 100;
                const isModerateAir = aqi >= 50 && aqi < 100;
                const isGoodAir = aqi < 50;

                // Generate recommendations based on conditions
                if (isLowPollen && isGoodAir) {
                  // Great conditions
                  recommendations.push({
                    icon: SunIcon,
                    text: "Perfect day for outdoor activities with your pup!"
                  });
                  recommendations.push({
                    icon: PawPrintIcon,
                    text: "Enjoy longer walks - allergen levels are low today."
                  });
                  recommendations.push({
                    icon: HourglassIcon,
                    text: "Consider visiting the dog park or trying a new trail."
                  });
                } else if (isHighPollen || isPoorAir) {
                  // Poor conditions
                  recommendations.push({
                    icon: HourglassIcon,
                    text: isHighPollen ? "High pollen alert - limit outdoor time to short potty breaks." : "Poor air quality - keep outdoor activities brief."
                  });
                  recommendations.push({
                    icon: PawPrintIcon,
                    text: "Wipe paws and coat after walks to remove allergens."
                  });
                  recommendations.push({
                    icon: AirPurifierIcon,
                    text: "Run air purifiers indoors and keep windows closed."
                  });
                } else {
                  // Moderate conditions
                  recommendations.push({
                    icon: HourglassIcon,
                    text: isModeratePollen ? "Moderate pollen - walk during early morning or evening." : "Moderate air quality - monitor your dog for symptoms."
                  });
                  recommendations.push({
                    icon: PawPrintIcon,
                    text: "Wipe paws after walks to remove pollen and allergens."
                  });
                  recommendations.push({
                    icon: AirPurifierIcon,
                    text: "Use air purifiers in main living areas."
                  });
                }

                return recommendations.map((rec, index) => (
                  <RecommendationCard
                    key={index}
                    icon={rec.icon}
                    text={rec.text}
                  />
                ));
              })()}
            </div>
          </section>

          {/* Identified Patterns - Trigger Analysis */}
          <section className="mb-8">
            <h2 className="text-xl text-foreground-light dark:text-foreground-dark tracking-tight mb-4">
              Identified Patterns
            </h2>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-700 p-6 rounded-xl border border-gray-200 dark:border-gray-600">
              {totalTriggers === 0 ? (
                // Empty state when no trigger data
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ChartCombinedIcon className="w-8 h-8 text-blue-500 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No Patterns Yet
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Start logging triggers to discover patterns in your dog's allergies.
                  </p>
                  <button
                    onClick={() => navigate('/log-entry')}
                    className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Log a Trigger
                  </button>
                </div>
              ) : (
                <>
                  {/* Header with real data */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Top Trigger
                      </h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">
                          {topTrigger?.trigger || 'N/A'}
                        </span>
                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                          {topTriggerPercentage}%
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-cyan-600 dark:text-cyan-400 font-medium">Last 30 Days</span>
                  </div>

                  {/* Dynamic Bar Chart */}
                  <div className="space-y-3 mb-4">
                    {sortedTriggers.slice(0, 4).map(({ trigger, count }, index) => {
                      const percentage = Math.round((count / totalTriggers) * 100);
                      const colors = ['#3b82f6', '#10b981', '#a855f7', '#f97316'];
                      const color = colors[index % colors.length];
                      
                      return (
                        <div key={trigger}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-700 dark:text-gray-300 font-medium">{trigger}</span>
                            <span className="text-gray-500 dark:text-gray-400">{count} ({percentage}%)</span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%`, backgroundColor: color }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Stats row */}
                  <div className="flex gap-4 mb-4">
                    <div className="flex-1 bg-white/50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalTriggers}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Total Triggers</p>
                    </div>
                    <div className="flex-1 bg-white/50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{sortedTriggers.length}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Trigger Types</p>
                    </div>
                    <div className="flex-1 bg-white/50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{logs.length}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Symptoms</p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => navigate('/trigger-analysis')}
                    className="w-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-sm"
                  >
                    View Detailed Analysis
                  </button>
                </>
              )}
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
        <div className="px-4 pb-8 overflow-y-auto">
          {/* Your Paws Section - Empty State */}
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
            {/* Empty state card for adding first pet */}
            <button
              onClick={() => navigate('/create-dog-profile')}
              className="w-full bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-700 border-2 border-dashed border-blue-300 dark:border-blue-600 rounded-xl p-6 flex flex-col items-center justify-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
            >
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-3">
                <svg className="w-8 h-8 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">Add Your First Pet</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">Tap to get started</span>
            </button>
          </section>

          {/* Allergen Alerts - Always shows */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl text-foreground-light dark:text-foreground-dark tracking-tight">
                Allergen Alerts
              </h2>
            </div>

            {/* Location Section */}
            <div className="relative rounded-xl overflow-hidden shadow-lg mb-6">
              {allergenLoading ? (
                <div className="w-full h-60 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <div className="text-white">Loading location...</div>
                </div>
              ) : (
                <>
                  {location?.lat && location?.lon && (
                    <div className="relative h-60 w-full">
                      <img
                        src={`https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/pin-s+3b82f6(${location.lon},${location.lat})/${location.lon},${location.lat},12,0/600x300@2x?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw`}
                        alt="Location Map"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          const zoom = 12;
                          const x = Math.floor((location.lon + 180) / 360 * Math.pow(2, zoom));
                          const y = Math.floor((1 - Math.log(Math.tan(location.lat * Math.PI / 180) + 1 / Math.cos(location.lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom));
                          target.src = `https://tile.openstreetmap.org/${zoom}/${x}/${y}.png`;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full">
                        <svg className="w-10 h-10 text-blue-500 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0C7.802 0 4.403 3.403 4.403 7.602c0 6.243 7.597 16.398 7.597 16.398s7.597-10.155 7.597-16.398C19.597 3.403 16.198 0 12 0zm0 11.25c-2.07 0-3.75-1.68-3.75-3.75S9.93 3.75 12 3.75s3.75 1.68 3.75 3.75-1.68 3.75-3.75 3.75z"/>
                        </svg>
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h2 className="text-2xl font-bold drop-shadow-md">{location?.city || 'Your Location'}</h2>
                        <p className="text-white/90 text-sm drop-shadow">
                          {location?.country ? `${location.country.toUpperCase()}` : 'Current Location'}
                        </p>
                      </div>
                    </div>
                    <div className="bg-black/50 backdrop-blur-md rounded-lg p-3 flex items-center gap-3 border border-white/20">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {weather?.description === 'Clear' || weather?.description === 'Sunny' ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                          )}
                        </svg>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white drop-shadow-lg">{weather?.temp || '--'}°F</p>
                        <p className="text-white/90 text-sm drop-shadow">{weather?.description || 'Loading...'}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Today's Allergens */}
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-semibold text-foreground-light dark:text-foreground-dark">Today's Allergens</h3>
              {weather && (
                <>
                  <AllergenCard
                    icon={PollenIcon}
                    title={(() => {
                      const pollenLevel = Math.min(10, Math.round((weather.aqi / 15) * 1.2));
                      if (pollenLevel >= 7) return "High Pollen";
                      if (pollenLevel >= 4) return "Moderate Pollen";
                      return "Low Pollen";
                    })()}
                    subtitle={`Estimated from air quality`}
                    level={Math.min(10, Math.round((weather.aqi / 15) * 1.2))}
                    maxLevel={10}
                    colorClass={(() => {
                      const pollenLevel = Math.min(10, Math.round((weather.aqi / 15) * 1.2));
                      if (pollenLevel >= 7) return "bg-red-500";
                      if (pollenLevel >= 4) return "bg-yellow-500";
                      return "bg-green-500";
                    })()}
                  />
                  <AllergenCard
                    icon={AirQualityIcon}
                    title={(() => {
                      if (weather.aqi >= 100) return "Unhealthy Air Quality";
                      if (weather.aqi >= 50) return "Moderate Air Quality";
                      return "Good Air Quality";
                    })()}
                    subtitle={`AQI: ${weather.aqi}`}
                    level={weather.aqi}
                    maxLevel={150}
                    colorClass={(() => {
                      if (weather.aqi >= 100) return "bg-red-500";
                      if (weather.aqi >= 50) return "bg-yellow-500";
                      return "bg-green-500";
                    })()}
                  />
                </>
              )}
            </div>
          </section>

          {/* Identified Patterns - Empty State */}
          <section className="mb-8">
            <h2 className="text-xl text-foreground-light dark:text-foreground-dark tracking-tight mb-4">
              Identified Patterns
            </h2>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-700 p-6 rounded-xl border border-gray-200 dark:border-gray-600">
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ChartCombinedIcon className="w-8 h-8 text-blue-500 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No Patterns Yet
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Add a pet and start logging to discover patterns.
                </p>
              </div>
            </div>
          </section>

          {/* Symptom Distribution - Empty State */}
          <section className="mb-8">
            <h2 className="text-xl text-foreground-light dark:text-foreground-dark tracking-tight mb-4">
              Symptom Distribution
            </h2>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No Symptoms Logged
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Symptom data will appear here once you start logging.
                </p>
              </div>
            </div>
          </section>

          {/* Upcoming Reminders - Empty State */}
          <section className="mb-8">
            <h2 className="text-xl text-foreground-light dark:text-foreground-dark tracking-tight mb-4">
              Upcoming Reminders
            </h2>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No Reminders Set
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Add medications and treatments to see reminders here.
                </p>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

const StatPill: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="text-center">
    <p className="text-xs text-white/70">{label}</p>
    <p className="text-lg font-bold">{value}</p>
  </div>
);

export default Dashboard;