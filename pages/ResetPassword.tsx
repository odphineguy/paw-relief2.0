import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ResetPassword: React.FC = () => {
    const navigate = useNavigate();
    const { updatePassword, session } = useAuth();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Check if user arrived via password reset link (they'll have a session from the link)
    useEffect(() => {
        if (!session) {
            // Give it a moment for the session to be established from the URL
            const timer = setTimeout(() => {
                if (!session) {
                    setError('Invalid or expired reset link. Please request a new one.');
                }
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [session]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validate passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        // Validate password strength
        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        setLoading(true);

        try {
            await updatePassword(password);
            setSuccess(true);
            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
        } catch (err: any) {
            setError(err.message || 'Failed to update password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
            {/* Header */}
            <div className="w-full h-32 bg-blue-500 dark:bg-blue-600 flex items-center justify-center">
                <h1 className="text-3xl font-bold text-white">🐾 Paw Relief</h1>
            </div>

            {/* Reset Password Form */}
            <div className="flex-1 bg-white dark:bg-gray-900 rounded-t-3xl -mt-6 p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                    Set New Password
                </h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 rounded-lg text-red-700 dark:text-red-400 text-sm">
                        {error}
                    </div>
                )}

                {success ? (
                    <div className="mb-4 p-4 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-700 rounded-lg text-green-700 dark:text-green-400 text-sm text-center">
                        <p className="font-semibold mb-2">✓ Password Updated!</p>
                        <p>Your password has been successfully changed. Redirecting to dashboard...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
                            Enter your new password below.
                        </p>

                        {/* New Password */}
                        <div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="New Password"
                                className="w-full p-4 bg-blue-50 dark:bg-gray-800 border-none rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                                minLength={6}
                            />
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm New Password"
                                className="w-full p-4 bg-blue-50 dark:bg-gray-800 border-none rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                                minLength={6}
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || !session}
                            className="w-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-colors shadow-lg"
                        >
                            {loading ? 'Updating...' : 'Update Password'}
                        </button>

                        {/* Back to Login */}
                        <button
                            type="button"
                            onClick={() => navigate('/login')}
                            className="w-full text-sm text-cyan-600 dark:text-cyan-400 hover:underline py-2"
                        >
                            ← Back to Login
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
