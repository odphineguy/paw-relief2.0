import React, { useState, useRef, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDogs } from '../context/DogContext';
import { Dog } from '../types';
import Header from '../components/Header';
import { ArrowLeftIcon, PawIcon } from '../components/icons';

const CreateDogProfile: React.FC = () => {
    const navigate = useNavigate();
    const { dogs, addDog } = useDogs();
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

    const handleInputChange = useCallback((field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    }, []);

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
                // Create a unique filename
                const timestamp = Date.now();
                const fileExtension = selectedImage.name.split('.').pop();
                const fileName = `${formData.name.replace(/\s+/g, '_')}_${timestamp}.${fileExtension}`;
                
                // For now, we'll use a placeholder URL. In a real app, you'd upload to a server
                // or use a service like AWS S3, Cloudinary, etc.
                finalPhotoUrl = `/assets/pet-images/${fileName}`;
                
                // In a real application, you would upload the file here
                // For now, we'll just use the preview URL or a placeholder
                if (imagePreview) {
                    finalPhotoUrl = imagePreview;
                }
            } else if (!formData.photoUrl) {
                // Use placeholder if no image provided
                finalPhotoUrl = 'https://picsum.photos/seed/' + formData.name + '/200/200';
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
        const inputRef = useRef<HTMLInputElement>(null);
        
        // Use a key to force re-render when the form data changes (for editing)
        const inputKey = `${field}-${editingDog?.id || 'new'}`;
        
        return (
            <div className="py-3 border-b border-border-light dark:border-border-dark last:border-b-0">
                <label className="block text-sm font-medium text-subtle-light dark:text-subtle-dark mb-1">{label}</label>
                <input
                    key={inputKey}
                    ref={inputRef}
                    type={type}
                    defaultValue={formData[field]}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    placeholder={placeholder}
                    className="w-full text-base font-semibold text-foreground-light dark:text-foreground-dark bg-transparent border-none outline-none placeholder-subtle-light dark:placeholder-subtle-dark"
                />
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full bg-background-light dark:bg-background-dark">
            <header className="sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm z-10 p-4 border-b border-border-light dark:border-border-dark">
                <div className="flex items-center">
                    <button onClick={() => navigate(-1)} className="mr-4 p-2 rounded-full hover:bg-card-light dark:hover:bg-card-dark">
                        <ArrowLeftIcon className="w-6 h-6 text-foreground-light dark:text-foreground-dark"/>
                    </button>
                </div>
            </header>

            <div className="flex-1 p-4 space-y-6 overflow-y-auto">
                {/* Your Dogs Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-foreground-light dark:text-foreground-dark">Your Pets</h2>
                        <button 
                            onClick={handleAddNewDog}
                            className="bg-primary text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 hover:bg-primary/90 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span>Add New Dog</span>
                        </button>
                    </div>
                    
                    {dogs.length === 0 && (
                        <div className="bg-card-light dark:bg-card-dark p-8 rounded-xl border border-border-light dark:border-border-dark text-center">
                            <PawIcon className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                            <p className="text-gray-600 dark:text-gray-400">No pets added yet</p>
                            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Add your first pet to get started</p>
                        </div>
                    )}
                </div>

                {/* Add/Edit Dog Form */}
                {isAddingNew && (
                    <div className="space-y-6">
                        <div className="bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden">
                            <div className="p-4 border-b border-border-light dark:border-border-dark">
                                <h3 className="text-lg font-bold text-foreground-light dark:text-foreground-dark">
                                    {editingDog ? 'Edit Dog Profile' : 'Basic Information'}
                                </h3>
                            </div>
                            <div className="p-4 space-y-0">
                                <InputRow label="Name" field="name" placeholder="Enter dog's name" />
                                <InputRow label="Breed" field="breed" placeholder="Enter breed" />
                                <InputRow label="Age" field="age" type="number" placeholder="Enter age in years" />
                                <InputRow label="Weight" field="weight" type="number" placeholder="Enter weight in lb" />
                            </div>
                        </div>

                        {/* Photo Upload Section */}
                        <div className="bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden">
                            <div className="p-4 border-b border-border-light dark:border-border-dark">
                                <h3 className="text-lg font-bold text-foreground-light dark:text-foreground-dark">Pet Photo</h3>
                            </div>
                            <div className="p-4">
                                <div className="flex flex-col items-center space-y-4">
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
                            </div>
                        </div>

                        <div className="bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden">
                            <div className="p-4 border-b border-border-light dark:border-border-dark">
                                <h3 className="text-lg font-bold text-foreground-light dark:text-foreground-dark">Health Details</h3>
                            </div>
                            <div className="p-4 space-y-0">
                                <InputRow label="Known Allergies" field="knownAllergies" placeholder="Enter allergies separated by commas" />
                                <InputRow label="Current Medications" field="currentMedications" placeholder="Enter current medications" />
                            </div>
                        </div>

                        <div className="bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden">
                            <div className="p-4 border-b border-border-light dark:border-border-dark">
                                <h3 className="text-lg font-bold text-foreground-light dark:text-foreground-dark">Reminders</h3>
                            </div>
                            <div className="p-4 space-y-0">
                                <InputRow label="Birthday" field="birthday" type="date" />
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
                            <div key={dog.id} className="bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden">
                                {/* Pet Image */}
                                <div className="p-6 text-center">
                                    <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-primary">
                                        <img 
                                            src={dog.photoUrl} 
                                            alt={dog.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <h3 className="text-xl font-bold text-foreground-light dark:text-foreground-dark mb-2">{dog.name}</h3>
                                    <p className="text-gray-600 dark:text-gray-400">{dog.breed}</p>
                                </div>

                                {/* All Pet Information */}
                                <div className="p-4 space-y-4">
                                    {/* Basic Information */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Age</p>
                                            <p className="text-base font-semibold text-gray-900 dark:text-white">{dog.age ? `${dog.age} years` : 'Not set'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Weight</p>
                                            <p className="text-base font-semibold text-gray-900 dark:text-white">{dog.weight ? `${dog.weight} lb` : 'Not set'}</p>
                                        </div>
                                    </div>

                                    {/* Health Information */}
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Known Allergies</p>
                                        <p className="text-base font-semibold text-gray-900 dark:text-white">{dog.knownAllergies?.join(', ') || 'None'}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Current Medications</p>
                                        <p className="text-base font-semibold text-gray-900 dark:text-white">{dog.currentMedications || 'None'}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Birthday</p>
                                        <p className="text-base font-semibold text-gray-900 dark:text-white">{dog.birthday || 'Not set'}</p>
                                    </div>

                                    {/* Edit Button */}
                                    <div className="pt-4 border-t border-border-light dark:border-border-dark">
                                        <button 
                                            onClick={() => handleEditDog(dog)}
                                            className="w-full bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            <span>Edit Pet</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
};

export default CreateDogProfile;
