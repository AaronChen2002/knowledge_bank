// extension/src/hooks/useAuth.ts
import { useState } from 'react';

/**
 * A mock authentication hook.
 * 
 * In a real application, this would be replaced with a proper authentication
 * context that interacts with a service like Clerk, Supabase, or your own backend.
 * It would handle tokens, user profiles, and session management.
 * 
 * For now, it provides a simple way to toggle the authentication state for UI development.
 */
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = () => {
    console.log('Mock login successful');
    setIsAuthenticated(true);
  };

  const logout = () => {
    console.log('Mock logout successful');
    setIsAuthenticated(false);
  };

  // In a real hook, you might also return a user object, loading states, etc.
  return {
    isAuthenticated,
    login,
    logout,
  };
}; 