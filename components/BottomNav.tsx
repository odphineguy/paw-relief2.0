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
        `flex flex-col items-center justify-center space-y-1 transition-colors duration-200 ${
            isActive ? 'text-primary' : 'text-subtle-light dark:text-subtle-dark hover:text-primary'
        }`;

    return (
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto h-16 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm border-t border-border-light dark:border-border-dark flex items-center justify-around shadow-up">
            <NavLink to="/dashboard" className={navLinkClasses}>
                <DashboardIcon />
                <span className="text-xs font-semibold">Dashboard</span>
            </NavLink>
            <NavLink to="/logs" className={navLinkClasses}>
                <ClipboardListIcon />
                <span className="text-xs font-semibold">Logs</span>
            </NavLink>

            <button
                onClick={() => navigate('/log-entry')}
                className="flex items-center justify-center w-16 h-16 -mt-8 bg-primary rounded-full text-white shadow-lg hover:bg-primary/90 transition-colors"
                aria-label="Log new entry"
            >
                <PlusCircleIcon className="w-10 h-10" />
            </button>

            <NavLink to="/meds" className={navLinkClasses}>
                <PillBottleIcon />
                <span className="text-xs font-semibold">Meds</span>
            </NavLink>
            <NavLink to="/profile" className={navLinkClasses}>
                <PawIcon />
                <span className="text-xs font-semibold">Profile</span>
            </NavLink>
        </div>
    );
};

export default BottomNav;