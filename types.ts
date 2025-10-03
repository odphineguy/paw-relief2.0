export interface Dog {
    id: string;
    userId: string;
    name: string;
    breed: string;
    age: number;
    weight: number;
    photoUrl: string;
    knownAllergies: string[];
    birthday: string;
}

export enum SymptomType {
    EXCESSIVE_SCRATCHING = "Excessive Scratching",
    RED_IRRITATED_SKIN = "Red/Irritated Skin",
    WATERY_EYES = "Watery Eyes",
    EAR_INFECTIONS = "Ear Infections",
    PAW_LICKING = "Paw Licking",
    HOT_SPOTS = "Hot Spots",
    SNEEZING = "Sneezing",
    DIGESTIVE_ISSUES = "Digestive Issues",
}

export enum TriggerType {
    FOOD = "Food",
    WALK_LOCATION = "Walk Location",
    WEATHER = "Weather",
    POLLEN = "Pollen",
    HOUSEHOLD_PRODUCT = "Household Product",
    ENVIRONMENTAL_CHANGE = "Environmental Change",
    UNKNOWN = "Unknown",
}

export interface SymptomLog {
    id: string;
    dogId: string;
    symptomType: SymptomType;
    severity: number; // 1-5
    triggers: TriggerType[];
    notes: string;
    photoUrl?: string;
    createdAt: string; // ISO string
}

export enum ReminderType {
    MEDICATION = "Medication",
    TOPICAL_TREATMENT = "Topical Treatment",
    EAR_CLEANING = "Ear Cleaning",
    PAW_WIPES = "Paw Wipes",
    VET_VISIT = "Vet Visit",
    BIRTHDAY = "Birthday",
}

export interface Reminder {
    id: string;
    dogId: string;
    type: ReminderType;
    name: string;
    dosage?: string;
    nextDue: string; // ISO string
    repeatInterval: 'daily' | 'weekly' | 'monthly' | null;
    completed: boolean;
}

export interface AllergenAlerts {
    pollenCount: {
        level: 'Low' | 'Moderate' | 'High' | 'Very High';
        value: number;
    };
    airQuality: {
        level: 'Good' | 'Moderate' | 'Unhealthy';
        value: number;
    };
}

export interface ProductInfo {
    barcode: string;
    name: string;
    imageUrl: string;
    ingredients: string[];
}

export interface TriggerLog {
    id: string;
    dogId: string;
    triggerType: TriggerType;
    details: Record<string, any>;
    location?: string;
    weatherConditions?: string;
    pollenLevel?: string;
    notes?: string;
    loggedDate: string; // ISO string
    createdAt: string; // ISO string
}