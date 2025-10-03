import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { ArrowLeftIcon } from '../components/icons';

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

const AllergenAlerts: React.FC = () => {
    const navigate = useNavigate();
    const [location, setLocation] = useState<LocationData | null>(null);
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchLocationAndWeather();
    }, []);

    const fetchLocationAndWeather = async () => {
        try {
            setLoading(true);

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

            // Fetch location name and weather data using Open-Meteo (free, no API key needed)
            // First, get location name from reverse geocoding
            console.log("Fetching location name...");
            const geoResponse = await fetch(
                `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}`
            );
            const geoData = await geoResponse.json();
            console.log("Geocoding response:", geoData);

            const cityName = geoData.results?.[0]?.name || 'Your Location';
            const countryCode = geoData.results?.[0]?.country_code || '';

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
            setError(err instanceof Error ? err.message : "Failed to load location data");
            // Set default Phoenix data as fallback
            setLocation({ city: 'Phoenix', country: 'US', lat: 33.4484, lon: -112.0740 });
            setWeather({ temp: 95, description: 'Sunny', aqi: 65 });
        } finally {
            setLoading(false);
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
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-3">
                    <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
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

    const RecommendationCard = ({ icon: Icon, text }: {
        icon: React.ElementType;
        text: string;
    }) => (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 flex items-center shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-3">
                <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-gray-900 dark:text-white text-base">{text}</p>
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-background-light dark:bg-background-dark">
            <Header title="" showBackButton={true} />

            <div className="flex-1 p-4 space-y-6 overflow-y-auto">
                {/* Page Title */}
                <h1 className="text-2xl font-bold text-foreground-light dark:text-foreground-dark">Allergen Alerts</h1>
                
                {/* Map Section */}
                <div className="relative bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden h-60 shadow-md">
                    {loading ? (
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="text-gray-600 dark:text-gray-300">Loading location...</div>
                        </div>
                    ) : (
                        <>
                            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <p className="text-blue-800 dark:text-blue-200 font-semibold">
                                        {location?.city || 'Your Location'}
                                    </p>
                                    <p className="text-blue-600 dark:text-blue-300 text-sm">
                                        {location?.country ? `${location.country.toUpperCase()}` : 'Current Location'}
                                    </p>
                                </div>
                            </div>

                            {/* Location and Weather Overlay */}
                            <div className="absolute bottom-4 left-4 text-white">
                                <p className="text-xl font-bold">{location?.city || 'Loading...'}</p>
                                <p className="text-lg font-semibold flex items-center">
                                    <SunIcon />
                                    <span className="ml-1">
                                        {weather?.description || 'Loading...'}, {weather?.temp || '--'}°F
                                    </span>
                                </p>
                            </div>
                        </>
                    )}
                </div>

                {/* Today's Allergens */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-foreground-light dark:text-foreground-dark">Today's Allergens</h2>

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
                    <h2 className="text-xl font-bold text-foreground-light dark:text-foreground-dark">Recommendations</h2>
                    
                    <RecommendationCard
                        icon={PawPrintIcon}
                        text="Wipe paws after walks to remove pollen."
                    />
                    
                    <RecommendationCard
                        icon={HourglassIcon}
                        text="Limit outdoor time during peak pollen hours."
                    />
                    
                    <RecommendationCard
                        icon={AirPurifierIcon}
                        text="Use an air purifier indoors to filter allergens."
                    />
                </div>
            </div>
        </div>
    );
};

export default AllergenAlerts;
