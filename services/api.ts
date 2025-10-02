import { Dog, SymptomLog, Reminder, AllergenAlerts, ProductInfo } from '../types';
import { supabase } from '../lib/supabase';

// Helper function to get current user ID
// For now, we'll use a temporary user ID until we add authentication
const getCurrentUserId = (): string => {
  // TODO: Replace with actual auth when implemented
  return '00000000-0000-0000-0000-000000000001';
};

// ===== DOG FUNCTIONS =====

export const getDogs = async (): Promise<Dog[]> => {
  const userId = getCurrentUserId();

  const { data, error } = await supabase
    .from('dogs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching dogs:', error);
    throw error;
  }

  // Map database fields to match our TypeScript interface
  return (data || []).map(dog => ({
    id: dog.id,
    userId: dog.user_id,
    name: dog.name,
    breed: dog.breed,
    age: dog.age,
    weight: dog.weight,
    photoUrl: dog.photo_url,
    knownAllergies: dog.known_allergies || [],
    birthday: dog.birthday,
  }));
};

export const addDog = async (dog: Omit<Dog, 'id'> & { id?: string }): Promise<Dog> => {
  const userId = getCurrentUserId();

  const dogData = {
    user_id: userId,
    name: dog.name,
    breed: dog.breed,
    age: dog.age,
    weight: dog.weight,
    photo_url: dog.photoUrl || `https://picsum.photos/seed/${dog.name}/200/200`,
    known_allergies: dog.knownAllergies || [],
    birthday: dog.birthday,
  };

  const { data, error } = await supabase
    .from('dogs')
    .insert([dogData])
    .select()
    .single();

  if (error) {
    console.error('Error adding dog:', error);
    throw error;
  }

  return {
    id: data.id,
    userId: data.user_id,
    name: data.name,
    breed: data.breed,
    age: data.age,
    weight: data.weight,
    photoUrl: data.photo_url,
    knownAllergies: data.known_allergies || [],
    birthday: data.birthday,
  };
};

export const updateDog = async (dogId: string, updates: Partial<Dog>): Promise<Dog> => {
  const updateData: any = {};

  if (updates.name !== undefined) updateData.name = updates.name;
  if (updates.breed !== undefined) updateData.breed = updates.breed;
  if (updates.age !== undefined) updateData.age = updates.age;
  if (updates.weight !== undefined) updateData.weight = updates.weight;
  if (updates.photoUrl !== undefined) updateData.photo_url = updates.photoUrl;
  if (updates.knownAllergies !== undefined) updateData.known_allergies = updates.knownAllergies;
  if (updates.birthday !== undefined) updateData.birthday = updates.birthday;

  const { data, error } = await supabase
    .from('dogs')
    .update(updateData)
    .eq('id', dogId)
    .select()
    .single();

  if (error) {
    console.error('Error updating dog:', error);
    throw error;
  }

  return {
    id: data.id,
    userId: data.user_id,
    name: data.name,
    breed: data.breed,
    age: data.age,
    weight: data.weight,
    photoUrl: data.photo_url,
    knownAllergies: data.known_allergies || [],
    birthday: data.birthday,
  };
};

// ===== SYMPTOM LOG FUNCTIONS =====

export const getSymptomLogs = async (dogId: string): Promise<SymptomLog[]> => {
  const { data, error } = await supabase
    .from('symptom_logs')
    .select('*')
    .eq('dog_id', dogId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching symptom logs:', error);
    throw error;
  }

  return (data || []).map(log => ({
    id: log.id,
    dogId: log.dog_id,
    symptomType: log.symptom_type,
    severity: log.severity,
    triggers: log.triggers || [],
    notes: log.notes || '',
    photoUrl: log.photo_url,
    createdAt: log.created_at,
  }));
};

export const addSymptomLog = async (log: Omit<SymptomLog, 'id' | 'createdAt'>): Promise<SymptomLog> => {
  const logData = {
    dog_id: log.dogId,
    symptom_type: log.symptomType,
    severity: log.severity,
    triggers: log.triggers || [],
    notes: log.notes || '',
    photo_url: log.photoUrl,
  };

  const { data, error } = await supabase
    .from('symptom_logs')
    .insert([logData])
    .select()
    .single();

  if (error) {
    console.error('Error adding symptom log:', error);
    throw error;
  }

  return {
    id: data.id,
    dogId: data.dog_id,
    symptomType: data.symptom_type,
    severity: data.severity,
    triggers: data.triggers || [],
    notes: data.notes || '',
    photoUrl: data.photo_url,
    createdAt: data.created_at,
  };
};

// ===== REMINDER FUNCTIONS =====

export const getReminders = async (dogId: string): Promise<Reminder[]> => {
  const { data, error } = await supabase
    .from('reminders')
    .select('*')
    .eq('dog_id', dogId)
    .order('next_due', { ascending: true });

  if (error) {
    console.error('Error fetching reminders:', error);
    throw error;
  }

  return (data || []).map(reminder => ({
    id: reminder.id,
    dogId: reminder.dog_id,
    type: reminder.type,
    name: reminder.name,
    dosage: reminder.dosage,
    nextDue: reminder.next_due,
    repeatInterval: reminder.repeat_interval,
    completed: reminder.completed,
  }));
};

export const addReminder = async (reminder: Omit<Reminder, 'id'>): Promise<Reminder> => {
  const reminderData = {
    dog_id: reminder.dogId,
    type: reminder.type,
    name: reminder.name,
    dosage: reminder.dosage,
    next_due: reminder.nextDue,
    repeat_interval: reminder.repeatInterval,
    completed: reminder.completed || false,
  };

  const { data, error } = await supabase
    .from('reminders')
    .insert([reminderData])
    .select()
    .single();

  if (error) {
    console.error('Error adding reminder:', error);
    throw error;
  }

  return {
    id: data.id,
    dogId: data.dog_id,
    type: data.type,
    name: data.name,
    dosage: data.dosage,
    nextDue: data.next_due,
    repeatInterval: data.repeat_interval,
    completed: data.completed,
  };
};

export const updateReminder = async (reminderId: string, completed: boolean): Promise<Reminder> => {
  const { data, error } = await supabase
    .from('reminders')
    .update({ completed })
    .eq('id', reminderId)
    .select()
    .single();

  if (error) {
    console.error('Error updating reminder:', error);
    throw error;
  }

  return {
    id: data.id,
    dogId: data.dog_id,
    type: data.type,
    name: data.name,
    dosage: data.dosage,
    nextDue: data.next_due,
    repeatInterval: data.repeat_interval,
    completed: data.completed,
  };
};

// ===== ALLERGEN ALERTS =====
// These remain mock for now as they typically come from external APIs
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

export const getLocalAllergenAlerts = async (): Promise<AllergenAlerts> => {
  // TODO: Integrate with real weather/pollen API
  return MOCK_ALERTS;
};

// ===== PRODUCT FUNCTIONS =====

export const scanBarcode = async (barcode: string): Promise<ProductInfo | null> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('barcode', barcode)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // Not found
      return null;
    }
    console.error('Error scanning barcode:', error);
    throw error;
  }

  return {
    barcode: data.barcode,
    name: data.name,
    imageUrl: data.image_url,
    ingredients: data.ingredients || [],
  };
};

export const addProduct = async (product: ProductInfo): Promise<ProductInfo> => {
  const productData = {
    barcode: product.barcode,
    name: product.name,
    image_url: product.imageUrl,
    ingredients: product.ingredients || [],
  };

  const { data, error } = await supabase
    .from('products')
    .insert([productData])
    .select()
    .single();

  if (error) {
    console.error('Error adding product:', error);
    throw error;
  }

  return {
    barcode: data.barcode,
    name: data.name,
    imageUrl: data.image_url,
    ingredients: data.ingredients || [],
  };
};

// Legacy localStorage functions - keeping for backwards compatibility
export const saveDogs = async (dogs: Dog[]): Promise<void> => {
  console.warn('saveDogs is deprecated - data now stored in Supabase');
};
