
import React, { createContext, useState, useContext, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { Dog } from '../types';
import { getDogs, addDog as apiAddDog, updateDog as apiUpdateDog } from '../services/api';

interface DogContextType {
    dogs: Dog[];
    selectedDog: Dog | null;
    setSelectedDog: (dog: Dog) => void;
    addDog: (dogData: Omit<Dog, 'id'> & { id?: string }) => Promise<void>;
    loading: boolean;
}

const DogContext = createContext<DogContextType | undefined>(undefined);

export const DogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [dogs, setDogs] = useState<Dog[]>([]);
    const [selectedDog, setSelectedDogState] = useState<Dog | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDogs = async () => {
            try {
                const dogsData = await getDogs();
                setDogs(dogsData);
                if (dogsData.length > 0) {
                    setSelectedDogState(dogsData[0]);
                }
            } catch (error) {
                console.error("Failed to fetch dogs", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDogs();
    }, []);

    const setSelectedDog = useCallback((dog: Dog) => {
        setSelectedDogState(dog);
    }, []);

    const addDog = useCallback(async (dogData: Omit<Dog, 'id'> & { id?: string }) => {
        try {
            // Set default values for required fields
            const dogWithDefaults = {
                ...dogData,
                knownAllergies: dogData.knownAllergies || [],
                currentMedications: dogData.currentMedications || '',
                photoUrl: dogData.photoUrl || 'https://picsum.photos/seed/' + dogData.name + '/200/200',
                userId: dogData.userId || 'user-123'
            };

            let newDog: Dog;

            if (dogData.id) {
                // Update existing dog
                newDog = await apiUpdateDog(dogData.id, dogWithDefaults);
            } else {
                // Add new dog
                newDog = await apiAddDog(dogWithDefaults);
            }

            // Update local state
            setDogs(prevDogs => {
                const existingIndex = prevDogs.findIndex(dog => dog.id === newDog.id);
                if (existingIndex >= 0) {
                    // Update existing dog
                    const updatedDogs = [...prevDogs];
                    updatedDogs[existingIndex] = newDog;
                    return updatedDogs;
                } else {
                    // Add new dog
                    return [...prevDogs, newDog];
                }
            });

            // Set as selected if it's the first dog or if updating the currently selected dog
            if (dogs.length === 0 || selectedDog?.id === newDog.id) {
                setSelectedDogState(newDog);
            }
        } catch (error) {
            console.error('Failed to add/update dog', error);
            throw error;
        }
    }, [dogs, selectedDog]);

    const value = useMemo(
        () => ({ dogs, selectedDog, setSelectedDog, addDog, loading }),
        [dogs, selectedDog, setSelectedDog, addDog, loading]
    );

    return (
        <DogContext.Provider value={value}>
            {children}
        </DogContext.Provider>
    );
};

export const useDogs = (): DogContextType => {
    const context = useContext(DogContext);
    if (context === undefined) {
        throw new Error('useDogs must be used within a DogProvider');
    }
    return context;
};
