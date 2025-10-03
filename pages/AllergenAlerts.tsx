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
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-foreground-light dark:text-foreground-dark">Allergen Alerts</h1>
                    {error && (
                        <button
                            onClick={fetchLocationAndWeather}
                            className="text-sm bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
                        >
                            Retry Location
                        </button>
                    )}
                </div>
                
                {/* Location Section */}
                <div className="relative rounded-xl overflow-hidden shadow-lg">
                    {loading ? (
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
