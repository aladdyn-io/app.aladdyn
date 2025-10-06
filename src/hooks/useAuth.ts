import { useState } from 'react';

interface AuthData {
  user?: any;
  error?: string;
  action?: string;
}

interface AuthOptions {
  onSuccess?: (data: AuthData) => void;
  onError?: (error: Error) => void;
}

interface AuthError {
  message: string;
}

export function useAuth() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isOAuthSigningIn, setIsOAuthSigningIn] = useState(false);
  const [authError, setAuthError] = useState<AuthError | null>(null);
  const [oauthError, setOauthError] = useState<AuthError | null>(null);

  const authenticate = async (
    credentials: { email: string; password: string },
    options: AuthOptions = {}
  ) => {
    setIsAuthenticating(true);
    setAuthError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock authentication logic
      if (credentials.email === 'demo@example.com' && credentials.password === 'password') {
        const authData: AuthData = {
          user: { id: 1, email: credentials.email },
          action: 'signin'
        };
        options.onSuccess?.(authData);
      } else {
        const authData: AuthData = {
          error: 'Invalid email or password'
        };
        options.onSuccess?.(authData);
      }
    } catch (error) {
      const authError = error as Error;
      setAuthError(authError);
      options.onError?.(authError);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const signInWithOAuth = async (provider: 'google' | 'github') => {
    setIsOAuthSigningIn(true);
    setOauthError(null);

    try {
      // Simulate OAuth flow
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock OAuth success
      console.log(`${provider} OAuth sign-in successful`);
      
      // In a real app, you would redirect to OAuth provider
      // window.location.href = `/auth/${provider}`;
    } catch (error) {
      const oauthError = error as Error;
      setOauthError(oauthError);
    } finally {
      setIsOAuthSigningIn(false);
    }
  };

  return {
    authenticate,
    signInWithOAuth,
    isAuthenticating,
    isOAuthSigningIn,
    authError,
    oauthError
  };
}
