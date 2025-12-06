import { Dog, SymptomLog, Reminder, AllergenAlerts, ProductInfo, TriggerLog, TriggerType } from '../types';
import { supabase } from '../lib/supabase';

// Helper function to get current user ID
const getCurrentUserId = async (): Promise<string> => {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  return user.id;
};

// Helper function to upload image to Supabase Storage
export const uploadPetImage = async (file: File, petName: string): Promise<string> => {
  const userId = await getCurrentUserId();

  // Create unique filename with timestamp
  const timestamp = Date.now();
  const fileExtension = file.name.split('.').pop();
  const fileName = `${userId}/${petName.replace(/\s+/g, '_')}_${timestamp}.${fileExtension}`;

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from('pet-photos')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Error uploading image:', error);
    throw error;
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('pet-photos')
    .getPublicUrl(data.path);

  return publicUrl;
};

// ===== DOG FUNCTIONS =====

export const getDogs = async (): Promise<Dog[]> => {
  const userId = await getCurrentUserId();

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
  const userId = await getCurrentUserId();

  const dogData = {
    user_id: userId,
    name: dog.name,
    breed: dog.breed,
    age: dog.age,
    weight: dog.weight,
    photo_url: dog.photoUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&h=400&fit=crop',
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

export const deleteDog = async (dogId: string): Promise<void> => {
  // First, delete all related data (cascade delete)
  // Delete symptom logs
  const { error: symptomError } = await supabase
    .from('symptom_logs')
    .delete()
    .eq('dog_id', dogId);

  if (symptomError) {
    console.error('Error deleting symptom logs:', symptomError);
    throw symptomError;
  }

  // Delete trigger logs
  const { error: triggerError } = await supabase
    .from('trigger_logs')
    .delete()
    .eq('dog_id', dogId);

  if (triggerError) {
    console.error('Error deleting trigger logs:', triggerError);
    throw triggerError;
  }

  // Delete reminders
  const { error: reminderError } = await supabase
    .from('reminders')
    .delete()
    .eq('dog_id', dogId);

  if (reminderError) {
    console.error('Error deleting reminders:', reminderError);
    throw reminderError;
  }

  // Finally, delete the dog
  const { error: dogError } = await supabase
    .from('dogs')
    .delete()
    .eq('id', dogId);

  if (dogError) {
    console.error('Error deleting dog:', dogError);
    throw dogError;
  }
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

export const updateSymptomLog = async (logId: string, updates: Partial<SymptomLog>): Promise<SymptomLog> => {
  const updateData: any = {};

  if (updates.symptomType !== undefined) updateData.symptom_type = updates.symptomType;
  if (updates.severity !== undefined) updateData.severity = updates.severity;
  if (updates.triggers !== undefined) updateData.triggers = updates.triggers;
  if (updates.notes !== undefined) updateData.notes = updates.notes;
  if (updates.photoUrl !== undefined) updateData.photo_url = updates.photoUrl;

  const { data, error } = await supabase
    .from('symptom_logs')
    .update(updateData)
    .eq('id', logId)
    .select()
    .single();

  if (error) {
    console.error('Error updating symptom log:', error);
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

export const deleteSymptomLog = async (logId: string): Promise<void> => {
  const { error } = await supabase
    .from('symptom_logs')
    .delete()
    .eq('id', logId);

  if (error) {
    console.error('Error deleting symptom log:', error);
    throw error;
  }
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
  try {
    // First check our local database for cached products
    console.log('Checking local database for cached product:', barcode);
    const { data: localData, error: localError } = await supabase
      .from('products')
      .select('*')
      .eq('barcode', barcode)
      .single();

    if (!localError && localData) {
      console.log('Found product in local cache');
      return {
        barcode: localData.barcode,
        name: localData.name,
        imageUrl: localData.image_url,
        ingredients: localData.ingredients || [],
      };
    }

    // Try OpenFoodFacts API
    console.log('Fetching product from OpenFoodFacts:', barcode);
    const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}.json`);

    if (!response.ok) {
      throw new Error(`OpenFoodFacts API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.status === 1 && data.product) {
      const product = data.product;

      // Extract ingredients list
      let ingredients: string[] = [];
      if (product.ingredients_text) {
        // Split by common separators and clean up
        ingredients = product.ingredients_text
          .split(/[,;]/)
          .map((ing: string) => ing.trim())
          .filter((ing: string) => ing.length > 0);
      } else if (product.ingredients) {
        // If ingredients is an array of objects
        ingredients = product.ingredients.map((ing: any) => ing.text || ing.id || '').filter(Boolean);
      }

      const productInfo: ProductInfo = {
        barcode: barcode,
        name: product.product_name || product.product_name_en || 'Unknown Product',
        imageUrl: product.image_url || product.image_front_url || 'https://via.placeholder.com/200x200?text=No+Image',
        ingredients: ingredients,
      };

      // Cache the product in our database for faster future lookups
      try {
        await addProduct(productInfo);
      } catch (cacheError) {
        console.log('Could not cache product (may already exist):', cacheError);
      }

      return productInfo;
    }

    // If not found in OpenFoodFacts, return null (already checked cache at start)
    console.log('Product not found in OpenFoodFacts or local database');
    return null;

  } catch (error) {
    console.error('Error scanning barcode:', error);
    // Return null on any error
    return null;
  }
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

// ===== TRIGGER LOG FUNCTIONS =====

export const getTriggerLogs = async (dogId: string): Promise<TriggerLog[]> => {
  const { data, error } = await supabase
    .from('trigger_logs')
    .select('*')
    .eq('dog_id', dogId)
    .order('logged_date', { ascending: false });

  if (error) {
    console.error('Error fetching trigger logs:', error);
    throw error;
  }

  return data.map(log => ({
    id: log.id,
    dogId: log.dog_id,
    triggerType: log.trigger_type as TriggerType,
    details: log.details || {},
    location: log.location,
    weatherConditions: log.weather_conditions,
    pollenLevel: log.pollen_level,
    notes: log.notes,
    loggedDate: log.logged_date,
    createdAt: log.created_at,
  }));
};

export const addTriggerLog = async (triggerLog: Omit<TriggerLog, 'id' | 'createdAt'>): Promise<TriggerLog> => {
  const logData = {
    dog_id: triggerLog.dogId,
    trigger_type: triggerLog.triggerType,
    details: triggerLog.details || {},
    location: triggerLog.location,
    weather_conditions: triggerLog.weatherConditions,
    pollen_level: triggerLog.pollenLevel,
    notes: triggerLog.notes,
    logged_date: triggerLog.loggedDate,
  };

  const { data, error } = await supabase
    .from('trigger_logs')
    .insert([logData])
    .select()
    .single();

  if (error) {
    console.error('Error adding trigger log:', error);
    throw error;
  }

  return {
    id: data.id,
    dogId: data.dog_id,
    triggerType: data.trigger_type as TriggerType,
    details: data.details || {},
    location: data.location,
    weatherConditions: data.weather_conditions,
    pollenLevel: data.pollen_level,
    notes: data.notes,
    loggedDate: data.logged_date,
    createdAt: data.created_at,
  };
};

// ===== USER PROFILE FUNCTIONS =====

export interface UserProfile {
  id: string;
  userId: string;
  displayName: string | null;
  avatarUrl: string | null;
  phone: string | null;
  subscriptionTier: 'free' | 'premium' | 'trial';
  subscriptionExpiresAt: string | null;
  // Privacy Settings
  essentialDataCollection: boolean;
  analyticsUsageData: boolean;
  crashReporting: boolean;
  locationTracking: boolean;
  healthDataSharing: boolean;
  marketingData: boolean;
  thirdPartySharing: boolean;
  // Notification Settings
  pushNotifications: boolean;
  emailNotifications: boolean;
  medicationReminders: boolean;
  allergenAlerts: boolean;
  weeklySummary: boolean;
  // App Preferences
  preferredUnits: 'imperial' | 'metric';
  theme: 'light' | 'dark' | 'system';
  language: string;
  createdAt: string;
  updatedAt: string;
}

export const getUserProfile = async (): Promise<UserProfile | null> => {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // Profile doesn't exist, create one
      return createUserProfile();
    }
    console.error('Error fetching user profile:', error);
    throw error;
  }

  return mapProfileFromDb(data);
};

export const createUserProfile = async (): Promise<UserProfile> => {
  const userId = await getCurrentUserId();
  const { data: userData } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('user_profiles')
    .insert([{
      user_id: userId,
      display_name: userData.user?.user_metadata?.full_name || userData.user?.email,
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }

  return mapProfileFromDb(data);
};

export const updateUserProfile = async (updates: Partial<UserProfile>): Promise<UserProfile> => {
  const userId = await getCurrentUserId();

  const updateData: any = {};
  if (updates.displayName !== undefined) updateData.display_name = updates.displayName;
  if (updates.avatarUrl !== undefined) updateData.avatar_url = updates.avatarUrl;
  if (updates.phone !== undefined) updateData.phone = updates.phone;
  if (updates.subscriptionTier !== undefined) updateData.subscription_tier = updates.subscriptionTier;
  if (updates.subscriptionExpiresAt !== undefined) updateData.subscription_expires_at = updates.subscriptionExpiresAt;
  // Privacy settings
  if (updates.essentialDataCollection !== undefined) updateData.essential_data_collection = updates.essentialDataCollection;
  if (updates.analyticsUsageData !== undefined) updateData.analytics_usage_data = updates.analyticsUsageData;
  if (updates.crashReporting !== undefined) updateData.crash_reporting = updates.crashReporting;
  if (updates.locationTracking !== undefined) updateData.location_tracking = updates.locationTracking;
  if (updates.healthDataSharing !== undefined) updateData.health_data_sharing = updates.healthDataSharing;
  if (updates.marketingData !== undefined) updateData.marketing_data = updates.marketingData;
  if (updates.thirdPartySharing !== undefined) updateData.third_party_sharing = updates.thirdPartySharing;
  // Notification settings
  if (updates.pushNotifications !== undefined) updateData.push_notifications = updates.pushNotifications;
  if (updates.emailNotifications !== undefined) updateData.email_notifications = updates.emailNotifications;
  if (updates.medicationReminders !== undefined) updateData.medication_reminders = updates.medicationReminders;
  if (updates.allergenAlerts !== undefined) updateData.allergen_alerts = updates.allergenAlerts;
  if (updates.weeklySummary !== undefined) updateData.weekly_summary = updates.weeklySummary;
  // App preferences
  if (updates.preferredUnits !== undefined) updateData.preferred_units = updates.preferredUnits;
  if (updates.theme !== undefined) updateData.theme = updates.theme;
  if (updates.language !== undefined) updateData.language = updates.language;
  
  updateData.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('user_profiles')
    .update(updateData)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }

  return mapProfileFromDb(data);
};

const mapProfileFromDb = (data: any): UserProfile => ({
  id: data.id,
  userId: data.user_id,
  displayName: data.display_name,
  avatarUrl: data.avatar_url,
  phone: data.phone,
  subscriptionTier: data.subscription_tier,
  subscriptionExpiresAt: data.subscription_expires_at,
  essentialDataCollection: data.essential_data_collection,
  analyticsUsageData: data.analytics_usage_data,
  crashReporting: data.crash_reporting,
  locationTracking: data.location_tracking,
  healthDataSharing: data.health_data_sharing,
  marketingData: data.marketing_data,
  thirdPartySharing: data.third_party_sharing,
  pushNotifications: data.push_notifications,
  emailNotifications: data.email_notifications,
  medicationReminders: data.medication_reminders,
  allergenAlerts: data.allergen_alerts,
  weeklySummary: data.weekly_summary,
  preferredUnits: data.preferred_units,
  theme: data.theme,
  language: data.language,
  createdAt: data.created_at,
  updatedAt: data.updated_at,
});

// ===== DATA EXPORT FUNCTION (GDPR Compliance) =====

export interface UserDataExport {
  exportDate: string;
  user: {
    email: string;
    createdAt: string;
  };
  profile: UserProfile | null;
  dogs: Dog[];
  symptomLogs: SymptomLog[];
  triggerLogs: TriggerLog[];
  reminders: Reminder[];
}

export const exportUserData = async (): Promise<UserDataExport> => {
  const userId = await getCurrentUserId();
  const { data: userData } = await supabase.auth.getUser();

  // Get all user data
  const [profile, dogs] = await Promise.all([
    getUserProfile().catch(() => null),
    getDogs(),
  ]);

  // Get all logs and reminders for all dogs
  const allSymptomLogs: SymptomLog[] = [];
  const allTriggerLogs: TriggerLog[] = [];
  const allReminders: Reminder[] = [];

  for (const dog of dogs) {
    const [symptoms, triggers, reminders] = await Promise.all([
      getSymptomLogs(dog.id),
      getTriggerLogs(dog.id),
      getReminders(dog.id),
    ]);
    allSymptomLogs.push(...symptoms);
    allTriggerLogs.push(...triggers);
    allReminders.push(...reminders);
  }

  return {
    exportDate: new Date().toISOString(),
    user: {
      email: userData.user?.email || '',
      createdAt: userData.user?.created_at || '',
    },
    profile,
    dogs,
    symptomLogs: allSymptomLogs,
    triggerLogs: allTriggerLogs,
    reminders: allReminders,
  };
};

// ===== DELETE USER DATA (GDPR Right to be Forgotten) =====

export const deleteAllUserData = async (): Promise<void> => {
  const userId = await getCurrentUserId();

  // Delete all dogs (which cascades to symptom_logs, trigger_logs, reminders)
  const dogs = await getDogs();
  for (const dog of dogs) {
    await deleteDog(dog.id);
  }

  // Delete user profile
  const { error: profileError } = await supabase
    .from('user_profiles')
    .delete()
    .eq('user_id', userId);

  if (profileError) {
    console.error('Error deleting user profile:', profileError);
  }

  // Note: The auth.users record should be deleted via Supabase dashboard or admin API
  console.log('User data deleted. Auth account must be deleted separately via Supabase dashboard.');
};

// Legacy localStorage functions - keeping for backwards compatibility
export const saveDogs = async (dogs: Dog[]): Promise<void> => {
  console.warn('saveDogs is deprecated - data now stored in Supabase');
};
