import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginSignup: React.FC = () => {
    const navigate = useNavigate();
    const { signIn, signUp } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isSignUp) {
                await signUp(email, password);
                // Navigate to onboarding for new users
                navigate('/onboarding');
            } else {
                await signIn(email, password);
                // Navigate to dashboard for existing users
                navigate('/dashboard');
            }
        } catch (err: any) {
            setError(err.message || 'Authentication failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
            {/* Dog Illustration Header */}
            <div className="w-full h-64 bg-orange-200 dark:bg-orange-300 flex items-center justify-center">
                <img 
                    src="/assets/pet-images/boxerLogin.png" 
                    alt="Boxer dog illustration" 
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Login Form */}
            <div className="flex-1 bg-white dark:bg-gray-900 rounded-t-3xl -mt-6 p-6 shadow-lg">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                    {isSignUp ? 'Create Account' : 'Welcome to Paw Relief'}
                </h1>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 rounded-lg text-red-700 dark:text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    {/* Email Input */}
                    <div>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email or Username"
                            className="w-full p-4 bg-blue-50 dark:bg-gray-800 border-none rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                            required
                        />
                    </div>

                    {/* Password Input */}
                    <div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full p-4 bg-blue-50 dark:bg-gray-800 border-none rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                            required
                        />
                    </div>

                    {/* Forgot Password */}
                    <div className="text-right">
                        <button
                            type="button"
                            className="text-sm text-cyan-600 dark:text-cyan-400 hover:underline"
                        >
                            Forgot Password?
                        </button>
                    </div>

                    {/* Log In Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-colors shadow-lg"
                    >
                        {loading ? 'Please wait...' : (isSignUp ? 'Sign Up' : 'Log In')}
                    </button>
                </form>

                {/* Divider */}
                <div className="flex items-center my-6">
                    <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
                    <span className="px-4 text-sm text-gray-500 dark:text-gray-400">Or continue with</span>
                    <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
                </div>

                {/* Social Login Buttons */}
                <div className="grid grid-cols-2 gap-4">
                    <button
                        type="button"
                        className="flex items-center justify-center gap-2 p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        <span className="text-xl">G</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">Google</span>
                    </button>
                    <button
                        type="button"
                        className="flex items-center justify-center gap-2 p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        <span className="text-xl">f</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">Facebook</span>
                    </button>
                </div>

                {/* Sign Up Link */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                        <button
                            type="button"
                            onClick={() => {
                                setIsSignUp(!isSignUp);
                                setError('');
                            }}
                            className="text-cyan-600 dark:text-cyan-400 hover:underline font-medium"
                        >
                            {isSignUp ? 'Log In' : 'Sign Up'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginSignup;
