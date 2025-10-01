import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { ArrowLeftIcon } from '../components/icons';

const AllergenAlerts: React.FC = () => {
    const navigate = useNavigate();

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
            <header className="sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm z-10 p-4 border-b border-border-light dark:border-border-dark flex items-center">
                <button onClick={() => navigate(-1)} className="mr-4 p-2 rounded-full hover:bg-card-light dark:hover:bg-card-dark">
                    <ArrowLeftIcon className="w-6 h-6 text-foreground-light dark:text-foreground-dark"/>
                </button>
            </header>

            <div className="flex-1 p-4 space-y-6 overflow-y-auto">
                {/* Map Section */}
                <div className="relative bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden h-60 shadow-md">
                    {/* Phoenix, AZ Map Mock */}
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <p className="text-blue-800 dark:text-blue-200 font-semibold">Phoenix, AZ</p>
                            <p className="text-blue-600 dark:text-blue-300 text-sm">Metropolitan Area</p>
                        </div>
                    </div>
                    
                    {/* Location and Weather Overlay */}
                    <div className="absolute bottom-4 left-4 text-white">
                        <p className="text-xl font-bold">Phoenix, AZ</p>
                        <p className="text-lg font-semibold flex items-center">
                            <SunIcon />
                            <span className="ml-1">Sunny, 95°F</span>
                        </p>
                    </div>
                </div>

                {/* Today's Allergens */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-foreground-light dark:text-foreground-dark">Today's Allergens</h2>
                    
                    <AllergenCard
                        icon={PollenIcon}
                        title="High Pollen"
                        subtitle="Pollen Count: 8.2"
                        level={8.2}
                        maxLevel={10}
                        colorClass="bg-red-500"
                    />
                    
                    <AllergenCard
                        icon={AirQualityIcon}
                        title="Moderate Air Quality"
                        subtitle="AQI: 65"
                        level={65}
                        maxLevel={150}
                        colorClass="bg-yellow-500"
                    />
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
