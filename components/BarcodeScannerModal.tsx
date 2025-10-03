import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
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
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const isScanning = useRef(false);

    useEffect(() => {
        if (isOpen) {
            startScanner();
        } else {
            stopScanner();
            // Reset state when modal is closed
            setStatus('scanning');
            setProduct(null);
            setAllergens([]);
        }

        return () => {
            stopScanner();
        };
    }, [isOpen]);

    const startScanner = async () => {
        if (!selectedDog || isScanning.current) {
            console.log("Cannot start scanner:", { selectedDog, isScanning: isScanning.current });
            return;
        }

        try {
            setStatus('scanning');

            // Wait for DOM to be ready
            await new Promise(resolve => setTimeout(resolve, 50));

            // Check if scanner element exists
            const scannerElement = document.getElementById("barcode-scanner");
            if (!scannerElement) {
                console.error("Scanner element not found in DOM");
                throw new Error("Scanner element not ready");
            }

            // Check if we're in a secure context
            console.log("Is secure context:", window.isSecureContext);
            console.log("Protocol:", window.location.protocol);

            // Request camera permission first
            console.log("Requesting camera permission...");
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
                console.log("Camera permission granted");
                // Stop the test stream
                stream.getTracks().forEach(track => track.stop());
            } catch (permErr) {
                console.error("Camera permission error:", permErr);
                throw new Error(`Camera permission denied: ${permErr instanceof Error ? permErr.message : 'Unknown error'}`);
            }

            const scanner = new Html5Qrcode("barcode-scanner");
            scannerRef.current = scanner;

            console.log("Getting available cameras...");
            const cameras = await Html5Qrcode.getCameras();
            console.log("Available cameras:", cameras);

            if (!cameras || cameras.length === 0) {
                throw new Error("No cameras found on this device");
            }

            // Try to find the back camera, otherwise use the first available
            const backCamera = cameras.find(camera =>
                camera.label.toLowerCase().includes('back') ||
                camera.label.toLowerCase().includes('rear')
            );
            const cameraId = backCamera ? backCamera.id : cameras[cameras.length - 1].id;

            console.log("Starting camera with ID:", cameraId);
            await scanner.start(
                cameraId,
                {
                    fps: 10,
                    qrbox: { width: 250, height: 150 },
                    formatsToSupport: [0, 1, 2, 3, 4, 5, 6, 7, 8] // Support all barcode formats
                },
                async (decodedText) => {
                    // Success callback when barcode is scanned
                    console.log("Barcode detected:", decodedText);
                    isScanning.current = false;
                    await stopScanner();
                    await processBarcode(decodedText);
                },
                (errorMessage) => {
                    // Error callback - we can ignore most scanning errors
                    // as they happen frequently while searching for a code
                }
            );

            console.log("Camera started successfully");
            isScanning.current = true;
        } catch (err) {
            console.error("Scanner initialization error:", err);
            const errorMsg = err instanceof Error ? err.message : JSON.stringify(err);
            alert(`Camera error: ${errorMsg}\n\nNote: Camera requires HTTPS or localhost. You're accessing via: ${window.location.href}`);
            setStatus('error');
        }
    };

    const stopScanner = async () => {
        if (scannerRef.current) {
            try {
                if (isScanning.current) {
                    await scannerRef.current.stop();
                }
                scannerRef.current.clear();
            } catch (err) {
                console.error("Error stopping scanner:", err);
            } finally {
                scannerRef.current = null;
                isScanning.current = false;
            }
        }
    };

    const processBarcode = async (barcode: string) => {
        if (!selectedDog) {
            setStatus('error');
            return;
        }

        try {
            const result = await scanBarcode(barcode);
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

    const handleScanAgain = async () => {
        // First stop any existing scanner
        await stopScanner();

        // Reset state
        setProduct(null);
        setAllergens([]);
        setStatus('scanning');

        // Wait for React to re-render before starting scanner
        setTimeout(() => {
            startScanner();
        }, 200);
    };

    const renderContent = () => {
        switch (status) {
            case 'scanning':
                return (
                    <div className="text-center p-4">
                        <div id="barcode-scanner" className="w-full rounded-lg overflow-hidden"></div>
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
                    <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg m-4">
                        <PawIcon className="w-12 h-12 text-red-400 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Product Not Found</h3>
                        <p className="text-gray-700 dark:text-gray-300">This product isn't in our database yet. Try scanning a different product or contact support to add it.</p>
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

                {status === 'result' || status === 'error' ? (
                    <div className="p-4 border-t border-bg-200 dark:border-bg-300">
                        <button
                            onClick={handleScanAgain}
                            className="w-full bg-accent-200 text-white font-bold py-3 px-4 rounded-lg hover:bg-accent-100 transition-colors"
                        >
                            Scan Again
                        </button>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default BarcodeScannerModal;
