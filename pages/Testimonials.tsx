import React from 'react';
import { useNavigate } from 'react-router-dom';

const Testimonials: React.FC = () => {
    const navigate = useNavigate();

    const testimonials = [
        {
            id: 1,
            text: "This app has been a lifesaver for managing my dog's allergies! I can now track symptoms and identify triggers, leading to no more incessant scratching for Buddy.",
            author: "Sarah, Buddy's Owner",
            image: "🦮"
        },
        {
            id: 2,
            text: "I can finally pinpoint what triggers my dog's allergies thanks to this app! After months of discovery, I've finally identified the trigger for Max!",
            author: "Mark, Max's Owner",
            image: "🦴"
        },
        {
            id: 3,
            text: "The trigger detective feature helped me understand that pollen was causing most of Lucy's symptoms. Now we avoid peak hours!",
            author: "Jennifer, Lucy's Owner",
            image: "🐕‍🦺"
        }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
            {/* Header */}
            <div className="p-6 pb-4">
                <h2 className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    User Testimonials
                </h2>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center mt-2">
                    Paw Relief
                </h1>
            </div>

            {/* Testimonial Cards - Scrollable */}
            <div className="flex-1 px-4 overflow-x-auto">
                <div className="flex gap-4 pb-6">
                    {testimonials.map((testimonial) => (
                        <div
                            key={testimonial.id}
                            className="flex-shrink-0 w-80 bg-orange-100 dark:bg-orange-200 rounded-2xl p-6 shadow-lg"
                        >
                            {/* Dog Image Placeholder */}
                            <div className="w-full h-48 bg-orange-200 dark:bg-orange-300 rounded-xl flex items-center justify-center mb-4">
                                <div className="text-6xl">{testimonial.image}</div>
                            </div>

                            {/* Testimonial Text */}
                            <p className="text-gray-800 text-sm leading-relaxed mb-4">
                                "{testimonial.text}"
                            </p>

                            {/* Author */}
                            <p className="text-gray-600 text-sm italic">
                                - {testimonial.author}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Get Started Button */}
            <div className="p-6">
                <button
                    onClick={() => navigate('/login')}
                    className="w-full bg-cyan-400 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl transition-colors shadow-lg"
                >
                    Get Started
                </button>
            </div>
        </div>
    );
};

export default Testimonials;
