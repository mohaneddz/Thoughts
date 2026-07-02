'use client';

import { useAuth } from '@/components/common/auth-provider';

export function useUser() {
  const { user, profile, isAuthenticated, isLoading } = useAuth();

  return {
    user: user
      ? {
          id: user.id,
          email: user.email ?? '',
          displayName: profile?.display_name ?? user.user_metadata?.display_name ?? 'Member',
        }
      : null,
    isAuthenticated,
    isLoading,
  };
}

