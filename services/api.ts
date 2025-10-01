import { Dog, SymptomLog, SymptomType, TriggerType, Reminder, ReminderType, AllergenAlerts, ProductInfo } from '../types';
// FIX: Consolidate date-fns imports to use named exports from the main package.
// FIX: Removed `setYear` from import as it caused an error.
import { addYears, isPast, isToday } from 'date-fns';

// Mock Data
const MOCK_DOGS: Dog[] = [
    {
        id: '1',
        userId: 'user-123',
        name: 'Rocko',
        breed: 'Golden Retriever',
        age: 5,
        weight: 75,
        photoUrl: '/assets/Rocko.png',
        knownAllergies: ['Chicken', 'Pollen', 'Corn'],
        birthday: '2019-05-15T00:00:00.000Z',
    },
    {
        id: '2',
        userId: 'user-123',
        name: 'Lucy',
        breed: 'Beagle',
        age: 3,
        weight: 25,
        photoUrl: '/assets/Lucy.png',
        knownAllergies: ['Beef', 'Dust Mites', 'Wheat'],
        birthday: '2021-08-20T00:00:00.000Z',
    },
    {
        id: '3',
        userId: 'user-123',
        name: 'Kitty',
        breed: 'Mixed Breed',
        age: 2,
        weight: 30,
        photoUrl: '/assets/Kitty.png',
        knownAllergies: ['Fish', 'Dust'],
        birthday: '2022-03-10T00:00:00.000Z',
    },
];

const MOCK_SYMPTOM_LOGS: SymptomLog[] = [
    {
        id: 's1',
        dogId: '1',
        symptomType: SymptomType.EXCESSIVE_SCRATCHING,
        severity: 4,
        triggers: [TriggerType.POLLEN],
        notes: 'Very itchy after our walk in the park.',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 's2',
        dogId: '1',
        symptomType: SymptomType.PAW_LICKING,
        severity: 3,
        triggers: [TriggerType.WALK_LOCATION],
        notes: 'Licking paws a lot tonight.',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 's3',
        dogId: '2',
        symptomType: SymptomType.DIGESTIVE_ISSUES,
        severity: 5,
        triggers: [TriggerType.FOOD],
        notes: 'Ate something with beef, had a bad reaction.',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
];

const MOCK_REMINDERS: Reminder[] = [
    {
        id: 'r1',
        dogId: '1',
        type: ReminderType.MEDICATION,
        name: 'Apoquel',
        dosage: '1 tablet',
        nextDue: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        repeatInterval: 'daily',
        completed: false,
    },
    {
        id: 'r2',
        dogId: '1',
        type: ReminderType.PAW_WIPES,
        name: 'Wipe paws after walk',
        nextDue: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
        repeatInterval: 'daily',
        completed: false,
    },
     {
        id: 'r3',
        dogId: '2',
        type: ReminderType.VET_VISIT,
        name: 'Annual Checkup',
        nextDue: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        repeatInterval: null,
        completed: false,
    },
];

const MOCK_ALERTS: AllergenAlerts = {
    pollenCount: {
        level: 'High',
        value: 9.7,
    },
    airQuality: {
        level: 'Moderate',
        value: 68,
    },
};

const MOCK_PRODUCTS: ProductInfo[] = [
    {
        barcode: '123456789',
        name: 'Healthy Paws Chicken & Rice Formula',
        imageUrl: 'https://picsum.photos/seed/dogfood1/200/200',
        ingredients: ['Deboned Chicken', 'Brown Rice', 'Peas', 'Carrots', 'Chicken Meal', 'Corn Gluten Meal', 'Salt'],
    },
     {
        barcode: '987654321',
        name: 'Grain-Free Beef & Sweet Potato Bites',
        imageUrl: 'https://picsum.photos/seed/dogfood2/200/200',
        ingredients: ['Beef', 'Sweet Potato', 'Lentils', 'Flaxseed', 'Dried Kelp', 'Wheat Flour', 'Rosemary Extract'],
    }
];

// Simulate API delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const getDogs = async (): Promise<Dog[]> => {
    await delay(500);
    
    // Check if we have saved dogs in localStorage
    const savedDogs = localStorage.getItem('paw-relief-dogs');
    if (savedDogs) {
        return JSON.parse(savedDogs);
    }
    
    // Return mock data if no saved data
    return MOCK_DOGS;
};

export const getSymptomLogs = async (dogId: string): Promise<SymptomLog[]> => {
    await delay(700);
    return MOCK_SYMPTOM_LOGS.filter(log => log.dogId === dogId).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const addSymptomLog = async (log: Omit<SymptomLog, 'id' | 'createdAt'>): Promise<SymptomLog> => {
    await delay(1000);
    const newLog: SymptomLog = {
        ...log,
        id: `s${Math.random()}`,
        createdAt: new Date().toISOString(),
    };
    MOCK_SYMPTOM_LOGS.unshift(newLog);
    return newLog;
};

export const getReminders = async (dogId: string): Promise<Reminder[]> => {
    await delay(600);
    
    // Only return medication-related reminders, no birthday reminders
    const standardReminders = MOCK_REMINDERS.filter(r => r.dogId === dogId);
    
    return standardReminders.sort((a,b) => new Date(a.nextDue).getTime() - new Date(b.nextDue).getTime());
};

export const updateReminder = async(reminderId: string, completed: boolean): Promise<Reminder> => {
    await delay(300);
    const reminder = MOCK_REMINDERS.find(r => r.id === reminderId);
    if (!reminder) throw new Error("Reminder not found");
    reminder.completed = completed;
    return reminder;
}

export const getLocalAllergenAlerts = async (): Promise<AllergenAlerts> => {
    await delay(1200);
    return MOCK_ALERTS;
};

export const scanBarcode = async (barcode: string): Promise<ProductInfo | null> => {
    await delay(1500);
    const product = MOCK_PRODUCTS.find(p => p.barcode === barcode);
    // In this mock, we'll just return a random product to simulate a successful scan
    return MOCK_PRODUCTS[Math.floor(Math.random() * MOCK_PRODUCTS.length)];
};

// New functions for persistent dog storage
export const saveDogs = async (dogs: Dog[]): Promise<void> => {
    await delay(300);
    localStorage.setItem('paw-relief-dogs', JSON.stringify(dogs));
};

export const addDog = async (dog: Omit<Dog, 'id'> & { id?: string }): Promise<Dog> => {
    await delay(500);
    
    // Get current dogs
    const currentDogs = await getDogs();
    
    // Create new dog with ID
    const newDog: Dog = {
        ...dog,
        id: dog.id || `dog-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        userId: dog.userId || 'user-123', // Default user ID
    };
    
    // Add to current dogs
    const updatedDogs = [...currentDogs, newDog];
    
    // Save to localStorage
    await saveDogs(updatedDogs);
    
    return newDog;
};

export const updateDog = async (dogId: string, updates: Partial<Dog>): Promise<Dog> => {
    await delay(500);
    
    // Get current dogs
    const currentDogs = await getDogs();
    
    // Find and update the dog
    const dogIndex = currentDogs.findIndex(d => d.id === dogId);
    if (dogIndex === -1) {
        throw new Error('Dog not found');
    }
    
    const updatedDog = { ...currentDogs[dogIndex], ...updates };
    currentDogs[dogIndex] = updatedDog;
    
    // Save to localStorage
    await saveDogs(currentDogs);
    
    return updatedDog;
};