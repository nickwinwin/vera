'use client';

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

export type UserRole = 'admin' | 'clinic' | 'client';

interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  clinicId?: string;
  clinicSlug?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const firstMount = useRef(true);

  useEffect(() => {
    if (firstMount.current) {
      firstMount.current = false;
      return;
    }
    let cancelled = false;
    const TIMEOUT_MS = 15000;

    const timeoutId = setTimeout(() => {
      if (!cancelled) {
        setIsLoading(false);
      }
    }, TIMEOUT_MS);

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (cancelled) return;
      clearTimeout(timeoutId);
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user);
      } else {
        setIsLoading(false);
      }
    }).catch(() => {
      if (!cancelled) {
        clearTimeout(timeoutId);
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (cancelled) return;
      setSession(session);
      if (session?.user) {
        const profile = await fetchUserProfile(session.user);
        if (event === 'SIGNED_IN' && profile) {
          if (profile.role === 'admin') router.push('/admin');
          else if (profile.role === 'clinic') router.push('/dashboard');
        }
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, [router]);

  const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      // Check if user is a clinic owner
      let { data: clinic } = await supabase
        .from('clinics')
        .select('id, slug, name')
        .eq('owner_id', supabaseUser.id)
        .single();

      // If no clinic exists, create a default one for the user
      if (!clinic) {
        const defaultSlug = supabaseUser.email?.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '-') || 'my-clinic';
        const { data: newClinic, error: createError } = await supabase
          .from('clinics')
          .insert({
            name: 'Meine Klinik',
            slug: `${defaultSlug}-${Math.random().toString(36).substring(2, 5)}`,
            owner_id: supabaseUser.id,
            email: supabaseUser.email
          })
          .select()
          .single();
        
        if (createError) throw createError;
        clinic = newClinic;
      }

      const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase());
      const role: UserRole = adminEmails.includes(supabaseUser.email?.toLowerCase() || '') ? 'admin' : 'clinic';

      const profile: User = {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        role: role,
        name: clinic?.name || supabaseUser.email?.split('@')[0] || '',
        clinicId: clinic?.id,
        clinicSlug: clinic?.slug
      };
      
      setUser(profile);
      return profile;
    } catch (error: any) {
      // Silent fail for unauthenticated users
      if (error?.message?.includes('relation') || error?.code === '42P01') {
        console.warn('[Auth] Supabase tables not ready yet.');
      } else if (supabaseUser) {
        console.warn('[Auth] Could not load profile for', supabaseUser.email);
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const result = await Promise.race([
        supabase.auth.signInWithPassword({ email, password }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Der Server antwortet nicht. Bitte versuchen Sie es später erneut.')), 15000)
        ),
      ]);
      return { error: (result as { error: any })?.error };
    } catch (err: any) {
      return { error: err };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, session, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
