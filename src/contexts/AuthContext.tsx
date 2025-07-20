import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface AuthContextType {
  user: any;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) {
      console.error('❌ ERREUR: Le client Supabase est undefined. Vérifiez la configuration et le .env.local.');
      setLoading(false);
      return;
    }
    const getUser = async () => {
      try {
        if (!supabase) throw new Error('Supabase client non initialisé');
        const { data, error } = await supabase.auth.getSession();
        console.log('Résultat getSession:', { data, error }); // LOG DEBUG
        if (error) throw error;
        setUser(data?.session?.user ?? null);
      } catch (err: any) {
        setError('Erreur lors de la récupération de l’utilisateur.');
        setUser(null);
        console.error('Erreur détaillée Supabase getSession:', err); // LOG DEBUG
      } finally {
        setLoading(false);
      }
    };
    getUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setUser(session?.user ?? null);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (!supabase) {
    return (
      <AuthContext.Provider value={{ user: null, loading: false, signUp: async () => {}, signIn: async () => {}, signOut: async () => {}, signInWithGoogle: async () => {} }}>
        <div style={{color: 'red', padding: 16}}>Erreur critique: Supabase non initialisé. Vérifiez la configuration.</div>
        {children}
      </AuthContext.Provider>
    );
  }

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      if (!supabase) throw new Error('Supabase client non initialisé');
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      return data;
    } catch (err: any) {
      setError('Erreur lors de l’inscription.');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      if (!supabase) throw new Error('Supabase client non initialisé');
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    } catch (err: any) {
      setError('Erreur lors de la connexion.');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!supabase) throw new Error('Supabase client non initialisé');
      await supabase.auth.signOut();
      setUser(null);
    } catch (err: any) {
      setError('Erreur lors de la déconnexion.');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!supabase) throw new Error('Supabase client non initialisé');
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
      if (error) throw error;
    } catch (err: any) {
      setError('Erreur lors de la connexion Google.');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, signInWithGoogle }}>
      {error && <div style={{color: 'red', padding: 8}}>{error}</div>}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}; 