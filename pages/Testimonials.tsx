import React from 'react';
import { useNavigate } from 'react-router-dom';

const Testimonials: React.FC = () => {
    const navigate = useNavigate();

    const testimonials = [
        {
            id: 1,
            text: "This app has been a lifesaver for managing my dog's allergies! I can now track symptoms and identify triggers, leading to no more incessant scratching for Buddy.",
            author: "Sarah, Buddy's Owner",
            image: "/assets/testimonials/golden.png",
            breed: "Golden Retriever"
        },
        {
            id: 2,
            text: "I can finally pinpoint what triggers my dog's allergies thanks to this app! After months of discovery, I've finally identified the trigger for Max!",
            author: "Mark, Max's Owner",
            image: "/assets/testimonials/lab.png",
            breed: "Labrador"
        },
        {
            id: 3,
            text: "The trigger detective feature helped me understand that pollen was causing most of Lucy's symptoms. Now we avoid peak hours!",
            author: "Jennifer, Lucy's Owner",
            image: "/assets/testimonials/frenchie.png",
            breed: "French Bulldog"
        },
        {
            id: 4,
            text: "Tracking Charlie's medication schedule has never been easier. The reminders ensure I never miss a dose!",
            author: "David, Charlie's Owner",
            image: "/assets/testimonials/dachshund.png",
            breed: "Dachshund"
        },
        {
            id: 5,
            text: "The vet report feature is amazing! I can share detailed allergy data with my vet and get better treatment recommendations.",
            author: "Lisa, Bella's Owner",
            image: "/assets/testimonials/Chihuahua.png",
            breed: "Chihuahua"
        },
        {
            id: 6,
            text: "Paw Relief helped me identify that my dog was allergic to a specific ingredient in his food. Life-changing!",
            author: "Tom, Rocky's Owner",
            image: "/assets/testimonials/pitbull.png",
            breed: "Pit Bull"
        }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
            {/* Header */}
            <div className="p-6 pb-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
                    Paw Relief
                </h1>
            </div>

            {/* Testimonial Cards - Scrollable */}
            <div className="flex-1 px-4 overflow-x-auto">
                <div className="flex gap-4 pb-6">
                    {testimonials.map((testimonial) => (
                        <div
                            key={testimonial.id}
                            className="flex-shrink-0 w-80 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
                        >
                            {/* Dog Image */}
                            <div className="w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden mb-4">
                                <img
                                    src={testimonial.image}
                                    alt={testimonial.breed}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Testimonial Text */}
                            <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed mb-4">
                                "{testimonial.text}"
                            </p>

                            {/* Author */}
                            <p className="text-gray-600 dark:text-gray-400 text-sm italic">
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
                    className="w-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-colors shadow-lg"
                >
                    Get Started
                </button>
            </div>
        </div>
    );
};

export default Testimonials;
