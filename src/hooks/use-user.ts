'use client';

export function useUser() {
  return {
    user: {
      id: 'u1',
      email: 'you@example.com',
      displayName: 'You',
    },
    isAuthenticated: false,
  };
}

