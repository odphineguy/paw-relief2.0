import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { DashboardIcon, ClipboardListIcon, PillBottleIcon, PawIcon, PlusCircleIcon } from './icons';

const BottomNav: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Hide bottom nav on onboarding pages
    const onboardingRoutes = ['/splash', '/login', '/onboarding', '/welcome', '/subscription'];
    if (onboardingRoutes.includes(location.pathname)) {
        return null;
    }

    const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
        `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200 ${
            isActive ? 'text-primary' : 'text-subtle-light dark:text-subtle-dark hover:text-primary'
        }`;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-card-dark border-t border-border-light dark:border-border-dark pb-safe-area shadow-up">
            <div className="flex items-center justify-between max-w-md mx-auto h-16 px-2 relative">
                <div className="flex-1 h-full">
                    <NavLink to="/dashboard" className={navLinkClasses}>
                        <DashboardIcon className="w-6 h-6" />
                        <span className="text-[10px] font-medium">Home</span>
                    </NavLink>
                </div>
                
                <div className="flex-1 h-full">
                    <NavLink to="/logs" className={navLinkClasses}>
                        <ClipboardListIcon className="w-6 h-6" />
                        <span className="text-[10px] font-medium">Logs</span>
                    </NavLink>
                </div>

                {/* Floating Center Button */}
                <div className="flex-1 h-full relative flex justify-center">
                    <button
                        onClick={() => navigate('/log-entry')}
                        className="absolute -top-8 w-16 h-16 bg-primary hover:bg-primary-hover text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105 active:scale-95 ring-4 ring-white dark:ring-card-dark z-50"
                        aria-label="New Entry"
                    >
                        <PlusCircleIcon className="w-8 h-8" />
                    </button>
                </div>

                <div className="flex-1 h-full">
                    <NavLink to="/meds" className={navLinkClasses}>
                        <PillBottleIcon className="w-6 h-6" />
                        <span className="text-[10px] font-medium">Meds</span>
                    </NavLink>
                </div>

                <div className="flex-1 h-full">
                    <NavLink to="/profile" className={navLinkClasses}>
                        <PawIcon className="w-6 h-6" />
                        <span className="text-[10px] font-medium">Profile</span>
                    </NavLink>
                </div>
            </div>
        </div>
    );
};

export default BottomNav;