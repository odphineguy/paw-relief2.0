import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Onboarding: React.FC = () => {
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            id: 0,
            title: 'Welcome to Paw Relief',
            description: 'Track your dog\'s allergies with ease. Identify triggers, manage symptoms, and generate vet reports.',
            image: '/assets/pet-images/login.png',
            bgColor: 'bg-teal-700'
        },
        {
            id: 1,
            title: 'Symptom Tracker',
            description: 'Log your dog\'s allergy symptoms, including severity and frequency, to monitor their health over time.',
            image: '/assets/pet-images/app1.png',
            bgColor: 'bg-white dark:bg-gray-800'
        },
        {
            id: 2,
            title: 'Trigger Detective',
            description: 'Identify potential allergy triggers by tracking your dog\'s exposure to different environments, foods, and products.',
            image: '/assets/pet-images/detective.png',
            bgColor: 'bg-orange-200'
        }
    ];

    const handleNext = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(currentSlide + 1);
        } else {
            navigate('/welcome');
        }
    };

    const handleSkip = () => {
        navigate('/welcome');
    };

    return (
        <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
            {/* Slide Content */}
            <div className="flex-1 flex flex-col">
                {/* Image Section */}
                <div className={`w-full h-80 flex items-center justify-center ${slides[currentSlide].bgColor}`}>
                    <img
                        src={slides[currentSlide].image}
                        alt={slides[currentSlide].title}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Text Content */}
                <div className="flex-1 bg-white dark:bg-gray-900 rounded-t-3xl -mt-6 p-8 shadow-lg">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        {slides[currentSlide].title}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                        {slides[currentSlide].description}
                    </p>

                    {/* Next Button */}
                    <button
                        onClick={handleNext}
                        className="w-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-colors shadow-lg mb-4"
                    >
                        {currentSlide < slides.length - 1 ? 'Next' : 'Get Started'}
                    </button>

                    {/* Pagination Dots */}
                    <div className="flex justify-center gap-2 mt-6">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`w-2 h-2 rounded-full transition-all ${
                                    index === currentSlide
                                        ? 'bg-blue-500 dark:bg-blue-600 w-8'
                                        : 'bg-gray-300 dark:bg-gray-600'
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
