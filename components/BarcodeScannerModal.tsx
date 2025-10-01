import React, { useState, useEffect } from 'react';
import { useDogs } from '../context/DogContext';
import { ProductInfo } from '../types';
import { scanBarcode } from '../services/api';
import { XIcon, PawIcon, BarcodeIcon, AlertTriangleIcon } from './icons';

interface BarcodeScannerModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type ScanStatus = 'scanning' | 'result' | 'error';

const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({ isOpen, onClose }) => {
    const { selectedDog } = useDogs();
    const [status, setStatus] = useState<ScanStatus>('scanning');
    const [product, setProduct] = useState<ProductInfo | null>(null);
    const [allergens, setAllergens] = useState<string[]>([]);

    useEffect(() => {
        if (isOpen) {
            performScan();
        } else {
            // Reset state when modal is closed
            setStatus('scanning');
            setProduct(null);
            setAllergens([]);
        }
    }, [isOpen]);

    const performScan = async () => {
        setStatus('scanning');
        if (!selectedDog) {
            setStatus('error');
            return;
        }

        try {
            // Simulate scanning a random barcode
            const result = await scanBarcode('123456789');
            if (result) {
                setProduct(result);
                const foundAllergens = result.ingredients.filter(ingredient => 
                    selectedDog.knownAllergies.some(known => 
                        ingredient.toLowerCase().includes(known.toLowerCase())
                    )
                );
                setAllergens(foundAllergens);
                setStatus('result');
            } else {
                setStatus('error');
            }
        } catch (err) {
            console.error(err);
            setStatus('error');
        }
    };

    const renderContent = () => {
        switch (status) {
            case 'scanning':
                return (
                    <div className="text-center p-8">
                        <div className="relative w-48 h-32 mx-auto overflow-hidden rounded-lg">
                            <BarcodeIcon className="w-full h-full text-gray-300 dark:text-gray-600" />
                            <div className="absolute left-0 w-full h-1 bg-red-500 scanner-line"></div>
                        </div>
                        <p className="mt-4 font-semibold text-text-200 dark:text-text-100">Scanning for barcode...</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Please center the barcode in the frame.</p>
                    </div>
                );
            case 'result':
                if (!product) return null;
                return (
                    <div className="p-6">
                        <div className="flex items-center space-x-4 mb-4">
                             <img src={product.imageUrl} alt={product.name} className="w-20 h-20 rounded-lg object-cover" />
                             <div>
                                <h3 className="text-lg font-bold text-text-200 dark:text-text-100">{product.name}</h3>
                                {allergens.length > 0 ? (
                                    <div className="mt-1 flex items-center text-red-500">
                                        <AlertTriangleIcon className="w-5 h-5 mr-1" />
                                        <span className="font-semibold">{allergens.length} potential allergen(s) found.</span>
                                    </div>
                                ) : (
                                    <p className="text-green-600 font-semibold mt-1">No known allergens found for {selectedDog?.name}.</p>
                                )}
                             </div>
                        </div>
                        <div className="h-48 overflow-y-auto bg-bg-200 dark:bg-bg-200 p-3 rounded-lg">
                            <h4 className="font-bold mb-2 text-text-200 dark:text-text-100">Ingredients:</h4>
                            <ul className="space-y-1 text-sm">
                                {product.ingredients.map((item, index) => {
                                    const isAllergen = allergens.some(a => item.toLowerCase().includes(a.toLowerCase()));
                                    return (
                                        <li key={index} className={`flex items-center ${isAllergen ? 'text-red-500 font-bold' : 'text-text-200 dark:text-text-200'}`}>
                                            {isAllergen && <AlertTriangleIcon className="w-4 h-4 mr-2 flex-shrink-0" />}
                                            {item}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                );
            case 'error':
                 return (
                    <div className="text-center p-8">
                        <PawIcon className="w-12 h-12 text-red-400 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-text-200 dark:text-text-100">Scan Failed</h3>
                        <p className="text-gray-500 dark:text-gray-400">Could not read barcode. Please try again.</p>
                    </div>
                );
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-bg-100 dark:bg-bg-100 rounded-2xl shadow-xl w-full max-w-md flex flex-col">
                <div className="p-4 border-b border-bg-200 dark:border-bg-300 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-text-200 dark:text-text-100">Ingredient Checker</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><XIcon /></button>
                </div>
                
                <div className="flex-grow">
                    {renderContent()}
                </div>

                <div className="p-4 border-t border-bg-200 dark:border-bg-300">
                    <button 
                        onClick={performScan} 
                        className="w-full bg-accent-200 text-white font-bold py-3 px-4 rounded-lg hover:bg-accent-100 transition-colors"
                    >
                        Scan Again
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BarcodeScannerModal;
