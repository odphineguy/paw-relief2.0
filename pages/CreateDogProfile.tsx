import React, { useState, useRef, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDogs } from '../context/DogContext';
import { Dog } from '../types';
import Header from '../components/Header';
import { ArrowLeftIcon, DogIcon } from '../components/icons';
import { format } from 'date-fns';
import { uploadPetImage } from '../services/api';

const CreateDogProfile: React.FC = () => {
    const navigate = useNavigate();
    const dogContext = useDogs();
    const dogs = dogContext.dogs;
    const addDog = dogContext.addDog;
    const deleteDog = dogContext.deleteDog;

    const [isAddingNew, setIsAddingNew] = useState(false);
    const [editingDog, setEditingDog] = useState<Dog | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        breed: '',
        age: '',
        weight: '',
        birthday: '',
        knownAllergies: '',
        currentMedications: '',
        photoUrl: ''
    });
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [dogToDelete, setDogToDelete] = useState<Dog | null>(null);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }
            
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('Image size should be less than 5MB');
                return;
            }
            
            setSelectedImage(file);
            
            // Create preview URL
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
            
            // Update form data with the file name for now
            setFormData(prev => ({
                ...prev,
                photoUrl: file.name
            }));
        }
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
        setImagePreview('');
        setFormData(prev => ({
            ...prev,
            photoUrl: ''
        }));
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleAddNewDog = () => {
        setFormData({
            name: '',
            breed: '',
            age: '',
            weight: '',
            birthday: '',
            knownAllergies: '',
            currentMedications: '',
            photoUrl: ''
        });
        setSelectedImage(null);
        setImagePreview('');
        setEditingDog(null);
        setIsAddingNew(true);
    };

    const handleEditDog = (dog: Dog) => {
        setFormData({
            name: dog.name,
            breed: dog.breed,
            age: dog.age?.toString() || '',
            weight: dog.weight?.toString() || '',
            birthday: dog.birthday || '',
            knownAllergies: dog.knownAllergies?.join(', ') || '',
            currentMedications: dog.currentMedications || '',
            photoUrl: dog.photoUrl || ''
        });
        setSelectedImage(null);
        setImagePreview(dog.photoUrl || '');
        setEditingDog(dog);
        setIsAddingNew(true);
    };

    const handleSaveDog = async () => {
        if (!formData.name.trim()) {
            alert('Please enter a dog name');
            return;
        }

        try {
            let finalPhotoUrl = formData.photoUrl;

            // Handle image upload if a new image was selected
            if (selectedImage) {
                try {
                    // Upload to Supabase Storage and get permanent URL
                    finalPhotoUrl = await uploadPetImage(selectedImage, formData.name);
                } catch (uploadError) {
                    console.error('Failed to upload image:', uploadError);
                    alert('Failed to upload image. Using default placeholder.');
                    finalPhotoUrl = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&h=400&fit=crop';
                }
            } else if (!formData.photoUrl && editingDog) {
                // Keep existing photo when editing
                finalPhotoUrl = editingDog.photoUrl;
            }

            const dogData = {
                name: formData.name,
                breed: formData.breed,
                age: formData.age ? parseInt(formData.age) : undefined,
                weight: formData.weight ? parseFloat(formData.weight) : undefined,
                birthday: formData.birthday,
                knownAllergies: formData.knownAllergies ? formData.knownAllergies.split(',').map(a => a.trim()).filter(a => a) : [],
                currentMedications: formData.currentMedications,
                photoUrl: finalPhotoUrl
            };

            if (editingDog) {
                // Update existing dog
                await addDog({ ...editingDog, ...dogData });
            } else {
                // Add new dog
                await addDog(dogData);
            }

            setIsAddingNew(false);
            setEditingDog(null);
            setFormData({
                name: '',
                breed: '',
                age: '',
                weight: '',
                birthday: '',
                knownAllergies: '',
                currentMedications: '',
                photoUrl: ''
            });
        } catch (error) {
            console.error('Failed to save dog profile', error);
            alert('Failed to save dog profile. Please try again.');
        }
    };

    const handleCancel = () => {
        setIsAddingNew(false);
        setEditingDog(null);
        setSelectedImage(null);
        setImagePreview('');
        setFormData({
            name: '',
            breed: '',
            age: '',
            weight: '',
            birthday: '',
            knownAllergies: '',
            currentMedications: '',
            photoUrl: ''
        });
    };

    const handleDeleteClick = (dog: Dog) => {
        setDogToDelete(dog);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!dogToDelete) return;

        try {
            await deleteDog(dogToDelete.id);
            setShowDeleteModal(false);
            setDogToDelete(null);
        } catch (error) {
            console.error('Failed to delete dog profile', error);
            alert('Failed to delete dog profile. Please try again.');
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
        setDogToDelete(null);
    };

    const InfoRow = ({ label, value, onEdit }: { label: string; value: string; onEdit?: () => void }) => (
        <div className="flex justify-between items-center py-3 border-b border-border-light dark:border-border-dark last:border-b-0">
            <div>
                <p className="text-sm font-medium text-subtle-light dark:text-subtle-dark">{label}</p>
                <p className="text-base font-semibold text-foreground-light dark:text-foreground-dark">{value}</p>
            </div>
            {onEdit && (
                <button onClick={onEdit} className="p-1 hover:bg-background-light dark:hover:bg-background-dark rounded">
                    <svg className="w-4 h-4 text-subtle-light dark:text-subtle-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </button>
            )}
        </div>
    );

    const InputRow = ({ label, field, type = "text", placeholder = "" }: {
        label: string;
        field: keyof typeof formData;
        type?: string;
        placeholder?: string;
    }) => {
        return (
            <div className="py-3 border-b border-border-light dark:border-border-dark last:border-b-0">
                <label className="block text-sm font-medium text-subtle-light dark:text-subtle-dark mb-1">{label}</label>
                <input
                    type={type}
                    value={formData[field]}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    placeholder={placeholder}
                    className="w-full text-base font-semibold text-foreground-light dark:text-foreground-dark bg-transparent border-none outline-none placeholder-subtle-light dark:placeholder-subtle-dark"
                />
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full bg-background-light dark:bg-background-dark">
            <Header title="" showBackButton={true} />

            <div className="flex-1 p-4 space-y-6 overflow-y-auto">
                {/* Page Title */}
                <h1 className="text-2xl font-bold text-foreground-light dark:text-foreground-dark">Pet Management</h1>
                
                {/* Your Dogs Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-foreground-light dark:text-foreground-dark">Your Paws</h2>
                        <button 
                            onClick={handleAddNewDog}
                            className="bg-primary text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 hover:bg-primary/90 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span>Add New Pet</span>
                        </button>
                    </div>
                    
                    {dogs.length === 0 && (
                        <div className="bg-card-light dark:bg-card-dark p-8 rounded-xl border border-border-light dark:border-border-dark text-center">
                            <DogIcon className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                            <p className="text-gray-600 dark:text-gray-400">No pets added yet</p>
                            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Add your first pet to get started</p>
                        </div>
                    )}
                </div>

                {/* Add/Edit Dog Form - Consolidated Single Card */}
                {isAddingNew && (
                    <div className="space-y-6">
                        <div className="bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden">
                            <div className="p-6 space-y-6">
                                {/* Photo Upload Section */}
                                <div className="flex flex-col items-center space-y-4 pb-6 border-b border-border-light dark:border-border-dark">
                                    {/* Image Preview */}
                                    {(imagePreview || selectedImage) && (
                                        <div className="relative">
                                            <img
                                                src={imagePreview}
                                                alt="Pet preview"
                                                className="w-32 h-32 rounded-full object-cover border-2 border-primary"
                                            />
                                            <button
                                                onClick={handleRemoveImage}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    )}

                                    {/* Upload Button */}
                                    <div className="text-center">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                            id="image-upload"
                                        />
                                        <label
                                            htmlFor="image-upload"
                                            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg cursor-pointer hover:bg-primary/90 transition-colors"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            {selectedImage ? 'Change Photo' : 'Upload Photo'}
                                        </label>
                                        <p className="text-sm text-subtle-light dark:text-subtle-dark mt-2">
                                            JPG, PNG up to 5MB
                                        </p>
                                    </div>
                                </div>

                                {/* Basic Information */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-subtle-light dark:text-subtle-dark mb-1">Name</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                            placeholder="Enter dog's name"
                                            className="w-full p-2 text-base font-semibold text-foreground-light dark:text-foreground-dark bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-subtle-light dark:text-subtle-dark mb-1">Breed</label>
                                        <input
                                            type="text"
                                            value={formData.breed}
                                            onChange={(e) => setFormData(prev => ({ ...prev, breed: e.target.value }))}
                                            placeholder="Enter breed"
                                            className="w-full p-2 text-base font-semibold text-foreground-light dark:text-foreground-dark bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded outline-none"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-subtle-light dark:text-subtle-dark mb-1">Age</label>
                                            <input
                                                type="number"
                                                value={formData.age}
                                                onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                                                placeholder="Age in years"
                                                className="w-full p-2 text-base font-semibold text-foreground-light dark:text-foreground-dark bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-subtle-light dark:text-subtle-dark mb-1">Weight</label>
                                            <input
                                                type="number"
                                                value={formData.weight}
                                                onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                                                placeholder="Weight in lb"
                                                className="w-full p-2 text-base font-semibold text-foreground-light dark:text-foreground-dark bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-subtle-light dark:text-subtle-dark mb-1">Birthday</label>
                                        <input
                                            type="date"
                                            value={formData.birthday}
                                            onChange={(e) => setFormData(prev => ({ ...prev, birthday: e.target.value }))}
                                            className="w-full p-2 text-base font-semibold text-foreground-light dark:text-foreground-dark bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-subtle-light dark:text-subtle-dark mb-1">Known Allergies</label>
                                        <input
                                            type="text"
                                            value={formData.knownAllergies}
                                            onChange={(e) => setFormData(prev => ({ ...prev, knownAllergies: e.target.value }))}
                                            placeholder="Enter allergies separated by commas"
                                            className="w-full p-2 text-base font-semibold text-foreground-light dark:text-foreground-dark bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-subtle-light dark:text-subtle-dark mb-1">Current Medications</label>
                                        <input
                                            type="text"
                                            value={formData.currentMedications}
                                            onChange={(e) => setFormData(prev => ({ ...prev, currentMedications: e.target.value }))}
                                            placeholder="Enter current medications"
                                            className="w-full p-2 text-base font-semibold text-foreground-light dark:text-foreground-dark bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-3">
                            <button
                                onClick={handleCancel}
                                className="flex-1 bg-card-light dark:bg-card-dark text-foreground-light dark:text-foreground-dark border border-border-light dark:border-border-dark font-semibold py-3 px-4 rounded-lg hover:bg-background-light dark:hover:bg-background-dark transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveDog}
                                className="flex-1 bg-primary text-white font-semibold py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30"
                            >
                                {editingDog ? 'Update Profile' : 'Save Profile'}
                            </button>
                        </div>
                    </div>
                )}

                {/* View/Edit Existing Dog Details */}
                {!isAddingNew && dogs.length > 0 && (
                    <div className="space-y-6">
                        {dogs.map((dog) => (
                            <div key={dog.id} className="bg-card-light dark:bg-card-dark rounded-2xl overflow-hidden shadow-lg">
                                {/* Pet Image - Large Hero Style */}
                                <div className="relative h-64 bg-gradient-to-br from-primary/20 to-primary/5">
                                    <img
                                        src={dog.photoUrl}
                                        alt={dog.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Pet Name and Breed */}
                                <div className="px-6 pt-6 pb-4 border-b border-border-light dark:border-border-dark">
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{dog.name}</h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-lg">{dog.breed}</p>
                                </div>

                                {/* All Pet Information */}
                                <div className="p-6 space-y-5">
                                    {/* Basic Information */}
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="bg-background-light dark:bg-background-dark rounded-lg p-4">
                                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Age</p>
                                            <p className="text-xl font-bold text-gray-900 dark:text-white">{dog.age ? `${dog.age} years` : 'Not set'}</p>
                                        </div>
                                        <div className="bg-background-light dark:bg-background-dark rounded-lg p-4">
                                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Weight</p>
                                            <p className="text-xl font-bold text-gray-900 dark:text-white">{dog.weight ? `${dog.weight} lb` : 'Not set'}</p>
                                        </div>
                                    </div>

                                    {/* Birthday */}
                                    <div className="bg-background-light dark:bg-background-dark rounded-lg p-4">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Birthday</p>
                                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {dog.birthday ? format(new Date(dog.birthday), 'MMMM d, yyyy') : 'Not set'}
                                        </p>
                                    </div>

                                    {/* Health Information */}
                                    <div className="bg-background-light dark:bg-background-dark rounded-lg p-4">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Known Allergies</p>
                                        {dog.knownAllergies && dog.knownAllergies.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {dog.knownAllergies.map((allergy, idx) => (
                                                    <span key={idx} className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-sm font-medium">
                                                        {allergy}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-base font-semibold text-gray-900 dark:text-white">None</p>
                                        )}
                                    </div>

                                    <div className="bg-background-light dark:bg-background-dark rounded-lg p-4">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Current Medications</p>
                                        <p className="text-base font-semibold text-gray-900 dark:text-white">{dog.currentMedications || 'None'}</p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="space-y-3">
                                        <button
                                            onClick={() => handleEditDog(dog)}
                                            className="w-full bg-primary text-white px-6 py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2 shadow-lg shadow-primary/30"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            <span>Edit Pet Profile</span>
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(dog)}
                                            className="w-full bg-red-500 text-white px-6 py-4 rounded-xl font-bold text-lg hover:bg-red-600 transition-colors flex items-center justify-center space-x-2 shadow-lg shadow-red-500/30"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            <span>Delete Pet Profile</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && dogToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-xl">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
                                <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                Delete Pet Profile
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                                Are you sure you want to delete <strong>{dogToDelete.name}</strong>'s profile? This will permanently remove all associated data including symptoms, triggers, and reminders. This action cannot be undone.
                            </p>
                            <div className="flex space-x-3">
                                <button
                                    onClick={handleDeleteCancel}
                                    className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold py-3 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteConfirm}
                                    className="flex-1 bg-red-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-red-600 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateDogProfile;
