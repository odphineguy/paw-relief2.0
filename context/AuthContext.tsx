import React, { createContext, useState, useContext, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    signIn: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
    signUp: (email: string, password: string) => Promise<any>;
    signInWithGoogle: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    updatePassword: (newPassword: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Handle OAuth callback - check if URL contains access_token (from OAuth redirect)
        const handleOAuthCallback = async () => {
            const hash = window.location.hash;
            
            // Check if this is an OAuth callback (has access_token in hash but not a route)
            if (hash && hash.includes('access_token=') && !hash.startsWith('#/')) {
                // Extract the tokens from hash and let Supabase handle them
                // The detectSessionInUrl option will pick these up
                const { data: { session }, error } = await supabase.auth.getSession();
                
                if (session && !error) {
                    setSession(session);
                    setUser(session.user);
                    setLoading(false);
                    // Clean up URL and redirect to dashboard
                    window.location.replace(window.location.origin + '/#/dashboard');
                    return;
                }
            }
            
            // Normal session check
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        };

        handleOAuthCallback();

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
            
            // If signed in via OAuth, redirect to dashboard
            if (event === 'SIGNED_IN' && session) {
                const currentHash = window.location.hash;
                // Only redirect if we're not already on a valid route
                if (!currentHash.startsWith('#/') || currentHash === '#/login' || currentHash === '#/splash') {
                    window.location.replace(window.location.origin + '/#/dashboard');
                }
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const signIn = useCallback(async (email: string, password: string, rememberMe: boolean = true) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            throw error;
        }

        // If "remember me" is unchecked, mark session for cleanup on browser close
        if (!rememberMe) {
            sessionStorage.setItem('pawrelief_temp_session', 'true');
        } else {
            sessionStorage.removeItem('pawrelief_temp_session');
        }

        setSession(data.session);
        setUser(data.user);
    }, []);

    const signUp = useCallback(async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            throw error;
        }

        setSession(data.session);
        setUser(data.user);

        return data;
    }, []);

    const signInWithGoogle = useCallback(async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                // Redirect to origin - AuthContext will handle routing to dashboard
                // This avoids conflicts with HashRouter
                redirectTo: window.location.origin,
            },
        });

        if (error) {
            throw error;
        }
    }, []);

    const resetPassword = useCallback(async (email: string) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            // For password reset, we can use the hash route since it's a different flow
            redirectTo: `${window.location.origin}/#/reset-password`,
        });

        if (error) {
            throw error;
        }
    }, []);

    const updatePassword = useCallback(async (newPassword: string) => {
        const { error } = await supabase.auth.updateUser({
            password: newPassword,
        });

        if (error) {
            throw error;
        }
    }, []);

    const signOut = useCallback(async () => {
        const { error } = await supabase.auth.signOut();

        if (error) {
            throw error;
        }

        sessionStorage.removeItem('pawrelief_temp_session');
        setSession(null);
        setUser(null);
    }, []);

    // Handle "remember me" - clear session on browser close if not remembered
    useEffect(() => {
        const handleBeforeUnload = () => {
            if (sessionStorage.getItem('pawrelief_temp_session') === 'true') {
                // Sign out will happen, clearing the persisted session
                supabase.auth.signOut();
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, []);

    const value = useMemo(
        () => ({ user, session, loading, signIn, signUp, signInWithGoogle, resetPassword, updatePassword, signOut }),
        [user, session, loading, signIn, signUp, signInWithGoogle, resetPassword, updatePassword, signOut]
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
