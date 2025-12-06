import React from 'react';

const Icon: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        {children}
    </svg>
);

export const HomeIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <Icon className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></Icon>
);

export const ClipboardListIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <Icon className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></Icon>
);

export const BellIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <Icon className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></Icon>
);

export const UserIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <Icon className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></Icon>
);

export const PlusCircleIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
    <Icon className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></Icon>
);

export const TrashIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <Icon className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></Icon>
);

export const PawIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <Icon className={className}>
        <circle cx="11" cy="4" r="2" />
        <circle cx="18" cy="8" r="2" />
        <circle cx="20" cy="16" r="2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z" />
    </Icon>
);

export const XIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <Icon className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></Icon>
);

export const ChevronRightIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    <Icon className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></Icon>
);

export const CalendarIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    <Icon className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></Icon>
);

export const CheckCircleIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <Icon className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></Icon>
);

export const ArrowLeftIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <Icon className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></Icon>
);

export const CakeIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0c-.454-.303-.977-.454-1.5-.454V4.5a2.25 2.25 0 012.25-2.25h10.5a2.25 2.25 0 012.25 2.25v11.046zM12 9.75a.375.375 0 01.375.375v2.25a.375.375 0 01-.75 0v-2.25a.375.375 0 01.375-.375z" />
    </Icon>
);

export const BarcodeIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        <path d="M6 4v16M10 4v16M14 4v16M18 4v16" />
    </Icon>
);

export const AlertTriangleIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </Icon>
);

export const SunIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </Icon>
);

export const MoonIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </Icon>
);

export const DashboardIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </Icon>
);

export const PillIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h8m-4-4v8m-8-4a8 8 0 1116 0 8 8 0 01-16 0z" />
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
    </Icon>
);

export const SyringeIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h16v16H4V4z" />
        <path d="M8 8h8v8H8V8z" />
        <path d="M12 4v4M12 16v4" />
    </Icon>
);

// Pet-specific icons
export const DogIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
        <circle cx="9" cy="9" r="1.5" />
        <circle cx="15" cy="9" r="1.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12c1.5-1 3-1 4 0" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 12c-1.5-1-3-1-4 0" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14v2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 16h4" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 4h12" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2 8h20" />
    </Icon>
);

export const BowlIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 11h18M4 11c0 3.3 2.7 6 6 6h4c3.3 0 6-2.7 6-6M7 11V8c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2v3" />
    </Icon>
);

export const VetIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        <circle cx="12" cy="12" r="10" />
    </Icon>
);

export const TreatIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 8l6-5 6 5v11a2 2 0 01-2 2H8a2 2 0 01-2-2V8z" />
        <path d="M12 3v5M9 11h6M9 15h6" />
    </Icon>
);

export const BoneIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 8h8M8 8v8M8 8H6a2 2 0 00-2 2v0a2 2 0 002 2h2M16 8v8M16 8h2a2 2 0 012 2v0a2 2 0 01-2 2h-2M8 16h8" />
    </Icon>
);  

export const PawPrintIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <Icon className={className}>
        <circle cx="9" cy="9" r="1.5" />
        <circle cx="15" cy="9" r="1.5" />
        <circle cx="12" cy="12" r="2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 15c1.5-1 3-1 4 0" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 15c-1.5-1-3-1-4 0" />
    </Icon>
);

export const DrumstickIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.4 15.63a7.875 6 135 1 1 6.23-6.23 4.5 3.43 135 0 0-6.23 6.23" />
        <path strokeLinecap="round" strokeLinejoin="round" d="m8.29 12.71-2.6 2.6a2.5 2.5 0 1 0-1.65 4.65A2.5 2.5 0 1 0 8.7 18.3l2.59-2.59" />
    </Icon>
);

export const PillBottleIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 11h-4a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h4" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 7v13a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
    </Icon>
);

export const ToiletIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 12h13a1 1 0 0 1 1 1 5 5 0 0 1-5 5h-.598a.5.5 0 0 0-.424.765l1.544 2.47a.5.5 0 0 1-.424.765H5.402a.5.5 0 0 1-.424-.765L7 18" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 18a5 5 0 0 1-5-5V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8" />
    </Icon>
);

export const FlameIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2c1 3 2.5 3.5 3.5 4.5A5 5 0 0 1 17 10a5 5 0 1 1-10 0c0-.3 0-.6.1-.9a2 2 0 1 0 3.3-2C8 4.5 11 2 12 2Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="m5 22 14-4" />
        <path strokeLinecap="round" strokeLinejoin="round" d="m5 18 14 4" />
    </Icon>
);

export const EarIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 8.5a6.5 6.5 0 1 1 13 0c0 6-6 6-6 10a3.5 3.5 0 1 1-7 0" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 8.5a2.5 2.5 0 0 0-5 0v1a2 2 0 1 1 0 4" />
    </Icon>
);

export const ScanEyeIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7V5a2 2 0 0 1 2-2h2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 3h2a2 2 0 0 1 2 2v2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 17v2a2 2 0 0 1-2 2h-2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21H5a2 2 0 0 1-2-2v-2" />
        <circle cx="12" cy="12" r="1" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.944 12.33a1 1 0 0 0 0-.66 7.5 7.5 0 0 0-13.888 0 1 1 0 0 0 0 .66 7.5 7.5 0 0 0 13.888 0" />
    </Icon>
);

export const FlameIcon2: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4" />
    </Icon>
);

export const BrainIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18V5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.997 5.125a4 4 0 0 1 2.526 5.77" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18a4 4 0 0 0 2-7.464" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18a4 4 0 0 1-2-7.464" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.003 5.125a4 4 0 0 0-2.526 5.77" />
    </Icon>
);

export const ChartBarIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 17V9" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 17V5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 17v-3" />
    </Icon>
);

export const VibrateIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m2 8 2 2-2 2 2 2-2 2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="m22 8-2 2 2 2-2 2 2 2" />
        <rect width="8" height="14" x="8" y="5" rx="1" />
    </Icon>
);

export const BugPlayIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19.655A6 6 0 0 1 6 14v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 3.97" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 15.003a1 1 0 0 1 1.517-.859l4.997 2.997a1 1 0 0 1 0 1.718l-4.997 2.997a1 1 0 0 1-1.517-.86z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.12 3.88 16 2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 5a4 4 0 0 1-3.55 3.97" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 21a4 4 0 0 1 3.81-4" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a4 4 0 0 0 3.55 3.97" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 13H2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="m8 2 1.88 1.88" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 7.13V6a3 3 0 1 1 6 0v1.13" />
    </Icon>
);

export const CatIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1.07 1 2.24 1 3.44C21 17.9 16.97 21 12 21s-9-3-9-7.56c0-1.25.5-2.4 1-3.44 0 0-1.89-6.42-.5-7 1.39-.58 4.72.23 6.5 2.23A9.04 9.04 0 0 1 12 5Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 14v.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 14v.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 16.25h1.5L12 17l-.75-.75Z" />
    </Icon>
);

export const ChartCombinedIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 14v7" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 10v11" />
        <path strokeLinecap="round" strokeLinejoin="round" d="m22 3-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 18v3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 14v7" />
    </Icon>
);

