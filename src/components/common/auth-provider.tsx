'use client';

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import { createSupabaseBrowserClient } from '@/utils/supabase/client';

type ProfileRow = Database['public']['Tables']['profiles']['Row'];

interface AuthCredentials {
  email: string;
  password: string;
}

interface SignUpPayload extends AuthCredentials {
  displayName?: string;
}

interface AuthContextValue {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: User | null;
  profile: ProfileRow | null;
  signIn: (payload: AuthCredentials) => Promise<{ error: string | null }>;
  signUp: (payload: SignUpPayload) => Promise<{ error: string | null; needsEmailVerification: boolean }>;
  signOut: () => Promise<{ error: string | null }>;
  refreshProfile: () => Promise<void>;
  updateDisplayName: (displayName: string) => Promise<{ error: string | null }>;
  updateEmail: (email: string) => Promise<{ error: string | null }>;
  updatePassword: (password: string) => Promise<{ error: string | null }>;
  deleteAccount: () => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function getDisplayName(user: User, explicitDisplayName?: string) {
  if (explicitDisplayName?.trim()) {
    return explicitDisplayName.trim();
  }

  const metadataName = typeof user.user_metadata?.display_name === 'string' ? user.user_metadata.display_name : null;
  if (metadataName?.trim()) {
    return metadataName.trim();
  }

  return user.email?.split('@')[0] ?? 'Member';
}

async function upsertAndFetchProfile(supabase: SupabaseClient<Database>, user: User, displayName?: string) {
  const email = user.email;
  if (!email) {
    throw new Error('Authenticated user has no email.');
  }

  const { error: upsertError } = await supabase.from('profiles').upsert(
    {
      id: user.id,
      email,
      display_name: getDisplayName(user, displayName),
    },
    { onConflict: 'id' },
  );

  if (upsertError) {
    throw new Error(upsertError.message);
  }

  const { data: profile, error: selectError } = await supabase.from('profiles').select('*').eq('id', user.id).single();

  if (selectError) {
    throw new Error(selectError.message);
  }

  return profile;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [supabase] = useState(() => createSupabaseBrowserClient());
  const [isLoading, setIsLoading] = useState(() => Boolean(supabase));
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);

  const refreshProfile = useCallback(async () => {
    if (!supabase || !user) {
      setProfile(null);
      return;
    }

    try {
      const loadedProfile = await upsertAndFetchProfile(supabase, user);
      setProfile(loadedProfile);
    } catch {
      setProfile(null);
    }
  }, [supabase, user]);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    let mounted = true;

    const initialize = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!mounted) return;

      if (error || !data.session?.user) {
        setUser(null);
        setProfile(null);
        setIsLoading(false);
        return;
      }

      setUser(data.session.user);
      try {
        const loadedProfile = await upsertAndFetchProfile(supabase, data.session.user);
        if (mounted) {
          setProfile(loadedProfile);
        }
      } catch {
        if (mounted) {
          setProfile(null);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    void initialize();

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user ?? null;
      setUser(nextUser);

      if (!nextUser) {
        setProfile(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      void upsertAndFetchProfile(supabase, nextUser)
        .then((loadedProfile) => {
          if (mounted) {
            setProfile(loadedProfile);
          }
        })
        .catch(() => {
          if (mounted) {
            setProfile(null);
          }
        })
        .finally(() => {
          if (mounted) {
            setIsLoading(false);
          }
        });
    });

    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
  }, [supabase]);

  const signIn = useCallback(
    async ({ email, password }: AuthCredentials) => {
      if (!supabase) {
        return { error: 'Supabase is not configured.' };
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      return { error: error?.message ?? null };
    },
    [supabase],
  );

  const signUp = useCallback(
    async ({ email, password, displayName }: SignUpPayload) => {
      if (!supabase) {
        return { error: 'Supabase is not configured.', needsEmailVerification: false };
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_APP_URL
            ? `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`
            : undefined,
          data: {
            display_name: displayName?.trim() || undefined,
          },
        },
      });

      if (error) {
        return { error: error.message, needsEmailVerification: false };
      }

      const hasSession = Boolean(data.session);
      if (data.user && hasSession) {
        try {
          const loadedProfile = await upsertAndFetchProfile(supabase, data.user, displayName);
          setProfile(loadedProfile);
          setUser(data.user);
        } catch {
          return {
            error:
              'Account created, but profile sync failed. Run the profile migration and sign in again.',
            needsEmailVerification: false,
          };
        }
      }

      return {
        error: null,
        needsEmailVerification: !hasSession,
      };
    },
    [supabase],
  );

  const signOut = useCallback(async () => {
    if (!supabase) {
      return { error: 'Supabase is not configured.' };
    }

    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
      setProfile(null);
    }
    return { error: error?.message ?? null };
  }, [supabase]);

  const updateDisplayName = useCallback(
    async (displayName: string) => {
      if (!supabase || !user) {
        return { error: 'You must be signed in.' };
      }

      const nextName = displayName.trim();
      if (!nextName) {
        return { error: 'Display name cannot be empty.' };
      }

      const { error: metadataError } = await supabase.auth.updateUser({
        data: { display_name: nextName },
      });

      if (metadataError) {
        return { error: metadataError.message };
      }

      const { error: rowError } = await supabase
        .from('profiles')
        .update({ display_name: nextName })
        .eq('id', user.id);

      if (rowError) {
        return { error: rowError.message };
      }

      await refreshProfile();
      return { error: null };
    },
    [refreshProfile, supabase, user],
  );

  const updateEmail = useCallback(
    async (email: string) => {
      if (!supabase || !user) {
        return { error: 'You must be signed in.' };
      }

      const nextEmail = email.trim();
      const { error } = await supabase.auth.updateUser({
        email: nextEmail,
      });

      if (error) {
        return { error: error.message };
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .update({ email: nextEmail })
        .eq('id', user.id);

      if (profileError) {
        return { error: profileError.message };
      }

      await refreshProfile();
      return { error: null };
    },
    [refreshProfile, supabase, user],
  );

  const updatePassword = useCallback(
    async (password: string) => {
      if (!supabase || !user) {
        return { error: 'You must be signed in.' };
      }

      const { error } = await supabase.auth.updateUser({ password });
      return { error: error?.message ?? null };
    },
    [supabase, user],
  );

  const deleteAccount = useCallback(async () => {
    if (!supabase) {
      return { error: 'Supabase is not configured.' };
    }

    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData.session?.access_token;

    if (!accessToken) {
      return { error: 'No active session found.' };
    }

    const response = await fetch('/api/account/delete', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => ({ error: 'Could not delete account.' }))) as {
        error?: string;
      };
      return { error: payload.error ?? 'Could not delete account.' };
    }

    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    return { error: null };
  }, [supabase]);

  const value = useMemo<AuthContextValue>(
    () => ({
      isLoading,
      isAuthenticated: Boolean(user),
      user,
      profile,
      signIn,
      signUp,
      signOut,
      refreshProfile,
      updateDisplayName,
      updateEmail,
      updatePassword,
      deleteAccount,
    }),
    [
      isLoading,
      user,
      profile,
      signIn,
      signUp,
      signOut,
      refreshProfile,
      updateDisplayName,
      updateEmail,
      updatePassword,
      deleteAccount,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
